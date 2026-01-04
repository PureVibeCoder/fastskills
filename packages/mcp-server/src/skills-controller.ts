/**
 * Skills Controller MCP Server
 *
 * 智能技能编排控制器 - 根据上下文动态激活/停用技能
 * 自动扫描并加载技能库中的所有技能
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";
import {
  validateSkillsDirs,
  validatePath,
  validateFileForRead,
  validateEntryName,
  validateAnalyzeAndRouteArgs,
  validateSkillName,
  validateKeyword,
  sanitizePathForLog,
  createSafeErrorResponse,
  PathTraversalError,
  SymlinkEscapeError,
  SECURITY_LIMITS,
} from "./validation.js";

// ============================================
// 类型定义（必须在使用前声明）
// ============================================

/**
 * 用户意图类型枚举
 */
enum IntentType {
  CREATE = "create",         // 创建新内容（界面、组件、文件等）
  RESEARCH = "research",     // 研究、查看、学习源码
  DEBUG = "debug",           // 调试、修复bug
  REFACTOR = "refactor",     // 重构、优化代码
  DOCUMENT = "document",     // 编写文档
  TEST = "test",             // 编写/运行测试（通用，向后兼容）
  TEST_WRITE_UNIT = "test_write_unit",      // 编写单元测试
  TEST_WRITE_INTEGRATION = "test_write_integration",  // 编写集成测试
  TEST_WRITE_E2E = "test_write_e2e",        // 编写E2E测试
  TEST_RUN = "test_run",                    // 运行测试
  DEPLOY = "deploy",         // 部署、发布
  ANALYZE = "analyze",       // 分析、审查代码
  CONVERT = "convert",       // 转换格式
  CHAT = "chat",             // 闲聊、问答
  UNKNOWN = "unknown",       // 未知意图
}

/**
 * 意图识别模式
 */
interface IntentPattern {
  intent: IntentType;
  patterns: RegExp[];
  weight: number;
}

/**
 * 增强的技能配置
 */
interface SkillTriggerConfig {
  triggers?: { word: string; weight: number }[];  // 加权触发词
  excludes?: string[];                             // 排除词
  requiredIntents?: IntentType[];                  // 只在这些意图下激活
  excludedIntents?: IntentType[];                  // 在这些意图下不激活
  priority?: number;                               // 技能优先级 (1-10)
}

interface SkillMeta {
  name: string;
  description: string;
  triggers: string[];
  category: string;
  priority: number;
  path: string;        // 技能文件路径
  loaded: boolean;     // 是否已加载完整内容
}

interface ControllerState {
  activeSkills: Set<string>;
  context: string;
  lastAnalysis: Date;
}

// ============================================
// 配置
// ============================================

// 技能库目录（支持多个目录，用逗号分隔）
// 优先级：用户本地 > Anthropic 官方 > ClaudeKit > 社区
const DEFAULT_SKILLS_DIRS = [
  path.join(process.env.HOME || "", ".claude", "skills"),  // 用户本地技能（最高优先级）
  path.join(process.cwd(), "anthropic-skills", "skills"),
  path.join(process.cwd(), "claudekit-skills", ".claude", "skills"),
  path.join(process.cwd(), "awesome-claude-skills"),
  path.join(process.cwd(), "scientific-skills", "scientific-skills"),  // K-Dense AI 科学技能库 (138+ skills)
];

// Validate and filter skills directories
const rawSkillsDirs = process.env.SKILLS_DIR
  ? process.env.SKILLS_DIR.split(",").map(d => d.trim()).filter(d => d.length > 0)
  : DEFAULT_SKILLS_DIRS;

const SKILLS_DIRS: string[] = validateSkillsDirs(rawSkillsDirs);

