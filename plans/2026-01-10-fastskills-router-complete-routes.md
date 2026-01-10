# FastSkills Router 完整路由修复计划

**日期**: 2026-01-10  
**状态**: ✅ 已完成  
**优先级**: 高  

## 问题描述

用户请求 "从 PubMed 搜索 CRISPR 基因编辑的最新论文" 时，FastSkills Router 未能触发正确的 `pubmed-database` 技能，因为当前 ROUTES TABLE 缺少科学数据库相关的路由规则。

### 根因分析

| 问题 | 当前状态 | 目标状态 |
|-----|---------|---------|
| ROUTES TABLE 路由数 | 16 条 | 55 条 |
| 科学数据库路由 | 0 条 | 12 条 |
| 生物信息学路由 | 2 条 | 6 条 |
| 化学信息学路由 | 0 条 | 4 条 |
| 覆盖技能数 | ~30 | 200+ |

## 设计决策（已确认）

1. **优先级冲突**: 只触发最高优先级的一个路由
2. **路由粒度**: 按领域分组（约 12 条科学数据库路由）
3. **语言优先级**: 中英文关键词平等对待

## 新增路由清单

### 1. 科学数据库路由（12 条）

| Priority | ID | Keywords (Any Match) | Load Skills |
|----------|----|--------------------|-------------|
| 87 | pubmed-search | PubMed, 医学文献, NCBI, 文献搜索, literature search, medical paper, 论文搜索 | `pubmed-database, citation-management, biopython` |
| 86 | protein-db | UniProt, 蛋白质数据库, protein database, SwissProt, TrEMBL | `uniprot-database, biopython, bioservices` |
| 85 | gene-db | NCBI Gene, 基因数据库, Gene ID, Ensembl, 基因注释, gene annotation | `gene-database, ensembl-database, biopython` |
| 84 | pathway-db | KEGG, Reactome, 代谢通路, pathway, 信号通路, metabolic pathway | `kegg-database, reactome-database, bioservices` |
| 83 | drug-db | ChEMBL, DrugBank, 药物数据库, drug database, 活性化合物, bioactivity | `chembl-database, drugbank-database, rdkit` |
| 82 | variant-db | ClinVar, COSMIC, GWAS, 变异, variant, 突变, mutation, SNP | `clinvar-database, cosmic-database, gwas-database` |
| 81 | structure-db | PDB, AlphaFold, 蛋白质结构, protein structure, 3D结构, crystal structure | `pdb-database, alphafold-database, esm` |
| 80 | compound-db | PubChem, ZINC, 化合物, compound, SMILES, 分子, molecule | `pubchem-database, zinc-database, rdkit` |
| 79 | clinical-db | ClinicalTrials, FDA, 临床试验, clinical trial, adverse event | `clinicaltrials-database, fda-database` |
| 78 | sequence-db | ENA, GEO, 序列数据库, sequence database, NGS, expression data | `ena-database, geo-database, biopython` |
| 77 | metabolite-db | HMDB, BRENDA, 代谢物, metabolite, 酶动力学, enzyme kinetics | `hmdb-database, brenda-database` |
| 76 | preprint-db | bioRxiv, medRxiv, 预印本, preprint, OpenAlex | `biorxiv-database, openalex-database` |

### 2. 生物信息学路由（6 条）

| Priority | ID | Keywords (Any Match) | Load Skills |
|----------|----|--------------------|-------------|
| 85 | single-cell | 单细胞, scRNA, single-cell, scanpy, anndata, 10x genomics, scRNA-seq | `scanpy, anndata, scvi-tools, biopython` |
| 84 | gene-editing | CRISPR, 基因编辑, gene editing, Cas9, 基因敲除, knockout | `biopython, gene-database` |
| 83 | sequence-analysis | BLAST, 序列分析, sequence analysis, FASTA, GenBank, 序列比对, alignment | `biopython, gget, bioservices` |
| 82 | genomics | 基因组, genomics, NGS, RNA-seq, 差异表达, DESeq, differential expression | `pydeseq2, pysam, deeptools, gtars` |
| 81 | regulatory-network | 基因调控, GRN, regulatory network, 转录因子, transcription factor | `arboreto, biopython` |
| 80 | phylogenetics | 系统发育, phylogenetic, 进化树, phylogeny, evolution tree | `biopython, etetoolkit, scikit-bio` |

### 3. 化学信息学路由（4 条）

| Priority | ID | Keywords (Any Match) | Load Skills |
|----------|----|--------------------|-------------|
| 75 | molecular-docking | 分子对接, docking, 虚拟筛选, virtual screening, binding affinity | `diffdock, rdkit, deepchem` |
| 74 | drug-discovery | 药物发现, drug discovery, ADMET, 药物设计, drug design, lead optimization | `deepchem, medchem, pytdc, torchdrug` |
| 73 | cheminformatics | 化学信息学, cheminformatics, RDKit, SMILES, 分子特征, molecular fingerprint | `rdkit, datamol, molfeat` |
| 72 | mass-spec | 质谱, mass spectrometry, MS/MS, 代谢组学, metabolomics, proteomics | `matchms, pyopenms, metabolomics-workbench-database` |

