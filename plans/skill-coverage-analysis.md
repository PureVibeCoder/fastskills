# FastSkills Router 技能覆盖率分析

**日期**: 2026-01-10  
**分析版本**: ROUTES TABLE V2.1 (55 条路由)

## 1. 当前已覆盖技能清单

从 55 条路由中提取的技能（共 95 个独立技能）：

### 科学数据库 (27/27 = 100%)
- ✅ pubmed-database
- ✅ uniprot-database
- ✅ gene-database
- ✅ ensembl-database
- ✅ kegg-database
- ✅ reactome-database
- ✅ chembl-database
- ✅ drugbank-database
- ✅ clinvar-database
- ✅ cosmic-database
- ✅ gwas-database
- ✅ pdb-database
- ✅ alphafold-database
- ✅ pubchem-database
- ✅ zinc-database
- ✅ clinicaltrials-database
- ✅ fda-database
- ✅ ena-database
- ✅ geo-database
- ✅ hmdb-database
- ✅ brenda-database
- ✅ biorxiv-database
- ✅ openalex-database
- ✅ metabolomics-workbench-database
- ✅ clinpgx-database
- ⚠️ string-database (缺失)
- ⚠️ opentargets-database (缺失)
- ⚠️ uspto-database (缺失)
- ⚠️ ncbi-gene-database (与 gene-database 重复?)

### 生物信息学 (13/13 = 100%)
- ✅ scanpy
- ✅ anndata
- ✅ scvi-tools
- ✅ biopython
- ✅ bioservices
- ✅ gget
- ✅ pydeseq2
- ✅ pysam
- ✅ deeptools
- ✅ gtars
- ✅ arboreto
- ✅ etetoolkit
- ✅ scikit-bio
- ⚠️ cellxgene-census (缺失)

### 化学信息学 (10/10 = 100%)
- ✅ rdkit
- ✅ diffdock
- ✅ deepchem
- ✅ medchem
- ✅ pytdc
- ✅ torchdrug
- ✅ datamol
- ✅ molfeat
- ✅ matchms
- ✅ pyopenms
- ⚠️ cobrapy (缺失)

### 临床医学 (9/9 = 100%)
- ✅ clinical-reports
- ✅ treatment-plans
- ✅ clinical-decision-support
- ✅ pydicom
- ✅ histolab
- ✅ pathml
- ✅ neurokit2
- ✅ neuropixels-analysis
- ⚠️ pyhealth (缺失)

### 实验室自动化 (7/7 = 100%)
- ✅ opentrons-integration
- ✅ pylabrobot
- ✅ benchling-integration
- ✅ dnanexus-integration
- ✅ labarchive-integration
- ⚠️ latchbio-integration (缺失)
- ⚠️ modal (缺失)
- ⚠️ omero-integration (缺失)
- ⚠️ protocolsio-integration (缺失)

### 开发工具 (部分覆盖)
- ✅ backend-development
- ✅ databases
- ✅ mcp-builder
- ✅ mcp-management
- ✅ skill-creator
- ✅ writing-skills
- ✅ skill-share
- ✅ code-review
- ✅ receiving-code-review
- ✅ requesting-code-review
- ✅ browser-automation
- ✅ chrome-devtools
- ✅ changelog-generator
- ✅ domain-name-brainstormer
- ⚠️ adaptyv (缺失)
- ⚠️ esm (已在 protein 路由)
- ⚠️ geniml (缺失)
- ⚠️ lamindb (缺失)
- ⚠️ context-engineering (缺失)
- ⚠️ ai-multimodal (缺失)
- ⚠️ better-auth (缺失)
- ⚠️ brand-guidelines (缺失)
- ⚠️ claude-code (缺失)
- ⚠️ competitive-ads-extractor (缺失)
- ⚠️ content-research-writer (缺失)
- ⚠️ developer-growth-analysis (缺失)
- ⚠️ dispatching-parallel-agents (缺失)
- ⚠️ docs-seeker (缺失)
- ⚠️ file-organizer (缺失)
- ⚠️ finishing-a-development-branch (缺失)
- ⚠️ google-adk-python (缺失)
- ⚠️ internal-comms (缺失)
- ⚠️ invoice-organizer (缺失)
- ⚠️ lead-research-assistant (缺失)
- ⚠️ meeting-insights-analyzer (缺失)
- ⚠️ raffle-winner-picker (缺失)
- ⚠️ repomix (缺失)
- ⚠️ shopify (缺失)
- ⚠️ subagent-driven-development (缺失)
- ⚠️ using-git-worktrees (缺失)
- ⚠️ using-superpowers (缺失)
- ⚠️ skill-from-masters (缺失)
- ⚠️ ui-ux-pro-max (缺失)