// 额外的触发词映射（用于增强匹配）
const EXTRA_TRIGGERS: Record<string, string[]> = {
  // === Anthropic 官方技能 ===
  "algorithmic-art": ["算法艺术", "生成艺术", "generative", "art", "艺术", "算法绘画", "procedural"],
  "doc-coauthoring": ["协作", "coauthor", "共同编辑", "文档协作", "协同写作"],
  "docx": ["Word", "文档", "docx", "doc", "Microsoft Word", "办公文档"],
  "pdf": ["PDF", "pdf文件", "导出PDF", "PDF生成", "便携文档"],
  "pptx": ["PPT", "演示文稿", "PowerPoint", "幻灯片", "slides", "presentation"],
  "xlsx": ["Excel", "电子表格", "spreadsheet", "表格", "数据分析", "xlsx"],
  "web-artifacts-builder": ["web artifacts", "网页工件", "HTML生成", "网页构建"],
  "frontend-design": ["设计", "UI", "样式", "组件", "页面", "布局", "CSS", "React", "Vue", "前端", "界面", "交互"],

  // === 用户本地技能（最高优先级）===
  "modern-frontend-design": ["现代前端", "前端设计", "UI设计", "界面设计", "设计系统", "design system", "美学", "视觉", "React设计", "Vue设计", "组件设计", "neo-brutalist", "glassmorphism", "art deco"],
  "open-source-librarian": ["开源", "开源库", "库实现", "源码", "GitHub", "源代码", "library", "implementation", "permalink", "代码引用", "查源码", "开源项目", "原理", "实现原理", "怎么实现", "如何工作", "工作机制", "底层", "内部实现"],
  "browser": ["浏览器", "Chrome", "CDP", "DevTools", "自动化", "scraping", "抓取", "截图", "screenshot", "browser-start", "browser-nav", "puppeteer"],
  // webapp-testing 扩展触发词（与原有合并）

  // === ClaudeKit 独有技能 ===
  "aesthetic": ["美学", "审美", "视觉风格", "aesthetic", "设计感"],
  "ai-multimodal": ["多模态", "图像理解", "视觉AI", "multimodal", "vision"],
  "backend-development": ["后端", "服务端", "API开发", "backend", "server"],
  "better-auth": ["认证", "授权", "登录", "auth", "authentication", "JWT"],
  "chrome-devtools": ["Chrome", "DevTools", "浏览器调试", "开发者工具"],
  "claude-code": ["Claude Code", "CLI", "命令行"],
  "collision-zone-thinking": ["碰撞思维", "问题分析", "矛盾分析"],
  "context-engineering": ["上下文工程", "prompt工程", "提示词"],
  "databases": ["数据库", "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis"],
  "defense-in-depth": ["深度防御", "安全策略", "多层防护"],
  "devops": ["DevOps", "CI/CD", "部署", "运维", "Docker", "K8s"],
  "docs-seeker": ["文档搜索", "API文档", "查文档"],
  "frontend-development": ["前端开发", "JavaScript", "TypeScript", "框架"],
  "google-adk-python": ["Google ADK", "Python", "Google API"],
  "inversion-exercise": ["逆向思维", "反向推理"],
  "mcp-management": ["MCP管理", "服务器管理"],
  "media-processing": ["媒体处理", "音视频", "转码", "剪辑"],
  "mermaidjs-v11": ["Mermaid", "流程图", "时序图", "图表绘制"],
  "meta-pattern-recognition": ["模式识别", "元认知", "规律发现"],
  "repomix": ["代码库", "仓库分析", "代码统计"],
  "root-cause-tracing": ["根因分析", "问题追踪", "故障排查"],
  "scale-game": ["规模化", "扩展性", "性能优化"],
  "sequential-thinking": ["顺序思考", "逐步推理", "step-by-step"],
  "shopify": ["Shopify", "电商", "在线商店"],
  "simplification-cascades": ["简化", "降复杂度", "重构"],
  "systematic-debugging": ["系统调试", "debug", "排错"],
  "ui-styling": ["UI样式", "CSS", "样式设计"],
  "verification-before-completion": ["验证", "检查", "确认完成"],
  "web-frameworks": ["Web框架", "Express", "Fastify", "Koa", "Next.js"],
  "when-stuck": ["卡住", "stuck", "困难", "求助"],

  // === 社区技能 ===
  "webapp-testing": ["E2E", "e2e", "端到端测试", "playwright", "浏览器测试", "web测试", "前端测试", "自动化测试", "UI测试", "with_server", "网页测试"],
  "code-review": ["审查", "review", "PR", "代码质量", "bug", "安全"],
  "mcp-builder": ["MCP", "服务器", "集成", "工具开发", "API"],
  "skill-creator": ["创建技能", "新技能", "技能开发", "skill"],
  "document-skills": ["文档", "Markdown", "PDF", "Word", "文件"],
  "canvas-design": ["画布", "图表", "可视化", "Canvas", "图形"],
  "artifacts-builder": ["artifacts", "构建", "生成器"],
  "brand-guidelines": ["品牌", "指南", "风格", "brand"],
  "content-research-writer": ["研究", "调研", "内容", "写作"],
  "changelog-generator": ["changelog", "更新日志", "版本"],
  "image-enhancer": ["图片", "图像", "增强", "image"],
  "file-organizer": ["文件", "整理", "组织", "organize"],
  "invoice-organizer": ["发票", "invoice", "账单"],
  "meeting-insights-analyzer": ["会议", "meeting", "分析"],
  "lead-research-assistant": ["线索", "lead", "调研"],
  "domain-name-brainstormer": ["域名", "domain", "命名"],
  "developer-growth-analysis": ["开发者", "成长", "分析"],
  "internal-comms": ["内部沟通", "通讯", "communication"],
  "slack-gif-creator": ["slack", "gif", "动图"],
  "video-downloader": ["视频", "下载", "video"],
  "theme-factory": ["主题", "theme", "皮肤"],
  "raffle-winner-picker": ["抽奖", "raffle", "随机"],
  "competitive-ads-extractor": ["广告", "竞品", "ads"],
  "job-data-collector": ["职位", "招聘", "求职", "job", "jobs", "招聘信息", "职位收集", "职位搜索", "job search", "job collector", "职位数据", "求职调研"],

  // === 科学技能 - 生物信息学（P0 高优先级）===
  "biopython": ["生物", "基因", "DNA", "RNA", "蛋白质", "序列分析", "BLAST", "GenBank", "FASTA", "FASTQ", "PDB", "生物信息学", "序列", "比对", "biology", "bioinformatics", "gene", "protein", "sequence", "genome", "alignment", "molecular", "nucleotide", "phylogenetics"],
  "scanpy": ["单细胞", "scRNA-seq", "细胞分析", "基因表达", "UMAP", "t-SNE", "聚类", "细胞类型", "单细胞测序", "scRNA", "single-cell", "single cell", "RNA-seq", "cell", "expression", "clustering", "annotation", "transcriptomics", "Leiden"],
  "anndata": ["注释数据", "单细胞数据", "h5ad", "AnnData", "数据存储", "组学数据", "annotated data", "single-cell data", "data storage", "omics", "data structure"],
  "bioservices": ["生物数据库", "KEGG", "UniProt", "生物服务", "API", "生物数据", "biological database", "bio database", "web service", "bioinformatics API", "biological data"],
  "gget": ["基因查询", "Ensembl", "快速查询", "基因信息", "BLAST", "gene query", "gene info", "gene search", "genomics", "quick search"],
  "pysam": ["SAM", "BAM", "测序数据", "基因组", "比对文件", "NGS", "sequencing", "alignment file", "genome", "next-generation sequencing", "variant calling"],
  "pydeseq2": ["差异表达", "RNA-seq", "DESeq2", "基因表达分析", "differential expression", "gene expression", "expression analysis", "transcriptomics", "count data"],
  "scvi-tools": ["变分推断", "单细胞建模", "深度学习", "scVI", "variational inference", "single-cell modeling", "deep learning", "generative model", "probabilistic"],
  "deeptools": ["ChIP-seq", "表观遗传", "深度测序", "可视化", "epigenetics", "deep sequencing", "visualization", "coverage", "genomic regions"],
  "scikit-bio": ["生物计算", "序列分析", "多样性", "生态学", "biological computation", "sequence analysis", "diversity", "ecology", "microbiome"],
  "etetoolkit": ["系统发育树", "进化树", "可视化", "phylogeny", "phylogenetic tree", "evolution", "tree visualization", "taxonomy"],
  "pathml": ["病理学", "组织病理", "数字病理", "图像分析", "pathology", "histopathology", "digital pathology", "image analysis", "tissue"],
  "pydicom": ["DICOM", "医学影像", "放射学", "影像数据", "medical imaging", "radiology", "imaging data", "medical images", "CT", "MRI"],

  // === 科学技能 - 化学信息学（P0 高优先级）===
  "rdkit": ["化学", "分子", "药物", "化合物", "SMILES", "化学信息学", "分子结构", "化学性质", "子结构搜索", "chemistry", "cheminformatics", "molecule", "compound", "molecular structure", "chemical properties", "substructure", "fingerprint", "molecular descriptors"],
  "deepchem": ["深度学习", "药物发现", "AI药物", "分子预测", "ADMET", "分子性质", "化学机器学习", "deep learning", "drug discovery", "molecular prediction", "molecular properties", "chemical machine learning", "toxicity", "GNN", "graph neural"],
  "datamol": ["分子处理", "化学", "RDKit封装", "分子操作", "molecular processing", "chemistry", "RDKit wrapper", "molecular manipulation", "molecule handling"],
  "molfeat": ["分子特征", "分子指纹", "特征化", "化学描述符", "molecular features", "molecular fingerprints", "featurization", "chemical descriptors", "molecular representation"],
  "medchem": ["药物化学", "药效团", "类药性", "Lipinski", "medicinal chemistry", "pharmacophore", "drug-likeness", "drugability", "lead optimization"],
  "matchms": ["质谱", "光谱匹配", "代谢组学", "质谱分析", "mass spectrometry", "spectral matching", "metabolomics", "MS/MS", "spectrum", "metabolite"],
  "diffdock": ["分子对接", "蛋白配体", "结构预测", "药物设计", "molecular docking", "protein-ligand", "structure prediction", "drug design", "binding", "pose"],
  "pyopenms": ["质谱分析", "蛋白组学", "OpenMS", "LC-MS", "mass spectrometry analysis", "proteomics", "LC-MS/MS", "peptide", "protein identification"],

  // === 科学技能 - 数据库（P1 中优先级）===
  "pubmed-database": ["文献", "PubMed", "论文", "生物医学", "科研", "医学文献", "literature", "paper", "biomedical", "research", "medical literature", "publication", "abstract", "PMID"],
  "alphafold-database": ["蛋白质结构", "AlphaFold", "结构预测", "蛋白结构数据库", "protein structure", "structure prediction", "protein structure database", "predicted structure", "3D structure"],
  "chembl-database": ["药物", "ChEMBL", "生物活性", "靶点", "化合物数据库", "drug", "bioactivity", "target", "compound database", "bioactive molecules", "IC50"],
  "clinicaltrials-database": ["临床试验", "ClinicalTrials.gov", "试验数据", "研究招募", "clinical trial", "trial data", "study recruitment", "clinical study", "NCT", "intervention"],
  "pdb-database": ["蛋白质结构", "PDB", "晶体结构", "结构生物学", "protein structure", "crystal structure", "structural biology", "protein data bank", "macromolecular"],
  "pubchem-database": ["化合物", "PubChem", "化学数据库", "分子数据", "compound", "chemical database", "molecular data", "CID", "substance", "chemical structure"],
  "uniprot-database": ["蛋白质", "UniProt", "蛋白序列", "蛋白注释", "protein", "protein sequence", "protein annotation", "sequence database", "protein function"],
  "openalex-database": ["学术", "OpenAlex", "科研文献", "引用数据", "academic", "scholarly", "research literature", "citation data", "publication", "DOI"],
  "biorxiv-database": ["预印本", "bioRxiv", "论文", "生物预印", "preprint", "biological preprint", "paper", "manuscript", "non-peer-reviewed"],
  "cosmic-database": ["癌症", "COSMIC", "体细胞突变", "肿瘤基因组", "cancer", "somatic mutation", "tumor genome", "mutation database", "oncology"],
  "clinvar-database": ["临床变异", "ClinVar", "致病性", "遗传变异", "clinical variant", "pathogenicity", "genetic variation", "variant interpretation", "mutation"],
  "drugbank-database": ["药物数据库", "DrugBank", "药物信息", "药物靶点", "drug database", "drug information", "drug target", "pharmaceutical", "medication"],
  "kegg-database": ["通路", "KEGG", "代谢通路", "信号通路", "pathway", "metabolic pathway", "signaling pathway", "biological pathway", "metabolism"],
  "string-database": ["蛋白互作", "STRING", "网络", "蛋白网络", "protein interaction", "protein network", "PPI", "interaction network", "functional association"],
  "reactome-database": ["通路分析", "Reactome", "生物通路", "反应", "pathway analysis", "biological pathway", "reaction", "molecular pathway", "biochemical"],
  "gene-database": ["基因", "NCBI Gene", "基因信息", "基因注释", "gene", "gene information", "gene annotation", "genetic", "genomic"],
  "geo-database": ["GEO", "基因表达", "芯片数据", "表达谱", "gene expression", "microarray", "expression profile", "expression data", "transcriptome"],
  "gwas-database": ["GWAS", "全基因组关联", "遗传变异", "表型关联", "genome-wide association", "genetic variant", "phenotype association", "SNP", "trait"],
  "brenda-database": ["酶", "BRENDA", "酶学", "催化反应", "enzyme", "enzymology", "catalytic reaction", "enzymatic", "biochemical reaction"],
  "hmdb-database": ["代谢物", "HMDB", "人类代谢组", "小分子", "metabolite", "human metabolome", "small molecule", "endogenous", "metabolic"],
  "zinc-database": ["化合物库", "ZINC", "虚拟筛选", "小分子库", "compound library", "virtual screening", "small molecule library", "purchasable", "drug-like"],
  "metabolomics-workbench-database": ["代谢组学", "Metabolomics Workbench", "代谢数据", "质谱数据", "metabolomics", "metabolite data", "mass spec data", "metabolic profiling"],

  // === 科学技能 - 机器学习/深度学习（P1 中优先级）===
  "pytorch-lightning": ["深度学习", "PyTorch", "Lightning", "神经网络", "训练", "deep learning", "neural network", "training", "model training", "deep neural network"],
  "transformers": ["Transformer", "预训练模型", "NLP", "BERT", "GPT", "pretrained model", "natural language processing", "language model", "HuggingFace"],
  "scikit-learn": ["机器学习", "分类", "回归", "聚类", "sklearn", "machine learning", "classification", "regression", "clustering", "ML"],
  "stable-baselines3": ["强化学习", "RL", "Gym", "策略优化", "reinforcement learning", "policy optimization", "agent", "environment"],
  "shap": ["可解释性", "SHAP", "特征重要性", "模型解释", "explainability", "feature importance", "model explanation", "interpretability", "Shapley"],
  "torch_geometric": ["图神经网络", "GNN", "PyTorch Geometric", "图学习", "graph neural network", "graph learning", "node classification", "graph classification"],
  "torchdrug": ["药物", "图神经网络", "分子学习", "TorchDrug", "drug", "graph neural network", "molecular learning", "molecular graph", "drug discovery"],

  // === 科学技能 - 数据分析/可视化（P1 中优先级）===
  "matplotlib": ["绘图", "可视化", "图表", "matplotlib", "科学绘图", "plotting", "visualization", "chart", "scientific plotting", "figure"],
  "seaborn": ["统计可视化", "seaborn", "数据可视化", "统计图表", "statistical visualization", "data visualization", "statistical plot", "heatmap"],
  "plotly": ["交互式图表", "Plotly", "动态可视化", "Web可视化", "interactive chart", "dynamic visualization", "web visualization", "interactive plot"],
  "dask": ["大数据", "并行计算", "分布式", "Dask", "大规模数据", "big data", "parallel computing", "distributed", "large-scale data", "scalable"],
  "polars": ["数据处理", "DataFrame", "高性能", "数据分析", "data processing", "dataframe", "high performance", "data analysis", "fast"],
  "vaex": ["大数据", "内存外", "快速数据", "十亿行", "big data", "out-of-core", "fast data", "billion rows", "lazy evaluation"],
  "networkx": ["网络分析", "图论", "复杂网络", "NetworkX", "network analysis", "graph theory", "complex network", "graph algorithm"],
  "geopandas": ["地理数据", "空间分析", "GIS", "地理信息", "geographic data", "spatial analysis", "geospatial", "geographic information"],
  "statsmodels": ["统计分析", "回归", "时间序列", "统计模型", "statistical analysis", "regression", "time series", "statistical model"],
  "statistical-analysis": ["统计", "假设检验", "方差分析", "统计分析", "statistics", "hypothesis testing", "ANOVA", "statistical analysis"],
  "exploratory-data-analysis": ["探索性分析", "EDA", "数据探索", "可视化分析", "exploratory analysis", "data exploration", "visualization analysis", "data profiling"],

  // === 科学技能 - 量子计算/物理（P2 低优先级）===
  "qiskit": ["量子计算", "Qiskit", "量子电路", "IBM量子", "quantum computing", "quantum circuit", "IBM quantum", "quantum algorithm", "qubit"],
  "pennylane": ["量子机器学习", "PennyLane", "量子神经网络", "QML", "quantum machine learning", "quantum neural network", "variational", "quantum gradient"],
  "cirq": ["量子计算", "Cirq", "Google量子", "量子算法", "quantum computing", "Google quantum", "quantum algorithm", "quantum gate"],
  "qutip": ["量子光学", "QuTiP", "量子系统", "量子动力学", "quantum optics", "quantum system", "quantum dynamics", "open quantum"],
  "sympy": ["符号计算", "SymPy", "数学符号", "微积分", "symbolic computation", "mathematical symbol", "calculus", "algebra", "symbolic math"],
  "astropy": ["天文", "Astropy", "天文数据", "天体物理", "astronomy", "astronomical data", "astrophysics", "celestial", "cosmology"],
  "pymatgen": ["材料科学", "晶体结构", "材料计算", "pymatgen", "materials science", "crystal structure", "materials computation", "solid state"],

  // === 科学技能 - 科研辅助（P1 中优先级）===
  "literature-review": ["文献综述", "综述", "文献回顾", "研究综述", "literature review", "review", "literature survey", "research review", "systematic review"],
  "scientific-writing": ["科学写作", "论文写作", "学术写作", "科研写作", "scientific writing", "paper writing", "academic writing", "research writing", "manuscript"],
  "citation-management": ["引用管理", "参考文献", "Citation", "文献引用", "citation management", "reference", "bibliography", "citation"],
  "peer-review": ["同行评审", "论文评审", "审稿", "peer review", "paper review", "manuscript review", "reviewer", "review process"],
  "hypothesis-generation": ["假设生成", "科研假设", "研究问题", "假设提出", "hypothesis generation", "research hypothesis", "research question", "hypothesis formulation"],
  "scientific-brainstorming": ["科学头脑风暴", "创意", "研究思路", "brainstorming", "scientific brainstorming", "creative", "research idea", "ideation"],
  "research-grants": ["科研基金", "基金申请", "项目申请", "研究资助", "research grant", "grant application", "project proposal", "research funding", "NIH", "NSF"],
  "scholar-evaluation": ["学者评估", "学术评价", "科研评估", "学者分析", "scholar evaluation", "academic evaluation", "research evaluation", "scholar analysis", "h-index"],
  "scientific-visualization": ["科学可视化", "数据可视化", "图表制作", "科研作图", "scientific visualization", "data visualization", "figure creation", "research figure"],
  "scientific-slides": ["学术演讲", "幻灯片", "科研汇报", "PPT", "academic presentation", "slides", "research presentation", "presentation"],
  "latex-posters": ["学术海报", "LaTeX", "poster", "会议海报", "academic poster", "conference poster", "scientific poster", "beamerposter"],
  "scientific-schematics": ["科研示意图", "原理图", "流程图", "schematic", "research schematic", "diagram", "flowchart", "illustration"],

  // === 科学技能 - 临床/医学（P1 中优先级）===
  "clinical-decision-support": ["临床决策", "诊断支持", "治疗建议", "clinical decision", "clinical decision support", "diagnostic support", "treatment recommendation", "clinical guidance"],
  "treatment-plans": ["治疗方案", "用药方案", "治疗计划", "treatment", "treatment plan", "medication plan", "therapy", "therapeutic"],
  "clinical-reports": ["临床报告", "病历", "诊断报告", "医学报告", "clinical report", "medical record", "diagnostic report", "medical report", "clinical documentation"],
  "neurokit2": ["生理信号", "心电图", "ECG", "生物信号", "physiological signal", "electrocardiogram", "biosignal", "EEG", "EMG"],
  "pyhealth": ["医疗AI", "电子病历", "EHR", "医疗数据", "healthcare AI", "electronic health record", "medical data", "clinical data"],

  // === 科学技能 - 实验室自动化（P2 低优先级）===
  "opentrons-integration": ["液体处理", "Opentrons", "实验室自动化", "移液", "liquid handling", "laboratory automation", "pipetting", "automated"],
  "pylabrobot": ["实验室机器人", "自动化", "液体处理", "lab automation", "laboratory robot", "automation", "liquid handling", "robotics"],
  "benchling-integration": ["Benchling", "实验室管理", "LIMS", "科研管理", "laboratory management", "lab information", "research management"],
  "latchbio-integration": ["LatchBio", "生物信息流程", "云计算", "数据管道", "bioinformatics workflow", "cloud computing", "data pipeline", "workflow"],
  "dnanexus-integration": ["DNAnexus", "基因组学", "云平台", "测序分析", "genomics", "cloud platform", "sequencing analysis", "genomic analysis"],
};

