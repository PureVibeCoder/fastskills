export interface SkillPackage {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  skills: string[];
  recommended: boolean;
  category?: string; // 所属分类，用于筛选
}

export const skillPackages: SkillPackage[] = [
  {
    id: 'frontend-developer',
    name: '前端开发者套件',
    nameEn: 'Frontend Developer Kit',
    description: '适合前端工程师，包含 UI 设计、组件开发、响应式布局等技能',
    icon: '🎨',
    skills: [
      'frontend-design',
      'modern-frontend-design',
      'canvas-design',
      'theme-factory',
      'webapp-testing',
      'react-components'
    ],
    recommended: true
  },
  {
    id: 'fullstack-developer',
    name: '全栈开发者套件',
    nameEn: 'Fullstack Developer Kit',
    description: '覆盖前后端开发全流程，适合全栈工程师',
    icon: '⚡',
    skills: [
      'frontend-design',
      'backend-development',
      'database-design',
      'devops',
      'webapp-testing',
      'code-review'
    ],
    recommended: true
  },
  {
    id: 'document-production',
    name: '文档生产套件',
    nameEn: 'Document Production Kit',
    description: '专注于文档生成和处理，适合技术写作者',
    icon: '📄',
    skills: [
      'doc-coauthoring',
      'docx',
      'pdf',
      'pptx',
      'xlsx',
      'document-skills'
    ],
    recommended: true
  },
  {
    id: 'knowledge-management',
    name: '知识管理套件',
    nameEn: 'Knowledge Management Kit',
    description: 'Obsidian 笔记系统、知识库管理、可视化',
    icon: '📓',
    skills: [
      'obsidian-markdown',
      'obsidian-bases',
      'json-canvas',
      'document-skills'
    ],
    recommended: true
  },
  {
    id: 'devops-engineer',
    name: 'DevOps 工程师套件',
    nameEn: 'DevOps Engineer Kit',
    description: 'CI/CD、容器化、部署自动化相关技能',
    icon: '🚀',
    skills: [
      'devops',
      'docker',
      'mcp-builder',
      'skill-creator'
    ],
    recommended: false
  },
  {
    id: 'content-creator',
    name: '内容创作套件',
    nameEn: 'Content Creator Kit',
    description: '适合内容创作者和营销人员',
    icon: '✍️',
    skills: [
      'content-research-writer',
      'brand-guidelines',
      'internal-comms',
      'slack-gif-creator',
      'changelog-generator'
    ],
    recommended: false
  },
  {
    id: 'research-analyst',
    name: '研究分析套件',
    nameEn: 'Research Analyst Kit',
    description: '深度研究和数据分析相关技能',
    icon: '📊',
    skills: [
      'lead-research-assistant',
      'developer-growth-analysis',
      'competitive-ads-extractor',
      'meeting-insights-analyzer'
    ],
    recommended: false
  },
  {
    id: 'media-processing',
    name: '媒体处理套件',
    nameEn: 'Media Processing Kit',
    description: '图片、视频等媒体文件处理',
    icon: '🎬',
    skills: [
      'image-enhancer',
      'video-downloader',
      'canvas-design',
      'algorithmic-art',
      'slack-gif-creator'
    ],
    recommended: false
  },
  {
    id: 'productivity-tools',
    name: '效率工具套件',
    nameEn: 'Productivity Tools Kit',
    description: '提升日常工作效率的实用技能',
    icon: '⚡',
    skills: [
      'file-organizer',
      'invoice-organizer',
      'meeting-insights-analyzer',
      'raffle-winner-picker',
      'domain-name-brainstormer'
    ],
    recommended: false
  },

  {
    id: 'task-planning',
    name: '任务规划套件',
    nameEn: 'Task Planning Kit',
    description: 'Manus 风格文件规划、任务追踪、上下文工程',
    icon: '🧠',
    skills: [
      'planning-with-files',
      'sequential-thinking'
    ],
    recommended: false
  },
  {
    id: 'testing-qa',
    name: '测试与质量保障套件',
    nameEn: 'Testing & QA Kit',
    description: '自动化测试、代码审查、质量保障',
    icon: '✅',
    skills: [
      'webapp-testing',
      'code-review',
      'browser-automation'
    ],
    recommended: false
  },
  {
    id: 'backend-specialist',
    name: '后端专家套件',
    nameEn: 'Backend Specialist Kit',
    description: 'API 设计、数据库、认证授权相关技能',
    icon: '⚙️',
    skills: [
      'backend-development',
      'database-design',
      'devops'
    ],
    recommended: false
  },
  {
    id: 'design-system',
    name: '设计系统套件',
    nameEn: 'Design System Kit',
    description: 'UI 设计、主题、品牌相关技能',
    icon: '🎭',
    skills: [
      'frontend-design',
      'modern-frontend-design',
      'theme-factory',
      'brand-guidelines',
      'canvas-design',
      'ui-skills'
    ],
    recommended: false
  },
  // ===== 科学研究场景包 =====
  {
    id: 'drug-discovery',
    name: '药物发现套件',
    nameEn: 'Drug Discovery Kit',
    description: '虚拟筛选、分子对接、ADMET 预测、化合物优化',
    icon: '💊',
    skills: [
      'rdkit',
      'deepchem',
      'datamol',
      'molfeat',
      'diffdock',
      'medchem',
      'torchdrug',
      'chembl-database',
      'pubchem-database',
      'drugbank-database',
      'zinc-database'
    ],
    recommended: true,
    category: 'scientific'
  },
  {
    id: 'genomics-bioinformatics',
    name: '基因组学与生物信息学套件',
    nameEn: 'Genomics & Bioinformatics Kit',
    description: '序列分析、单细胞 RNA-seq、基因调控网络',
    icon: '🧬',
    skills: [
      'biopython',
      'scanpy',
      'anndata',
      'scvi-tools',
      'arboreto',
      'pysam',
      'gget',
      'scikit-bio',
      'etetoolkit',
      'deeptools',
      'ensembl-database',
      'ncbi-gene-database'
    ],
    recommended: true,
    category: 'scientific'
  },
  {
    id: 'clinical-research',
    name: '临床研究套件',
    nameEn: 'Clinical Research Kit',
    description: '临床试验、变异解读、药物基因组学、精准医疗',
    icon: '🏥',
    skills: [
      'clinical-decision-support',
      'clinical-reports',
      'treatment-plans',
      'pyhealth',
      'neurokit2',
      'clinvar-database',
      'clinpgx-database',
      'clinicaltrials-database',
      'cosmic-database',
      'fda-database'
    ],
    recommended: true,
    category: 'scientific'
  },
  {
    id: 'ml-deep-learning',
    name: '机器学习与深度学习套件',
    nameEn: 'ML & Deep Learning Kit',
    description: 'PyTorch、scikit-learn、强化学习、模型解释',
    icon: '🤖',
    skills: [
      'pytorch-lightning',
      'transformers',
      'scikit-learn',
      'scikit-survival',
      'shap',
      'stable-baselines3',
      'pufferlib',
      'pymc',
      'pymoo',
      'torch_geometric',
      'umap-learn',
      'aeon'
    ],
    recommended: false,
    category: 'scientific'
  },
  {
    id: 'quantum-physics',
    name: '量子计算与物理套件',
    nameEn: 'Quantum & Physics Kit',
    description: '量子计算、天文学、材料科学',
    icon: '🔮',
    skills: [
      'qiskit',
      'pennylane',
      'cirq',
      'qutip',
      'astropy',
      'pymatgen',
      'sympy'
    ],
    recommended: false,
    category: 'scientific'
  },
  {
    id: 'data-visualization',
    name: '科学数据可视化套件',
    nameEn: 'Scientific Data Visualization Kit',
    description: '统计分析、网络可视化、出版级图表',
    icon: '📊',
    skills: [
      'matplotlib',
      'seaborn',
      'plotly',
      'scientific-visualization',
      'networkx',
      'statsmodels',
      'statistical-analysis',
      'exploratory-data-analysis',
      'polars',
      'dask',
      'vaex'
    ],
    recommended: false,
    category: 'scientific'
  },
  {
    id: 'scientific-databases',
    name: '科学数据库套件',
    nameEn: 'Scientific Databases Kit',
    description: 'PubMed、UniProt、KEGG 等 28+ 科学数据库访问',
    icon: '🗄️',
    skills: [
      'pubmed-database',
      'uniprot-database',
      'pdb-database',
      'alphafold-database',
      'kegg-database',
      'reactome-database',
      'string-database',
      'opentargets-database',
      'openalex-database',
      'biorxiv-database',
      'geo-database',
      'ena-database'
    ],
    recommended: false,
    category: 'scientific'
  },
  {
    id: 'scientific-writing',
    name: '科学写作与交流套件',
    nameEn: 'Scientific Writing & Communication Kit',
    description: '论文写作、同行评审、海报制作、文献管理',
    icon: '📝',
    skills: [
      'scientific-writing',
      'literature-review',
      'peer-review',
      'citation-management',
      'scientific-slides',
      'latex-posters',
      'pptx-posters',
      'scientific-schematics',
      'paper-2-web',
      'venue-templates'
    ],
    recommended: false,
    category: 'scientific'
  },
  {
    id: 'proteomics-multiomics',
    name: '蛋白质组学与多组学套件',
    nameEn: 'Proteomics & Multi-omics Kit',
    description: '质谱分析、蛋白质工程、多组学整合',
    icon: '🔬',
    skills: [
      'matchms',
      'pyopenms',
      'esm',
      'adaptyv',
      'pydeseq2',
      'lamindb',
      'biomni',
      'denario',
      'hypogenic'
    ],
    recommended: false,
    category: 'scientific'
  },
  {
    id: 'lab-automation',
    name: '实验室自动化套件',
    nameEn: 'Lab Automation Kit',
    description: '液体处理、实验流程自动化、LIMS 集成',
    icon: '🔧',
    skills: [
      'pylabrobot',
      'opentrons-integration',
      'protocolsio-integration',
      'benchling-integration',
      'labarchive-integration',
      'dnanexus-integration',
      'latchbio-integration',
      'omero-integration'
    ],
    recommended: false,
    category: 'scientific'
  },
  {
    id: 'medical-imaging',
    name: '医学影像与病理套件',
    nameEn: 'Medical Imaging & Pathology Kit',
    description: 'DICOM 处理、全切片分析、计算病理学',
    icon: '🖼️',
    skills: [
      'pydicom',
      'histolab',
      'pathml',
      'neuropixels-analysis'
    ],
    recommended: false,
    category: 'scientific'
  }
];

export function getRecommendedPackages(): SkillPackage[] {
  return skillPackages.filter(pkg => pkg.recommended);
}

export function getPackageById(id: string): SkillPackage | undefined {
  return skillPackages.find(pkg => pkg.id === id);
}

export function getPackagesBySkill(skillId: string): SkillPackage[] {
  return skillPackages.filter(pkg => pkg.skills.includes(skillId));
}

// 获取科学研究相关的场景包
export function getScientificPackages(): SkillPackage[] {
  return skillPackages.filter(pkg => pkg.category === 'scientific');
}

// 获取推荐的科学研究套件（首页展示）
export function getRecommendedScientificPackages(): SkillPackage[] {
  return skillPackages.filter(pkg => pkg.category === 'scientific' && pkg.recommended);
}