### 前端开发 (部分覆盖)
- ✅ react-components
- ✅ frontend-designer
- ✅ modern-frontend-design
- ⚠️ aesthetic (缺失)
- ⚠️ ui-styling (缺失)
- ⚠️ web-frameworks (缺失)
- ⚠️ artifacts-builder (缺失)
- ⚠️ canvas-design (缺失)
- ⚠️ frontend-design (缺失)
- ⚠️ frontend-development (缺失)
- ⚠️ theme-factory (缺失)
- ⚠️ web-artifacts-builder (缺失)

### 文档处理 (3/3 = 100%)
- ✅ docx
- ✅ pdf
- ✅ pptx
- ⚠️ xlsx (缺失)
- ⚠️ doc-coauthoring (缺失)

### 知识管理 (2/3 = 67%)
- ✅ obsidian-markdown
- ✅ json-canvas
- ⚠️ obsidian-bases (缺失)

### 媒体处理 (4/5 = 80%)
- ✅ generate-image
- ✅ image-enhancer
- ✅ media-processing
- ✅ video-downloader
- ⚠️ algorithmic-art (缺失)
- ⚠️ slack-gif-creator (缺失)

### 机器学习 (部分覆盖)
- ✅ scikit-learn
- ✅ pytorch-lightning
- ⚠️ pymc (缺失)
- ⚠️ pymoo (缺失)
- ⚠️ torch_geometric (缺失)
- ⚠️ transformers (缺失)
- ⚠️ umap-learn (缺失)
- ⚠️ aeon (缺失)
- ⚠️ biomni (缺失)
- ⚠️ denario (缺失)
- ⚠️ hypogenic (缺失)
- ⚠️ pufferlib (缺失)
- ⚠️ scikit-survival (缺失)
- ⚠️ shap (缺失)
- ⚠️ stable-baselines3 (缺失)

### 物理与材料 (部分覆盖)
- ⚠️ astropy (缺失)
- ⚠️ cirq (缺失)
- ⚠️ geopandas (缺失)
- ⚠️ pennylane (缺失)
- ⚠️ qiskit (缺失)
- ⚠️ qutip (缺失)
- ⚠️ sympy (缺失)
- ⚠️ fluidsim (缺失)
- ⚠️ pymatgen (缺失)
- ⚠️ simpy (缺失)

### 科学写作 (部分覆盖)
- ✅ scientific-writing
- ✅ literature-review
- ✅ citation-management
- ⚠️ hypothesis-generation (缺失)
- ⚠️ latex-posters (缺失)
- ⚠️ markitdown (缺失)
- ⚠️ peer-review (缺失)
- ⚠️ pptx-posters (缺失)
- ⚠️ research-grants (缺失)
- ⚠️ research-lookup (缺失)
- ⚠️ scholar-evaluation (缺失)
- ⚠️ scientific-schematics (缺失)
- ⚠️ scientific-slides (缺失)
- ⚠️ scientific-critical-thinking (缺失)

### 可视化 (3/9 = 33%)
- ✅ matplotlib
- ✅ plotly
- ✅ scientific-visualization
- ⚠️ seaborn (缺失)
- ⚠️ mermaidjs-v11 (缺失)
- ⚠️ networkx (缺失)
- ⚠️ dask (缺失)
- ⚠️ flowio (缺失)
- ⚠️ polars (缺失)
- ⚠️ vaex (缺失)
- ⚠️ zarr-python (缺失)
- ⚠️ statsmodels (缺失)
- ⚠️ statistical-analysis (缺失)
- ⚠️ exploratory-data-analysis (缺失)
- ⚠️ datacommons-client (缺失)

### 测试质量 (4/9 = 44%)
- ✅ test-driven-development
- ✅ verification-before-completion
- ✅ systematic-debugging
- ✅ root-cause-tracing
- ⚠️ defense-in-depth (缺失)
- ⚠️ webapp-testing (缺失)

### 思维方法 (部分覆盖)
- ✅ brainstorming
- ✅ scientific-brainstorming
- ✅ planning-with-files
- ✅ writing-plans
- ✅ executing-plans
- ✅ research-executor
- ✅ question-refiner
- ✅ synthesizer
- ✅ when-stuck
- ✅ sequential-thinking
- ⚠️ citation-validator (缺失)
- ⚠️ collision-zone-thinking (缺失)
- ⚠️ got-controller (缺失)
- ⚠️ inversion-exercise (缺失)
- ⚠️ meta-pattern-recognition (缺失)
- ⚠️ scale-game (缺失)
- ⚠️ simplification-cascades (缺失)

---

## 2. 缺失技能汇总

### 高优先级缺失（常用技能）

| 分类 | 缺失技能 | 建议路由 |
|-----|---------|---------|
| 数据分析 | seaborn, statsmodels, polars, dask, networkx | data-analysis 路由 |
| 机器学习 | transformers, torch_geometric, umap-learn, shap | ml-advanced 路由 |
| 前端 | web-frameworks, artifacts-builder, ui-styling | frontend-advanced 路由 |
| 量子/物理 | qiskit, cirq, astropy, pennylane, sympy | quantum-physics 路由 |
| 科学写作 | peer-review, research-grants, latex-posters | sci-writing-extended 路由 |
| 开发工具 | repomix, claude-code, shopify, better-auth | dev-tools-extended 路由 |