// ============================================
// 意图识别模式
// ============================================

const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: IntentType.CREATE,
    patterns: [
      /创建|新建|生成|开发|实现|构建|搭建|设计|制作|编写|写一个|做一个|想一个|想出/,
      /create|build|implement|develop|make|design|generate|write|think of/i,
      /帮我.*(页面|组件|界面|功能|网站|应用)/,
      /add\s+(a|new)|implement\s+new/i,
    ],
    weight: 10,
  },
  {
    intent: IntentType.RESEARCH,
    patterns: [
      /查看|查阅|研究|阅读|看看|学习/,
      /源码|源代码|实现原理|怎么实现|如何工作|底层|内部/,
      /look\s+at|examine|study|research|read/i,
      /implementation|source\s*code|how\s+.*\s+works|internals/i,
      // 原理研究相关 - 更明确的模式
      /原理|工作机制|内部实现|底层原理|核心原理/,
    ],
    weight: 10,
  },
  // 原理研究高优先级模式
  {
    intent: IntentType.RESEARCH,
    patterns: [
      /了解.*原理|理解.*原理|学习.*原理|研究.*原理/,
      /.*响应式原理|.*虚拟DOM原理|.*组件原理|.*框架原理/,
      /how.*works|understand.*implementation|explain.*internals/i,
    ],
    weight: 12,
  },
  {
    intent: IntentType.DEBUG,
    patterns: [
      /修复|修bug|调试|排错|解决.*问题|为什么.*不工作|报错|错误|异常|失败/,
      /fix|debug|troubleshoot|solve|error|bug|issue|problem/i,
      /why\s+.*\s+not\s+working|doesn't\s+work/i,
    ],
    weight: 8,
  },
  {
    intent: IntentType.REFACTOR,
    patterns: [
      /重构|优化|改进|简化|整理|清理|提升性能/,
      /refactor|optimize|improve|simplify|clean\s*up|performance/i,
    ],
    weight: 7,
  },
  {
    intent: IntentType.DOCUMENT,
    patterns: [
      /文档|说明|注释|readme|changelog|api\s*doc/i,
      /写文档|添加注释|编写说明|生成文档/,
      /document|comment|annotation/i,
    ],
    weight: 6,
  },
  {
    intent: IntentType.TEST,
    patterns: [
      /测试|test|单元测试|集成测试|e2e|端到端/i,
    ],
    weight: 6,
  },
  // 运行测试
  {
    intent: IntentType.TEST_RUN,
    patterns: [
      /运行.*测试|执行测试|跑测试/,
      /run.*test|execute.*test|test.*run/i,
      /npm\s+test|npm\s+test:run|vitest|jest|playwright\s+test/i,
    ],
    weight: 8,
  },
  // 编写单元测试
  {
    intent: IntentType.TEST_WRITE_UNIT,
    patterns: [
      /写单元测试|编写单元测试|添加单元测试|创建单元测试/,
      /write.*unit.*test|create.*unit.*test|add.*unit.*test/i,
    ],
    weight: 7,
  },
  // 编写集成测试
  {
    intent: IntentType.TEST_WRITE_INTEGRATION,
    patterns: [
      /写集成测试|编写集成测试|添加集成测试|创建集成测试/,
      /write.*integration.*test|create.*integration.*test/i,
    ],
    weight: 7,
  },
  // 编写E2E测试
  {
    intent: IntentType.TEST_WRITE_E2E,
    patterns: [
      /写E2E测试|编写端到端测试|添加E2E测试|创建E2E测试/,
      /写e2e|e2e测试|端到端/,
      /write.*e2e.*test|create.*e2e.*test|end.*to.*end.*test/i,
    ],
    weight: 7,
  },
  {
    intent: IntentType.ANALYZE,
    patterns: [
      /审查|review|分析|检查|评估|诊断/,
      /代码审查|code\s*review|PR|pull\s*request/i,
      /analyze|inspect|evaluate|assess/i,
    ],
    weight: 7,
  },
  {
    intent: IntentType.CONVERT,
    patterns: [
      /转换|转成|导出|转为|格式化/,
      /生成.*文件|导出.*格式/,
      /convert|export|transform\s+to|format\s+as/i,
    ],
    weight: 5,
  },
  {
    intent: IntentType.DEPLOY,
    patterns: [
      /部署|发布|上线|打包|构建发布/,
      /deploy|release|publish|ship|launch/i,
    ],
    weight: 5,
  },
  {
    intent: IntentType.CHAT,
    patterns: [
      /你好|hello|hi|嗨|谢谢|thanks|是什么|什么是|解释|介绍/i,
      /what\s+is|explain|tell\s+me\s+about/i,
    ],
    weight: 3,
  },
];