### 4. 临床医学路由（4 条）

| Priority | ID | Keywords (Any Match) | Load Skills |
|----------|----|--------------------|-------------|
| 70 | clinical-research | 临床研究, clinical research, 病例报告, case report, 治疗计划, treatment plan | `clinical-reports, treatment-plans, clinical-decision-support` |
| 69 | medical-imaging | 医学影像, DICOM, 病理切片, WSI, CT, MRI, pathology | `pydicom, histolab, pathml` |
| 68 | precision-medicine | 精准医疗, 药物基因组学, pharmacogenomics, precision medicine | `clinpgx-database, clinvar-database` |
| 67 | neuro-analysis | 神经信号, ECG, EEG, 心电图, 脑电图, biosignal | `neurokit2, neuropixels-analysis` |

### 5. 实验室自动化路由（2 条）

| Priority | ID | Keywords (Any Match) | Load Skills |
|----------|----|--------------------|-------------|
| 65 | lab-automation | 液体处理, Opentrons, 实验室自动化, lab automation, liquid handling, robot | `opentrons-integration, pylabrobot` |
| 64 | lab-platform | Benchling, DNAnexus, LabArchive, 实验记录, ELN, LIMS | `benchling-integration, dnanexus-integration, labarchive-integration` |

### 6. 开发工具补充路由（6 条）

| Priority | ID | Keywords (Any Match) | Load Skills |
|----------|----|--------------------|-------------|
| 55 | mcp-development | MCP, Model Context Protocol, MCP服务器, MCP server | `mcp-builder, mcp-management` |
| 54 | skill-creation | 技能, skill, 创建技能, Claude skill, agent skill | `skill-creator, writing-skills, skill-share` |
| 53 | code-quality | 代码审查, code review, 代码质量, code quality | `code-review, receiving-code-review, requesting-code-review` |
| 52 | browser-auto | Puppeteer, Playwright, 浏览器自动化, browser automation, web scraping | `browser-automation, chrome-devtools` |
| 51 | changelog | changelog, 版本日志, release notes, git log | `changelog-generator` |
| 50 | domain-naming | 域名, domain name, 品牌命名, naming | `domain-name-brainstormer` |

### 7. 媒体处理路由（2 条）

| Priority | ID | Keywords (Any Match) | Load Skills |
|----------|----|--------------------|-------------|
| 48 | image-generation | 生成图片, generate image, FLUX, 图像生成, image generation, AI绘画 | `generate-image, image-enhancer` |
| 47 | video-processing | 视频, video, FFmpeg, 音频, audio, 转换, convert | `media-processing, video-downloader` |

### 8. 思维方法路由（3 条）

| Priority | ID | Keywords (Any Match) | Load Skills |
|----------|----|--------------------|-------------|
| 45 | task-planning | 任务规划, task planning, Manus, 计划, planning, 实现计划 | `planning-with-files, writing-plans, executing-plans` |
| 44 | research-workflow | 深度研究, deep research, 研究执行, research executor | `research-executor, question-refiner, synthesizer` |
| 43 | problem-solving | 卡住了, stuck, 突破口, breakthrough, 问题解决 | `when-stuck, sequential-thinking` |

## 新测试用例

| # | 测试场景 | 测试输入 | 预期触发路由 |
|---|---------|---------|-------------|
| T1 | 科学数据库-PubMed | 从 PubMed 搜索 CRISPR 基因编辑的最新论文 | pubmed-search |
| T2 | 科学数据库-UniProt | 从 UniProt 查询 TP53 蛋白序列 | protein-db |
| T3 | 科学数据库-KEGG | 从 KEGG 获取糖酵解代谢通路 | pathway-db |
| T4 | 生物信息学-基因编辑 | 设计 CRISPR 引物编辑 BRCA1 基因 | gene-editing |
| T5 | 化学信息学-分子对接 | 用虚拟筛选找到与 ACE2 结合的化合物 | molecular-docking |
| T6 | 临床医学-影像 | 分析这张 DICOM 胸部 CT 图像 | medical-imaging |
| T7 | 混合场景 | 从 PubMed 搜索 CRISPR 并分析差异表达基因 | pubmed-search (最高优先级) |

## 文件修改清单

| 文件路径 | 操作 | 描述 |
|---------|------|------|
| `purevibecoder-skills/fastskills-router/SKILL.md` | 修改 | 扩展 ROUTES TABLE 从 16 条到 55 条 |
| `FASTSKILLS_ROUTER_TEST_CASES.md` | 修改 | 添加新测试用例 |
| `plans/2026-01-10-fastskills-router-complete-routes.md` | 创建 | 本计划文件 |

## 成功指标

| 指标 | 当前值 | 目标值 |
|-----|-------|-------|
| ROUTES TABLE 路由数 | 16 | 55 |
| 科学数据库覆盖率 | 0% | 100% |
| 技能触发准确率 | ~60% | >95% |
| 中英文关键词覆盖 | 部分 | 完整 |

---

*计划创建时间: 2026-01-10*  
*FastSkills Router 版本: 2.0 → 2.1*