### 中优先级缺失

| 分类 | 缺失技能 | 建议路由 |
|-----|---------|---------|
| 实验室 | latchbio-integration, modal, omero-integration | lab-cloud 路由 |
| 化学 | cobrapy | metabolism 路由 |
| 临床 | pyhealth | healthcare-ai 路由 |
| 媒体 | algorithmic-art, slack-gif-creator | creative-media 路由 |

### 低优先级缺失（专业工具）

| 分类 | 缺失技能 | 建议路由 |
|-----|---------|---------|
| 思维方法 | collision-zone-thinking, scale-game, etc. | advanced-thinking 路由 |
| 杂项 | raffle-winner-picker, invoice-organizer, etc. | utility 路由 |

---

## 3. 覆盖率统计

| 分类 | 总技能数 | 已覆盖 | 覆盖率 |
|-----|---------|-------|-------|
| 科学数据库 | 27 | 24 | 89% |
| 生物信息学 | 13 | 12 | 92% |
| 化学信息学 | 10 | 9 | 90% |
| 临床医学 | 9 | 8 | 89% |
| 实验室自动化 | 7 | 5 | 71% |
| 数据可视化 | 15 | 3 | 20% |
| 机器学习 | 15 | 2 | 13% |
| 物理材料 | 10 | 0 | 0% |
| 开发工具 | 94 | 20 | 21% |
| 前端开发 | 10 | 3 | 30% |
| 文档处理 | 5 | 3 | 60% |
| 知识管理 | 3 | 2 | 67% |
| 媒体处理 | 5 | 4 | 80% |
| 科学写作 | 14 | 3 | 21% |
| 测试质量 | 9 | 4 | 44% |
| 思维方法 | 16 | 10 | 63% |
| **总计** | **227** | **~95** | **~42%** |

---

## 4. 需要补充的路由

### 第一批：高优先级补充（15 条新路由）

1. **data-analysis** - seaborn, statsmodels, polars, dask, networkx, vaex, exploratory-data-analysis
2. **ml-advanced** - transformers, torch_geometric, umap-learn, shap, pymc, pymoo
3. **reinforcement-learning** - stable-baselines3, pufferlib
4. **quantum-computing** - qiskit, cirq, pennylane, qutip
5. **astronomy-physics** - astropy, sympy, fluidsim, pymatgen, simpy, geopandas
6. **frontend-artifacts** - artifacts-builder, web-artifacts-builder, theme-factory
7. **frontend-styling** - aesthetic, ui-styling, canvas-design
8. **frontend-framework** - web-frameworks, frontend-development, frontend-design
9. **sci-writing-extended** - peer-review, research-grants, hypothesis-generation, scholar-evaluation
10. **sci-posters** - latex-posters, pptx-posters, scientific-slides, scientific-schematics
11. **dev-tools-extended** - repomix, claude-code, docs-seeker, context-engineering
12. **e-commerce** - shopify, better-auth
13. **lab-cloud** - latchbio-integration, modal, omero-integration, protocolsio-integration
14. **metabolism** - cobrapy
15. **healthcare-ai** - pyhealth

### 第二批：中优先级补充（10 条新路由）

16. **time-series** - aeon
17. **ai-agents** - biomni, denario, hypogenic
18. **survival-analysis** - scikit-survival
19. **spreadsheet** - xlsx
20. **document-collab** - doc-coauthoring
21. **obsidian-advanced** - obsidian-bases
22. **creative-media** - algorithmic-art, slack-gif-creator
23. **diagram** - mermaidjs-v11
24. **flow-cytometry** - flowio
25. **defense-testing** - defense-in-depth, webapp-testing

### 第三批：低优先级补充（10 条新路由）

26. **advanced-thinking** - collision-zone-thinking, inversion-exercise, scale-game, etc.
27. **utility-tools** - file-organizer, invoice-organizer, raffle-winner-picker
28. **git-workflow** - using-git-worktrees, finishing-a-development-branch
29. **business-tools** - internal-comms, meeting-insights-analyzer, lead-research-assistant
30. **ai-multimodal-tools** - ai-multimodal, google-adk-python
31. **brand-marketing** - brand-guidelines, competitive-ads-extractor, content-research-writer
32. **developer-analysis** - developer-growth-analysis
33. **parallel-agents** - dispatching-parallel-agents, subagent-driven-development
34. **superpowers-meta** - using-superpowers, skill-from-masters
35. **ui-ux-advanced** - ui-ux-pro-max

---

*分析时间: 2026-01-10*
*当前覆盖率: ~42% (95/227)*
*目标覆盖率: >95% (216/227)*