// ============================================
// 增强的技能配置（意图感知）
// ============================================

const SKILL_CONFIGS: Record<string, SkillTriggerConfig> = {
  // === 前端设计类：需要 CREATE/REFACTOR 意图，排除 RESEARCH ===
  "frontend-design": {
    triggers: [
      { word: "设计", weight: 3 },
      { word: "UI", weight: 4 },
      { word: "界面", weight: 4 },
      { word: "组件", weight: 3 },
      { word: "页面", weight: 3 },
      { word: "布局", weight: 4 },
      { word: "CSS", weight: 3 },
      { word: "React", weight: 2 },
      { word: "Vue", weight: 2 },
      { word: "前端", weight: 2 },
    ],
    excludes: [
      "源码", "源代码",
      "实现原理", "怎么实现", "如何工作",
      "工作机制", "内部实现", "底层原理", "核心原理",
      "implementation", "source code", "internals"
    ],
    requiredIntents: [IntentType.CREATE, IntentType.REFACTOR],
    excludedIntents: [IntentType.RESEARCH, IntentType.ANALYZE],
    priority: 6,
  },
  "modern-frontend-design": {
    triggers: [
      { word: "现代前端", weight: 5 },
      { word: "设计系统", weight: 5 },
      { word: "design system", weight: 5 },
      { word: "美学", weight: 4 },
      { word: "视觉", weight: 3 },
      { word: "neo-brutalist", weight: 6 },
      { word: "glassmorphism", weight: 6 },
    ],
    excludes: ["源码", "源代码"],
    requiredIntents: [IntentType.CREATE],
    excludedIntents: [IntentType.RESEARCH],
    priority: 7,
  },
  "aesthetic": {
    excludes: ["源码", "实现"],
    requiredIntents: [IntentType.CREATE],
    excludedIntents: [IntentType.RESEARCH],
    priority: 5,
  },
  "ui-styling": {
    excludes: ["源码", "实现原理"],
    requiredIntents: [IntentType.CREATE, IntentType.REFACTOR],
    excludedIntents: [IntentType.RESEARCH],
    priority: 5,
  },
  "web-artifacts-builder": {
    requiredIntents: [IntentType.CREATE],
    excludedIntents: [IntentType.RESEARCH],
    priority: 5,
  },
  "artifacts-builder": {
    requiredIntents: [IntentType.CREATE],
    excludedIntents: [IntentType.RESEARCH],
    priority: 5,
  },
  "canvas-design": {
    requiredIntents: [IntentType.CREATE],
    excludedIntents: [IntentType.RESEARCH],
    priority: 5,
  },
  "theme-factory": {
    requiredIntents: [IntentType.CREATE],
    excludedIntents: [IntentType.RESEARCH],
    priority: 5,
  },

  // === 后端开发类：需要 CREATE/DEBUG 意图 ===
  "backend-development": {
    excludes: ["源码", "实现原理"],
    requiredIntents: [IntentType.CREATE, IntentType.DEBUG, IntentType.REFACTOR],
    excludedIntents: [IntentType.RESEARCH],
    priority: 6,
  },
  "frontend-development": {
    excludes: ["源码", "实现原理"],
    requiredIntents: [IntentType.CREATE, IntentType.DEBUG, IntentType.REFACTOR],
    excludedIntents: [IntentType.RESEARCH],
    priority: 6,
  },
  "web-frameworks": {
    excludes: ["源码", "源代码", "实现"],
    requiredIntents: [IntentType.CREATE, IntentType.DEBUG],
    excludedIntents: [IntentType.RESEARCH],
    priority: 5,
  },

  // === 数据库类：需要 CREATE/DEBUG 意图 ===
  "databases": {
    excludes: ["源码", "实现原理"],
    requiredIntents: [IntentType.CREATE, IntentType.DEBUG, IntentType.REFACTOR],
    excludedIntents: [IntentType.RESEARCH],
    priority: 6,
  },

  // === 测试类：E2E Web 应用测试 ===
  "webapp-testing": {
    triggers: [
      { word: "E2E", weight: 6 },
      { word: "e2e", weight: 6 },
      { word: "端到端测试", weight: 6 },
      { word: "playwright", weight: 7 },
      { word: "浏览器测试", weight: 5 },
      { word: "web测试", weight: 5 },
    ],
    requiredIntents: [
      IntentType.TEST_RUN,        // 运行E2E测试
      IntentType.TEST_WRITE_E2E,  // 编写E2E测试
    ],
    excludedIntents: [
      IntentType.TEST_WRITE_UNIT,         // 排除编写单元测试
      IntentType.TEST_WRITE_INTEGRATION,  // 排除编写集成测试
    ],
    priority: 6,
  },

  // === 代码分析类：需要 ANALYZE/RESEARCH 意图 ===
  "code-review": {
    triggers: [
      { word: "审查", weight: 5 },
      { word: "review", weight: 5 },
      { word: "PR", weight: 4 },
      { word: "代码质量", weight: 4 },
    ],
    requiredIntents: [IntentType.ANALYZE],
    priority: 7,
  },
  "open-source-librarian": {
    triggers: [
      { word: "源码", weight: 6 },
      { word: "源代码", weight: 6 },
      { word: "开源", weight: 4 },
      { word: "原理", weight: 6 },
      { word: "响应式原理", weight: 8 },
      { word: "虚拟DOM原理", weight: 8 },
      { word: "组件原理", weight: 8 },
      { word: "实现原理", weight: 7 },
      { word: "怎么实现", weight: 5 },
      { word: "如何工作", weight: 6 },
      { word: "工作机制", weight: 6 },
      { word: "底层", weight: 5 },
      { word: "内部实现", weight: 6 },
      { word: "底层原理", weight: 7 },
      { word: "核心原理", weight: 7 },
      { word: "implementation", weight: 5 },
      { word: "查源码", weight: 7 },
      { word: "看源码", weight: 7 },
      { word: "读源码", weight: 7 },
    ],
    requiredIntents: [IntentType.RESEARCH, IntentType.ANALYZE],
    priority: 8,
  },
  "repomix": {
    requiredIntents: [IntentType.ANALYZE, IntentType.RESEARCH],
    priority: 5,
  },
  "root-cause-tracing": {
    requiredIntents: [IntentType.DEBUG, IntentType.ANALYZE],
    priority: 6,
  },
  "systematic-debugging": {
    requiredIntents: [IntentType.DEBUG],
    priority: 7,
  },
  "when-stuck": {
    requiredIntents: [IntentType.DEBUG],
    priority: 5,
  },

  // === 文档类：需要 DOCUMENT/CREATE 意图 ===
  "doc-coauthoring": {
    requiredIntents: [IntentType.DOCUMENT, IntentType.CREATE],
    priority: 6,
  },
  "document-skills": {
    requiredIntents: [IntentType.DOCUMENT, IntentType.CREATE],
    priority: 5,
  },
  "docs-seeker": {
    requiredIntents: [IntentType.RESEARCH, IntentType.DOCUMENT],
    priority: 5,
  },
  "changelog-generator": {
    requiredIntents: [IntentType.DOCUMENT, IntentType.CREATE],
    priority: 5,
  },
  "content-research-writer": {
    requiredIntents: [IntentType.DOCUMENT, IntentType.RESEARCH, IntentType.CREATE],
    priority: 5,
  },

  // === 格式转换类：需要 CONVERT 意图 ===
  "pdf": {
    triggers: [
      { word: "PDF", weight: 5 },
      { word: "pdf文件", weight: 5 },
      { word: "导出PDF", weight: 6 },
    ],
    requiredIntents: [IntentType.CONVERT, IntentType.CREATE],
    priority: 6,
  },
  "docx": {
    triggers: [
      { word: "Word", weight: 5 },
      { word: "docx", weight: 5 },
      { word: "文档", weight: 3 },
    ],
    requiredIntents: [IntentType.CONVERT, IntentType.CREATE],
    priority: 6,
  },
  "pptx": {
    triggers: [
      { word: "PPT", weight: 5 },
      { word: "PowerPoint", weight: 5 },
      { word: "幻灯片", weight: 5 },
    ],
    requiredIntents: [IntentType.CONVERT, IntentType.CREATE],
    priority: 6,
  },
  "xlsx": {
    triggers: [
      { word: "Excel", weight: 5 },
      { word: "电子表格", weight: 5 },
      { word: "xlsx", weight: 5 },
    ],
    requiredIntents: [IntentType.CONVERT, IntentType.CREATE],
    priority: 6,
  },

  // === DevOps 类：需要 DEPLOY/CREATE 意图 ===
  "devops": {
    requiredIntents: [IntentType.DEPLOY, IntentType.CREATE],
    priority: 6,
  },

  // === 浏览器自动化类 ===
  "browser": {
    triggers: [
      { word: "浏览器", weight: 4 },
      { word: "Chrome", weight: 4 },
      { word: "CDP", weight: 5 },
      { word: "自动化", weight: 3 },
      { word: "截图", weight: 4 },
    ],
    requiredIntents: [IntentType.CREATE, IntentType.TEST],
    priority: 5,
  },
  "chrome-devtools": {
    requiredIntents: [IntentType.DEBUG, IntentType.ANALYZE],
    priority: 5,
  },

  // === 认证授权类 ===
  "better-auth": {
    excludes: ["源码", "实现原理"],
    requiredIntents: [IntentType.CREATE, IntentType.DEBUG],
    excludedIntents: [IntentType.RESEARCH],
    priority: 6,
  },

  // === AI/多模态类 ===
  "ai-multimodal": {
    requiredIntents: [IntentType.CREATE, IntentType.ANALYZE],
    priority: 5,
  },

  // === MCP/工具类 ===
  "mcp-builder": {
    requiredIntents: [IntentType.CREATE],
    priority: 6,
  },
  "mcp-management": {
    requiredIntents: [IntentType.CREATE, IntentType.DEBUG],
    priority: 5,
  },
  "skill-creator": {
    requiredIntents: [IntentType.CREATE],
    priority: 6,
  },

  // === 媒体处理类 ===
  "media-processing": {
    requiredIntents: [IntentType.CONVERT, IntentType.CREATE],
    priority: 5,
  },
  "image-enhancer": {
    requiredIntents: [IntentType.CREATE, IntentType.REFACTOR],
    priority: 5,
  },
  "video-downloader": {
    requiredIntents: [IntentType.CREATE],
    priority: 4,
  },
  "slack-gif-creator": {
    requiredIntents: [IntentType.CREATE],
    priority: 4,
  },

  // === 图表/可视化类 ===
  "mermaidjs-v11": {
    requiredIntents: [IntentType.CREATE, IntentType.DOCUMENT],
    priority: 5,
  },
  "algorithmic-art": {
    requiredIntents: [IntentType.CREATE],
    priority: 5,
  },

  // === 思维/方法论类：允许更多意图 ===
  "collision-zone-thinking": {
    // 思维方法类不限制意图
    priority: 4,
  },
  "context-engineering": {
    priority: 4,
  },
  "defense-in-depth": {
    priority: 4,
  },
  "inversion-exercise": {
    priority: 4,
  },
  "meta-pattern-recognition": {
    priority: 4,
  },
  "scale-game": {
    priority: 4,
  },
  "sequential-thinking": {
    priority: 4,
  },
  "simplification-cascades": {
    requiredIntents: [IntentType.REFACTOR],
    priority: 5,
  },
  "verification-before-completion": {
    requiredIntents: [IntentType.TEST, IntentType.ANALYZE],
    priority: 5,
  },

  // === 业务/垂直领域类 ===
  "shopify": {
    requiredIntents: [IntentType.CREATE, IntentType.DEBUG],
    priority: 5,
  },
  "google-adk-python": {
    requiredIntents: [IntentType.CREATE],
    priority: 5,
  },
  "brand-guidelines": {
    requiredIntents: [IntentType.CREATE, IntentType.DOCUMENT],
    priority: 5,
  },
  "invoice-organizer": {
    requiredIntents: [IntentType.CREATE, IntentType.ANALYZE],
    priority: 4,
  },
  "meeting-insights-analyzer": {
    requiredIntents: [IntentType.ANALYZE],
    priority: 4,
  },
  "lead-research-assistant": {
    requiredIntents: [IntentType.RESEARCH],
    priority: 4,
  },
  "domain-name-brainstormer": {
    requiredIntents: [IntentType.CREATE],
    priority: 4,
  },
  "developer-growth-analysis": {
    requiredIntents: [IntentType.ANALYZE],
    priority: 4,
  },
  "internal-comms": {
    requiredIntents: [IntentType.CREATE, IntentType.DOCUMENT],
    priority: 4,
  },
  "file-organizer": {
    requiredIntents: [IntentType.CREATE, IntentType.REFACTOR],
    priority: 4,
  },
  "raffle-winner-picker": {
    requiredIntents: [IntentType.CREATE],
    priority: 3,
  },
  "competitive-ads-extractor": {
    requiredIntents: [IntentType.ANALYZE, IntentType.RESEARCH],
    priority: 4,
  },
  "claude-code": {
    // Claude Code 帮助类不限制
    priority: 4,
  },
};

// ============================================
// 触发词提取配置
// ============================================

// 英文停用词列表（常见虚词、介词等，不应作为触发词）
const ENGLISH_STOP_WORDS = new Set([
  // 冠词
  "a", "an", "the",
  // 介词
  "for", "to", "in", "of", "on", "at", "by", "with", "from", "about", "as", "into", "through", "during", "before", "after", "above", "below", "between", "under", "over",
  // 连词
  "and", "or", "but", "nor", "so", "yet",
  // 代词
  "it", "its", "this", "that", "these", "those", "them", "their",
  // 动词
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "can", "could", "will", "would", "should", "may", "might", "must",
  // 副词
  "not", "also", "only", "just", "very", "too", "more", "most", "well",
  // 其他常见词
  "use", "used", "using", "when", "where", "which", "who", "what", "how", "all", "each", "every", "both", "few", "many", "other", "some", "such",
]);

// ============================================
// 全局状态
// ============================================

let SKILL_REGISTRY: SkillMeta[] = [];
const skillContentCache: Map<string, string> = new Map();
const state: ControllerState = {
  activeSkills: new Set(),
  context: "",
  lastAnalysis: new Date(),
};

// ============================================
// 技能扫描和加载
// ============================================

/**
 * 解析 SKILL.md 的 YAML frontmatter
 */
function parseFrontmatter(content: string): { name: string; description: string } | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = match[1];
  const nameMatch = frontmatter.match(/name:\s*(.+)/);
  const descMatch = frontmatter.match(/description:\s*[|>]?\s*([\s\S]*?)(?=\n\w+:|$)/);

  if (!nameMatch) return null;

  return {
    name: nameMatch[1].trim(),
    description: descMatch ? descMatch[1].trim().split("\n")[0] : "",
  };
}

/**
 * 推断技能分类
 */
function inferCategory(name: string, description: string): string {
  const text = `${name} ${description}`.toLowerCase();

  if (text.includes("frontend") || text.includes("ui") || text.includes("design") || text.includes("css")) {
    return "frontend";
  }
  if (text.includes("test") || text.includes("验证")) {
    return "testing";
  }
  if (text.includes("review") || text.includes("quality") || text.includes("审查")) {
    return "quality";
  }
  if (text.includes("mcp") || text.includes("tool") || text.includes("build")) {
    return "tooling";
  }
  if (text.includes("document") || text.includes("文档") || text.includes("content")) {
    return "content";
  }
  if (text.includes("image") || text.includes("video") || text.includes("media")) {
    return "media";
  }
  return "general";
}

/**
 * 扫描技能目录，加载所有技能的元数据（支持嵌套目录）
 */
async function scanSkillsDirectory(baseDir: string, maxDepth: number = 2): Promise<SkillMeta[]> {
  const skills: SkillMeta[] = [];
  const resolvedBase = path.resolve(baseDir);

  // Validate base directory exists and is not a symlink
  try {
    if (!fs.existsSync(resolvedBase)) {
      console.error(`[Skills Controller] 技能目录不存在: ${sanitizePathForLog(baseDir)}`);
      return skills;
    }

    const stats = fs.lstatSync(resolvedBase);
    if (stats.isSymbolicLink()) {
      console.error(`[Skills Controller] 跳过符号链接目录: ${sanitizePathForLog(baseDir)}`);
      return skills;
    }
  } catch (error) {
    console.error(`[Skills Controller] 无法访问目录: ${sanitizePathForLog(baseDir)}`);
    return skills;
  }

  // 递归扫描函数
  function scanDir(dir: string, depth: number) {
    if (depth > maxDepth) return;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith(".")) continue;
        if (entry.name === "common" || entry.name === "references" || entry.name === "scripts") continue;

        // Validate entry name doesn't contain path separators or special chars
        if (!validateEntryName(entry.name)) {
          console.error(`[Skills Controller] 跳过无效目录名: ${sanitizePathForLog(entry.name)}`);
          continue;
        }

        try {
          // Validate path stays within base directory
          const skillDir = validatePath(resolvedBase, path.relative(resolvedBase, path.join(dir, entry.name)));

          // Check for symlink escape
          const dirStats = fs.lstatSync(skillDir);
          if (dirStats.isSymbolicLink()) {
            console.error(`[Skills Controller] 跳过符号链接: ${sanitizePathForLog(entry.name)}`);
            continue;
          }

          const skillFile = path.join(skillDir, "SKILL.md");

          if (fs.existsSync(skillFile)) {
            // 找到技能，处理它
            processSkill(entry.name, skillFile);
          } else {
            // 没有 SKILL.md，尝试递归扫描子目录
            scanDir(skillDir, depth + 1);
          }
        } catch (error) {
          if (error instanceof PathTraversalError) {
            console.error(`[Skills Controller] 跳过可疑路径: ${sanitizePathForLog(entry.name)}`);
          }
          // Continue with other entries
        }
      }
    } catch (error) {
      console.error(`[Skills Controller] 扫描目录失败: ${sanitizePathForLog(dir)}`);
    }
  }

  function processSkill(name: string, skillFile: string) {
    try {
      // Validate skill file path
      const validatedPath = validateFileForRead(path.dirname(skillFile), path.basename(skillFile));

      const content = fs.readFileSync(validatedPath, "utf-8");
      const meta = parseFrontmatter(content);

      if (!meta) return;

      // 获取触发词
      const triggers = EXTRA_TRIGGERS[name] || [];

      // 从描述中提取额外关键词（改进版）
      const descWords = meta.description
        .split(/[\s,，、.;:()]+/)  // 扩展分隔符，包括句号、分号、括号等
        .filter(w => {
          // 过滤条件：
          // 1. 长度在 2-15 之间（放宽上限以支持复合词）
          // 2. 不在停用词列表中
          // 3. 至少包含一个大写字母（专有名词）或长度>=4的小写单词
          const len = w.length;
          if (len < 2 || len > 15) return false;

          const lowerW = w.toLowerCase();
          if (ENGLISH_STOP_WORDS.has(lowerW)) return false;

          // 保留专有名词（含大写）、技术术语（含数字、连字符）或较长单词
          return /[A-Z]/.test(w) ||           // 专有名词（如 BioPython, BLAST）
                 /[\d-]/.test(w) ||           // 技术术语（如 RNA-seq, 2D/3D, h5ad）
                 (!/[A-Z]/.test(w) && len >= 4);  // 普通单词至少4个字符
        })
        .map(w => w.replace(/[^\w-]/g, ''));  // 清理特殊字符，保留连字符

      const allTriggers = [...new Set([...triggers, ...descWords, name])];

      skills.push({
        name: name,
        description: meta.description || `${name} 技能`,
        triggers: allTriggers,
        category: inferCategory(name, meta.description),
        priority: 5,
        path: validatedPath,  // Store validated path
        loaded: false,
      });

      console.error(`[Skills Controller] 发现技能: ${name}`);
    } catch (error) {
      console.error(`[Skills Controller] 加载技能失败: ${sanitizePathForLog(name)}`);
    }
  }

  // 开始扫描
  scanDir(resolvedBase, 0);

  return skills;
}

/**
 * 加载技能的完整内容
 */
async function loadSkillContent(skillName: string): Promise<string> {
  // 检查缓存
  if (skillContentCache.has(skillName)) {
    return skillContentCache.get(skillName)!;
  }

  const skill = SKILL_REGISTRY.find(s => s.name === skillName);
  if (!skill) {
    // Don't expose skill name in error - could be user input
    return "[Error: 技能未注册]";
  }

  try {
    // Validate skill path for security (double-check even though scanned paths should be safe)
    const skillDir = path.dirname(skill.path);
    const skillFile = path.basename(skill.path);
    const validatedPath = validateFileForRead(skillDir, skillFile);

    const content = fs.readFileSync(validatedPath, "utf-8");
    skillContentCache.set(skillName, content);
    skill.loaded = true;
    return content;
  } catch (error) {
    // Safe error logging - don't expose full path
    console.error(`[Skills Controller] 读取技能失败: ${sanitizePathForLog(skill.path)}`);
    return "[Error: 无法读取技能文件]";
  }
}

// ============================================
// 意图分析
// ============================================

/**
 * 识别用户消息的意图
 * @returns 识别出的意图列表，按置信度排序
 */
function detectIntents(userMessage: string): { intent: IntentType; confidence: number }[] {
  const results: { intent: IntentType; confidence: number }[] = [];
  const messageLower = userMessage.toLowerCase();

  for (const pattern of INTENT_PATTERNS) {
    let matchCount = 0;
    let totalWeight = 0;

    for (const regex of pattern.patterns) {
      if (regex.test(userMessage) || regex.test(messageLower)) {
        matchCount++;
        totalWeight += pattern.weight;
      }
    }

    if (matchCount > 0) {
      // 置信度计算：匹配数量 * 权重 / 模式数量
      const confidence = (matchCount * totalWeight) / pattern.patterns.length;
      results.push({ intent: pattern.intent, confidence });
    }
  }

  // 按置信度排序
  results.sort((a, b) => b.confidence - a.confidence);

  // 如果没有匹配，返回 UNKNOWN
  if (results.length === 0) {
    results.push({ intent: IntentType.UNKNOWN, confidence: 0 });
  }

  return results;
}

/**
 * 检查消息是否包含排除词
 */
function containsExcludeWords(message: string, excludes: string[]): boolean {
  const messageLower = message.toLowerCase();
  return excludes.some(exclude => messageLower.includes(exclude.toLowerCase()));
}

/**
 * 增强版上下文分析 - 支持意图识别和排除机制
 */
function analyzeContext(userMessage: string): { skills: SkillMeta[]; primaryIntent: IntentType } {
  const messageLower = userMessage.toLowerCase();

  // 1. 识别用户意图
  const detectedIntents = detectIntents(userMessage);
  const primaryIntent = detectedIntents[0]?.intent || IntentType.UNKNOWN;

  // 特殊处理：编写单元测试时不激活特定技能
  if (primaryIntent === IntentType.TEST_WRITE_UNIT) {
    console.error(`[Skills Controller] 单元测试编写场景，使用通用编程能力`);
    return {
      skills: [],  // 不激活特定技能
      primaryIntent,
    };
  }

  // 特殊处理：编写集成测试时不激活特定技能
  if (primaryIntent === IntentType.TEST_WRITE_INTEGRATION) {
    console.error(`[Skills Controller] 集成测试编写场景，使用通用编程能力`);
    return {
      skills: [],  // 不激活特定技能
      primaryIntent,
    };
  }

  // 2. 获取次要意图
  const secondaryIntents = detectedIntents.slice(1, 3).map(d => d.intent);
  const allIntents = [primaryIntent, ...secondaryIntents];

  console.error(`[Skills Controller] 识别意图: ${primaryIntent} (次要: ${secondaryIntents.join(", ") || "无"})`);

  const matchedSkills: { skill: SkillMeta; score: number; matchedTriggers: string[] }[] = [];

  for (const skill of SKILL_REGISTRY) {
    const config = SKILL_CONFIGS[skill.name];

    // 2. 检查意图过滤
    if (config) {
      // 检查排除意图
      if (config.excludedIntents?.includes(primaryIntent)) {
        console.error(`[Skills Controller] ${skill.name} 被意图排除: ${primaryIntent}`);
        continue;
      }

      // 检查必需意图（如果定义了 requiredIntents）
      if (config.requiredIntents && config.requiredIntents.length > 0) {
        const hasRequiredIntent = config.requiredIntents.some(ri => allIntents.includes(ri));
        if (!hasRequiredIntent) {
          // 如果主意图是 UNKNOWN，允许通过（兼容旧行为）
          if (primaryIntent !== IntentType.UNKNOWN) {
            console.error(`[Skills Controller] ${skill.name} 缺少必需意图 (需要: ${config.requiredIntents.join("/")})`);
            continue;
          }
        }
      }

      // 检查排除词
      if (config.excludes && containsExcludeWords(userMessage, config.excludes)) {
        console.error(`[Skills Controller] ${skill.name} 被排除词过滤`);
        continue;
      }
    }

    // 3. 计算匹配分数
    let score = 0;
    const matchedTriggers: string[] = [];

    // 优先使用 SKILL_CONFIGS 中的加权触发词
    if (config?.triggers && config.triggers.length > 0) {
      for (const trigger of config.triggers) {
        if (messageLower.includes(trigger.word.toLowerCase())) {
          score += trigger.weight;
          matchedTriggers.push(trigger.word);
        }
      }
    }

    // 也检查 EXTRA_TRIGGERS 和默认触发词
    for (const trigger of skill.triggers) {
      if (messageLower.includes(trigger.toLowerCase())) {
        // 避免重复计分
        if (!matchedTriggers.includes(trigger)) {
          score += trigger.length > 3 ? 2 : 1;
          matchedTriggers.push(trigger);
        }
      }
    }

    // 4. 应用技能优先级
    const priority = config?.priority || skill.priority;

    if (score > 0) {
      matchedSkills.push({
        skill: { ...skill, priority },
        score: score + priority,
        matchedTriggers,
      });
    }
  }

  // 按分数排序
  matchedSkills.sort((a, b) => b.score - a.score);

  // 记录匹配结果
  if (matchedSkills.length > 0) {
    console.error(`[Skills Controller] 匹配结果: ${matchedSkills.slice(0, 5).map(m => `${m.skill.name}(${m.score})`).join(", ")}`);
  } else {
    console.error(`[Skills Controller] 无匹配技能`);
  }

  return {
    skills: matchedSkills.map(m => m.skill),
    primaryIntent,
  };
}

// ============================================
// MCP 服务器
// ============================================

function createServer() {
  const server = new Server(
    {
      name: "skills-controller",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // 注册工具列表
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const skillsList = SKILL_REGISTRY.map(s => `• ${s.name}: ${s.description}`).join("\n");

    return {
      tools: [
        {
          name: "analyze_and_route",
          description: `**重要：在处理任何非简单对话任务前，必须首先调用此工具**

这是技能路由核心 - 为每个任务自动匹配最合适的专家技能。

已注册 ${SKILL_REGISTRY.length} 个技能，涵盖：前端开发、后端开发、数据库、DevOps、设计、文档处理、测试、AI/ML 等。

**调用规则**：
- ✅ **必须调用**：任何编程、设计、文档处理、技术任务
- ✅ **必须调用**：研究框架/库的**原理**（如"Vue响应式原理"、"React虚拟DOM"）
- ✅ **必须调用**：查看源码、实现机制、内部工作原理
- ✅ **必须调用**：用户请求创建、构建、开发、处理任何内容
- ❌ **无需调用**：社交对话（"你好"、"谢谢"）、纯闲聊、**基础概念解释**（如"什么是HTTP？"）

使用此工具让 Claude 自动获得专家级能力，用户无需知道技能的存在。`,
          inputSchema: {
            type: "object",
            properties: {
              user_message: {
                type: "string",
                description: "用户的原始消息或任务描述",
              },
              max_skills: {
                type: "number",
                description: "最多激活的技能数量（默认 1）",
                default: 1,
              },
            },
            required: ["user_message"],
          },
        },
        {
          name: "list_active_skills",
          description: "列出当前激活的技能",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "deactivate_skill",
          description: "停用指定技能，释放上下文空间",
          inputSchema: {
            type: "object",
            properties: {
              skill_name: {
                type: "string",
                description: "要停用的技能名称",
              },
            },
            required: ["skill_name"],
          },
        },
        {
          name: "deactivate_all_skills",
          description: "停用所有已激活的技能，释放上下文空间",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "get_skill_index",
          description: "获取所有可用技能的完整索引",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "load_skill",
          description: "直接加载指定技能的完整内容",
          inputSchema: {
            type: "object",
            properties: {
              skill_name: {
                type: "string",
                description: "要加载的技能名称",
              },
            },
            required: ["skill_name"],
          },
        },
        {
          name: "search_skills",
          description: "搜索包含指定关键词的技能",
          inputSchema: {
            type: "object",
            properties: {
              keyword: {
                type: "string",
                description: "搜索关键词",
              },
            },
            required: ["keyword"],
          },
        },
      ],
    };
  });

  // 处理工具调用
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "analyze_and_route": {
          // Validate input with Zod schema
          const { user_message, max_skills } = validateAnalyzeAndRouteArgs(args);

        // 使用增强的意图感知分析
        const { skills: matchedSkills, primaryIntent } = analyzeContext(user_message);
        const skillsToActivate = matchedSkills.slice(0, max_skills);

        if (skillsToActivate.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  status: "no_match",
                  detected_intent: primaryIntent,
                  message: "未匹配到相关技能，使用通用模式处理",
                  suggestion: "可以使用 search_skills 或 get_skill_index 查看可用技能",
                  total_skills: SKILL_REGISTRY.length,
                }),
              },
            ],
          };
        }

        // 加载技能内容
        const activatedContents: { name: string; content: string }[] = [];

        for (const skill of skillsToActivate) {
          const content = await loadSkillContent(skill.name);
          activatedContents.push({ name: skill.name, content });
          state.activeSkills.add(skill.name);
        }

        state.context = user_message;
        state.lastAnalysis = new Date();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "activated",
                detected_intent: primaryIntent,
                activated_skills: skillsToActivate.map(s => ({
                  name: s.name,
                  category: s.category,
                  match_reason: s.triggers.filter(t =>
                    user_message.toLowerCase().includes(t.toLowerCase())
                  ),
                })),
                skill_contents: activatedContents,
                instructions: `✅ **已激活技能**：${skillsToActivate.map(s => `${s.name}（${s.category}）`).join("、")}

请根据以上激活的技能内容来处理用户请求。任务完成后，请务必调用 deactivate_all_skills 工具来停用技能并释放上下文空间。`,
              }),
            },
          ],
        };
      }

      case "list_active_skills": {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                active_skills: Array.from(state.activeSkills),
                last_analysis: state.lastAnalysis.toISOString(),
                context_summary: state.context.slice(0, 100) + (state.context.length > 100 ? "..." : ""),
              }),
            },
          ],
        };
      }

      case "deactivate_skill": {
        // Validate skill_name input
        const skill_name = validateSkillName(args);

        if (state.activeSkills.has(skill_name)) {
          state.activeSkills.delete(skill_name);
          skillContentCache.delete(skill_name);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  status: "deactivated",
                  skill: skill_name,
                  remaining_active: Array.from(state.activeSkills),
                  message: "技能使用完毕，已释放。",
                }),
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "not_found",
                message: "技能未处于激活状态",
              }),
            },
          ],
        };
      }

      case "deactivate_all_skills": {
        const deactivatedSkills = Array.from(state.activeSkills);
        const count = deactivatedSkills.length;

        state.activeSkills.clear();
        skillContentCache.clear();

        // 生成友好的提示信息
        const skillNames = deactivatedSkills.length > 0
          ? deactivatedSkills.join("、")
          : "无";

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "all_deactivated",
                count: count,
                deactivated_skills: deactivatedSkills,
                message: count > 0
                  ? `【${skillNames}】技能使用完毕，已释放。`
                  : "当前没有激活的技能。",
              }),
            },
          ],
        };
      }

      case "get_skill_index": {
        // 按分类分组
        const byCategory: Record<string, SkillMeta[]> = {};
        for (const skill of SKILL_REGISTRY) {
          if (!byCategory[skill.category]) {
            byCategory[skill.category] = [];
          }
          byCategory[skill.category].push(skill);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                total: SKILL_REGISTRY.length,
                by_category: Object.entries(byCategory).map(([cat, skills]) => ({
                  category: cat,
                  count: skills.length,
                  skills: skills.map(s => ({
                    name: s.name,
                    description: s.description,
                    triggers: s.triggers.slice(0, 5),
                  })),
                })),
              }),
            },
          ],
        };
      }

      case "load_skill": {
        // Validate skill_name input
        const skill_name = validateSkillName(args);

        const skill = SKILL_REGISTRY.find(s => s.name === skill_name);
        if (!skill) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  status: "error",
                  message: "技能不存在",
                  // Don't leak full skill list - suggest using search instead
                  suggestion: "使用 search_skills 或 get_skill_index 查看可用技能",
                }),
              },
            ],
          };
        }

        const content = await loadSkillContent(skill_name);
        state.activeSkills.add(skill_name);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "loaded",
                skill: {
                  name: skill.name,
                  category: skill.category,
                  description: skill.description,
                },
                content: content,
              }),
            },
          ],
        };
      }

      case "search_skills": {
        // Validate keyword input
        const keyword = validateKeyword(args);
        const keywordLower = keyword.toLowerCase();

        const matches = SKILL_REGISTRY.filter(skill =>
          skill.name.toLowerCase().includes(keywordLower) ||
          skill.description.toLowerCase().includes(keywordLower) ||
          skill.triggers.some(t => t.toLowerCase().includes(keywordLower))
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                keyword,
                matches: matches.length,
                skills: matches.map(s => ({
                  name: s.name,
                  description: s.description,
                  category: s.category,
                })),
              }),
            },
          ],
        };
      }

      default:
        // Safe error - don't expose tool name details
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "error",
                message: "未知操作",
              }),
            },
          ],
        };
      }
    } catch (error) {
      // Unified error handling - don't leak sensitive info
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "error",
              message: createSafeErrorResponse(error, name),
            }),
          },
        ],
      };
    }
  });

  return server;
}

// ============================================
// 主函数
// ============================================

async function main() {
  console.error("[Skills Controller] 启动中...");
  console.error(`[Skills Controller] 技能目录: ${SKILLS_DIRS.join(", ")}`);

  // 扫描所有技能目录（先扫描的优先）
  const seenSkills = new Set<string>();
  const allSkills: SkillMeta[] = [];

  for (const dir of SKILLS_DIRS) {
    console.error(`[Skills Controller] 扫描目录: ${dir}`);
    const skills = await scanSkillsDirectory(dir);

    for (const skill of skills) {
      if (!seenSkills.has(skill.name)) {
        seenSkills.add(skill.name);
        allSkills.push(skill);
      } else {
        console.error(`[Skills Controller] 跳过重复技能: ${skill.name}`);
      }
    }
  }

  SKILL_REGISTRY = allSkills;
  console.error(`[Skills Controller] 已加载 ${SKILL_REGISTRY.length} 个技能（去重后）`);

  // 启动服务器
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("[Skills Controller] MCP 服务器已启动");
}

main().catch(console.error);
