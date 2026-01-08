import { categories, type Category } from './categories';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: Category;
  source: 'anthropic' | 'claudekit' | 'scientific' | 'community' | 'composio' | 'voltagent' | 'obsidian' | 'planning' | 'superpowers' | 'deep-research' | 'skill-from-masters';
  triggers: string[];
  priority: number;
  content: string;
}

// 分类索引映射
const categoryIndex: Record<string, number> = {
  'frontend': 0,
  'backend': 1,
  'testing': 2,
  'devops': 3,
  'scientific': 4,
  'bioinformatics': 5,
  'cheminformatics': 6,
  'clinical': 7,
  'ml-ai': 8,
  'physics-materials': 9,
  'data-viz': 10,
  'sci-databases': 11,
  'sci-communication': 12,
  'lab-automation': 13,
  'document': 14,
  'knowledge': 15,
  'media': 16,
  'thinking': 17,
  'tools': 18,
  'skill-dev': 19,
};

export const skills: Skill[] = [
  {
    id: 'backend-development',
    name: 'backend-development',
    description: 'Build robust backend systems with modern technologies (Node.js, Python, Go, Rust), frameworks (NestJS, FastAPI, Django), databases (PostgreSQL, MongoDB, Redis), APIs (REST, GraphQL, gRPC), authenticat',
    category: categories[categoryIndex['backend'] ?? 0],
    source: 'claudekit',
    triggers: ['backend', 'development', 'build', 'robust'],
    priority: 5,
    content: ''
  },
  {
    id: 'database-design',
    name: 'databases',
    description: 'Work with MongoDB (document database, BSON documents, aggregation pipelines, Atlas cloud) and PostgreSQL (relational database, SQL queries, psql CLI, pgAdmin). Use when designing database schemas, wri',
    category: categories[categoryIndex['backend'] ?? 0],
    source: 'claudekit',
    triggers: ['database', 'design', 'work', 'mongodb', 'document'],
    priority: 5,
    content: ''
  },
  {
    id: 'databases',
    name: 'databases',
    description: 'Work with MongoDB (document database, BSON documents, aggregation pipelines, Atlas cloud) and PostgreSQL (relational database, SQL queries, psql CLI, pgAdmin). Use when designing database schemas, wri',
    category: categories[categoryIndex['backend'] ?? 0],
    source: 'claudekit',
    triggers: ['databases', 'work', 'mongodb', 'document'],
    priority: 5,
    content: ''
  },
  {
    id: 'adaptyv',
    name: 'adaptyv',
    description: 'Cloud laboratory platform for automated protein testing and validation. Use when designing proteins and needing experimental validation including binding assays, expression testing, thermostability me',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['adaptyv', 'cloud', 'laboratory', 'platform'],
    priority: 5,
    content: ''
  },
  {
    id: 'anndata',
    name: 'anndata',
    description: 'This skill should be used when working with annotated data matrices in Python, particularly for single-cell genomics analysis, managing experimental measurements with metadata, or handling large-scale',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['anndata', 'skill', 'should', 'used'],
    priority: 5,
    content: ''
  },
  {
    id: 'arboreto',
    name: 'arboreto',
    description: 'Infer gene regulatory networks (GRNs) from gene expression data using scalable algorithms (GRNBoost2, GENIE3). Use when analyzing transcriptomics data (bulk RNA-seq, single-cell RNA-seq) to identify t',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['arboreto', 'infer', 'gene', 'regulatory'],
    priority: 5,
    content: ''
  },
  {
    id: 'biopython',
    name: 'biopython',
    description: '"Primary Python toolkit for molecular biology. Preferred for Python-based PubMed/NCBI queries (Bio.Entrez), sequence manipulation, file parsing (FASTA, GenBank, FASTQ, PDB), advanced BLAST workflows, ',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['biopython', 'primary', 'python', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'bioservices',
    name: 'bioservices',
    description: '"Primary Python tool for 40+ bioinformatics services. Preferred for multi-database workflows: UniProt, KEGG, ChEMBL, PubChem, Reactome, QuickGO. Unified API for queries, ID mapping, pathway analysis. ',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['bioservices', 'primary', 'python', 'tool'],
    priority: 5,
    content: ''
  },
  {
    id: 'cellxgene-census',
    name: 'cellxgene-census',
    description: '"Query CZ CELLxGENE Census (61M+ cells). Filter by cell type/tissue/disease, retrieve expression data, integrate with scanpy/PyTorch, for population-scale single-cell analysis."',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['cellxgene', 'census', 'query'],
    priority: 5,
    content: ''
  },
  {
    id: 'deeptools',
    name: 'deeptools',
    description: '"NGS analysis toolkit. BAM to bigWig conversion, QC (correlation, PCA, fingerprints), heatmaps/profiles (TSS, peaks), for ChIP-seq, RNA-seq, ATAC-seq visualization."',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['deeptools', 'analysis', 'toolkit', 'bigwig'],
    priority: 5,
    content: ''
  },
  {
    id: 'esm',
    name: 'esm',
    description: 'Comprehensive toolkit for protein language models including ESM3 (generative multimodal protein design across sequence, structure, and function) and ESM C (efficient protein embeddings and representat',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['esm', 'comprehensive', 'toolkit', 'protein'],
    priority: 5,
    content: ''
  },
  {
    id: 'etetoolkit',
    name: 'etetoolkit',
    description: '"Phylogenetic tree toolkit (ETE). Tree manipulation (Newick/NHX), evolutionary event detection, orthology/paralogy, NCBI taxonomy, visualization (PDF/SVG), for phylogenomics."',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['etetoolkit', 'phylogenetic', 'tree', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'geniml',
    name: 'geniml',
    description: 'This skill should be used when working with genomic interval data (BED files) for machine learning tasks. Use for training region embeddings (Region2Vec, BEDspace), single-cell ATAC-seq analysis (scEm',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['geniml', 'skill', 'should', 'used'],
    priority: 5,
    content: ''
  },
  {
    id: 'gget',
    name: 'gget',
    description: '"CLI/Python toolkit for rapid bioinformatics queries. Preferred for quick BLAST searches. Access to 20+ databases: gene info (Ensembl/UniProt), AlphaFold, ARCHS4, Enrichr, OpenTargets, COSMIC, genome ',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['gget', 'python', 'toolkit', 'rapid'],
    priority: 5,
    content: ''
  },
  {
    id: 'gtars',
    name: 'gtars',
    description: 'High-performance toolkit for genomic interval analysis in Rust with Python bindings. Use when working with genomic regions, BED files, coverage tracks, overlap detection, tokenization for ML models, o',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['gtars', 'high', 'performance', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'lamindb',
    name: 'lamindb',
    description: 'This skill should be used when working with LaminDB, an open-source data framework for biology that makes data queryable, traceable, reproducible, and FAIR. Use when managing biological datasets (scRN',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['lamindb', 'skill', 'should', 'used'],
    priority: 5,
    content: ''
  },
  {
    id: 'pydeseq2',
    name: 'pydeseq2',
    description: '"Differential gene expression analysis (Python DESeq2). Identify DE genes from bulk RNA-seq counts, Wald tests, FDR correction, volcano/MA plots, for RNA-seq analysis."',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['pydeseq2', 'differential', 'gene', 'expression'],
    priority: 5,
    content: ''
  },
  {
    id: 'pysam',
    name: 'pysam',
    description: '"Genomic file toolkit. Read/write SAM/BAM/CRAM alignments, VCF/BCF variants, FASTA/FASTQ sequences, extract regions, calculate coverage, for NGS data processing pipelines."',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['pysam', 'genomic', 'file', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'scanpy',
    name: 'scanpy',
    description: '"Single-cell RNA-seq analysis. Load .h5ad/10X data, QC, normalization, PCA/UMAP/t-SNE, Leiden clustering, marker genes, cell type annotation, trajectory, for scRNA-seq analysis."',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['scanpy', 'single', 'cell', 'analysis'],
    priority: 5,
    content: ''
  },
  {
    id: 'scikit-bio',
    name: 'scikit-bio',
    description: '"Biological data toolkit. Sequence analysis, alignments, phylogenetic trees, diversity metrics (alpha/beta, UniFrac), ordination (PCoA), PERMANOVA, FASTA/Newick I/O, for microbiome analysis."',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['scikit', 'bio', 'biological', 'data', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'scvi-tools',
    name: 'scvi-tools',
    description: 'This skill should be used when working with single-cell omics data analysis using scvi-tools, including scRNA-seq, scATAC-seq, CITE-seq, spatial transcriptomics, and other single-cell modalities. Use ',
    category: categories[categoryIndex['bioinformatics'] ?? 0],
    source: 'scientific',
    triggers: ['scvi', 'tools', 'skill', 'should', 'used'],
    priority: 5,
    content: ''
  },
  {
    id: 'cobrapy',
    name: 'cobrapy',
    description: '"Constraint-based metabolic modeling (COBRA). FBA, FVA, gene knockouts, flux sampling, SBML models, for systems biology and metabolic engineering analysis."',
    category: categories[categoryIndex['cheminformatics'] ?? 0],
    source: 'scientific',
    triggers: ['cobrapy', 'constraint', 'based', 'metabolic'],
    priority: 5,
    content: ''
  },
  {
    id: 'datamol',
    name: 'datamol',
    description: '"Pythonic wrapper around RDKit with simplified interface and sensible defaults. Preferred for standard drug discovery: SMILES parsing, standardization, descriptors, fingerprints, clustering, 3D confor',
    category: categories[categoryIndex['cheminformatics'] ?? 0],
    source: 'scientific',
    triggers: ['datamol', 'pythonic', 'wrapper', 'around'],
    priority: 5,
    content: ''
  },
  {
    id: 'deepchem',
    name: 'deepchem',
    description: '"Molecular machine learning toolkit. Property prediction (ADMET, toxicity), GNNs (GCN, MPNN), MoleculeNet benchmarks, pretrained models, featurization, for drug discovery ML."',
    category: categories[categoryIndex['cheminformatics'] ?? 0],
    source: 'scientific',
    triggers: ['deepchem', 'molecular', 'machine', 'learning'],
    priority: 5,
    content: ''
  },
  {
    id: 'diffdock',
    name: 'diffdock',
    description: '"Diffusion-based molecular docking. Predict protein-ligand binding poses from PDB/SMILES, confidence scores, virtual screening, for structure-based drug design. Not for affinity prediction."',
    category: categories[categoryIndex['cheminformatics'] ?? 0],
    source: 'scientific',
    triggers: ['diffdock', 'diffusion', 'based', 'molecular'],
    priority: 5,
    content: ''
  },
  {
    id: 'matchms',
    name: 'matchms',
    description: '"Mass spectrometry analysis. Process mzML/MGF/MSP, spectral similarity (cosine, modified cosine), metadata harmonization, compound ID, for metabolomics and MS data processing."',
    category: categories[categoryIndex['cheminformatics'] ?? 0],
    source: 'scientific',
    triggers: ['matchms', 'mass', 'spectrometry', 'analysis'],
    priority: 5,
    content: ''
  },
  {
    id: 'medchem',
    name: 'medchem',
    description: '"Medicinal chemistry filters. Apply drug-likeness rules (Lipinski, Veber), PAINS filters, structural alerts, complexity metrics, for compound prioritization and library filtering."',
    category: categories[categoryIndex['cheminformatics'] ?? 0],
    source: 'scientific',
    triggers: ['medchem', 'medicinal', 'chemistry', 'filters'],
    priority: 5,
    content: ''
  },
  {
    id: 'molfeat',
    name: 'molfeat',
    description: '"Molecular featurization for ML (100+ featurizers). ECFP, MACCS, descriptors, pretrained models (ChemBERTa), convert SMILES to features, for QSAR and molecular ML."',
    category: categories[categoryIndex['cheminformatics'] ?? 0],
    source: 'scientific',
    triggers: ['molfeat', 'molecular', 'featurization', 'featurizers'],
    priority: 5,
    content: ''
  },
  {
    id: 'pyopenms',
    name: 'pyopenms',
    description: 'Python interface to OpenMS for mass spectrometry data analysis. Use for LC-MS/MS proteomics and metabolomics workflows including file handling (mzML, mzXML, mzTab, FASTA, pepXML, protXML, mzIdentML), ',
    category: categories[categoryIndex['cheminformatics'] ?? 0],
    source: 'scientific',
    triggers: ['pyopenms', 'python', 'interface', 'openms'],
    priority: 5,
    content: ''
  },
  {
    id: 'pytdc',
    name: 'pytdc',
    description: '"Therapeutics Data Commons. AI-ready drug discovery datasets (ADME, toxicity, DTI), benchmarks, scaffold splits, molecular oracles, for therapeutic ML and pharmacological prediction."',
    category: categories[categoryIndex['cheminformatics'] ?? 0],
    source: 'scientific',
    triggers: ['pytdc', 'therapeutics', 'data', 'commons'],
    priority: 5,
    content: ''
  },
  {
    id: 'rdkit',
    name: 'rdkit',
    description: '"Cheminformatics toolkit for fine-grained molecular control. SMILES/SDF parsing, descriptors (MW, LogP, TPSA), fingerprints, substructure search, 2D/3D generation, similarity, reactions. For standard ',
    category: categories[categoryIndex['cheminformatics'] ?? 0],
    source: 'scientific',
    triggers: ['rdkit', 'cheminformatics', 'toolkit', 'fine'],
    priority: 5,
    content: ''
  },
  {
    id: 'torchdrug',
    name: 'torchdrug',
    description: '"Graph-based drug discovery toolkit. Molecular property prediction (ADMET), protein modeling, knowledge graph reasoning, molecular generation, retrosynthesis, GNNs (GIN, GAT, SchNet), 40+ datasets, fo',
    category: categories[categoryIndex['cheminformatics'] ?? 0],
    source: 'scientific',
    triggers: ['torchdrug', 'graph', 'based', 'drug'],
    priority: 5,
    content: ''
  },
  {
    id: 'clinical-decision-support',
    name: 'clinical-decision-support',
    description: '"Generate professional clinical decision support (CDS) documents for pharmaceutical and clinical research settings, including patient cohort analyses (biomarker-stratified with outcomes) and treatment',
    category: categories[categoryIndex['clinical'] ?? 0],
    source: 'scientific',
    triggers: ['clinical', 'decision', 'support', 'generate', 'professional'],
    priority: 5,
    content: ''
  },
  {
    id: 'clinical-reports',
    name: 'clinical-reports',
    description: '"Write comprehensive clinical reports including case reports (CARE guidelines), diagnostic reports (radiology/pathology/lab), clinical trial reports (ICH-E3, SAE, CSR), and patient documentation (SOAP',
    category: categories[categoryIndex['clinical'] ?? 0],
    source: 'scientific',
    triggers: ['clinical', 'reports', 'write', 'comprehensive'],
    priority: 5,
    content: ''
  },
  {
    id: 'histolab',
    name: 'histolab',
    description: 'Digital pathology image processing toolkit for whole slide images (WSI). Use this skill when working with histopathology slides, processing H&E or IHC stained tissue images, extracting tiles from giga',
    category: categories[categoryIndex['clinical'] ?? 0],
    source: 'scientific',
    triggers: ['histolab', 'digital', 'pathology', 'image'],
    priority: 5,
    content: ''
  },
  {
    id: 'neurokit2',
    name: 'neurokit2',
    description: 'Comprehensive biosignal processing toolkit for analyzing physiological data including ECG, EEG, EDA, RSP, PPG, EMG, and EOG signals. Use this skill when processing cardiovascular signals, brain activi',
    category: categories[categoryIndex['clinical'] ?? 0],
    source: 'scientific',
    triggers: ['neurokit2', 'comprehensive', 'biosignal', 'processing'],
    priority: 5,
    content: ''
  },
  {
    id: 'neuropixels-analysis',
    name: 'neuropixels-analysis',
    description: '"Neuropixels neural recording analysis. Load SpikeGLX/OpenEphys data, preprocess, motion correction, Kilosort4 spike sorting, quality metrics, Allen/IBL curation, AI-assisted visual analysis, for Neur',
    category: categories[categoryIndex['clinical'] ?? 0],
    source: 'scientific',
    triggers: ['neuropixels', 'analysis', 'neural', 'recording'],
    priority: 5,
    content: ''
  },
  {
    id: 'pathml',
    name: 'pathml',
    description: 'Computational pathology toolkit for analyzing whole-slide images (WSI) and multiparametric imaging data. Use this skill when working with histopathology slides, H&E stained images, multiplex immunoflu',
    category: categories[categoryIndex['clinical'] ?? 0],
    source: 'scientific',
    triggers: ['pathml', 'computational', 'pathology', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'pydicom',
    name: 'pydicom',
    description: 'Python library for working with DICOM (Digital Imaging and Communications in Medicine) files. Use this skill when reading, writing, or modifying medical imaging data in DICOM format, extracting pixel ',
    category: categories[categoryIndex['clinical'] ?? 0],
    source: 'scientific',
    triggers: ['pydicom', 'python', 'library', 'working'],
    priority: 5,
    content: ''
  },
  {
    id: 'pyhealth',
    name: 'pyhealth',
    description: 'Comprehensive healthcare AI toolkit for developing, testing, and deploying machine learning models with clinical data. This skill should be used when working with electronic health records (EHR), clin',
    category: categories[categoryIndex['clinical'] ?? 0],
    source: 'scientific',
    triggers: ['pyhealth', 'comprehensive', 'healthcare', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'treatment-plans',
    name: 'treatment-plans',
    description: '"Generate concise (3-4 page), focused medical treatment plans in LaTeX/PDF format for all clinical specialties. Supports general medical treatment, rehabilitation therapy, mental health care, chronic ',
    category: categories[categoryIndex['clinical'] ?? 0],
    source: 'scientific',
    triggers: ['treatment', 'plans', 'generate', 'concise', 'page'],
    priority: 5,
    content: ''
  },
  {
    id: 'dask',
    name: 'dask',
    description: '"Parallel/distributed computing. Scale pandas/NumPy beyond memory, parallel DataFrames/Arrays, multi-file processing, task graphs, for larger-than-RAM datasets and parallel workflows."',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['dask', 'parallel', 'distributed', 'computing'],
    priority: 5,
    content: ''
  },
  {
    id: 'datacommons-client',
    name: 'datacommons-client',
    description: 'Work with Data Commons, a platform providing programmatic access to public statistical data from global sources. Use this skill when working with demographic data, economic indicators, health statisti',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['datacommons', 'client', 'work', 'data', 'commons'],
    priority: 5,
    content: ''
  },
  {
    id: 'exploratory-data-analysis',
    name: 'exploratory-data-analysis',
    description: 'Perform comprehensive exploratory data analysis on scientific data files across 200+ file formats. This skill should be used when analyzing any scientific data file to understand its structure, conten',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['exploratory', 'data', 'analysis', 'perform', 'comprehensive'],
    priority: 5,
    content: ''
  },
  {
    id: 'flowio',
    name: 'flowio',
    description: '"Parse FCS (Flow Cytometry Standard) files v2.0-3.1. Extract events as NumPy arrays, read metadata/channels, convert to CSV/DataFrame, for flow cytometry data preprocessing."',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['flowio', 'parse', 'flow', 'cytometry'],
    priority: 5,
    content: ''
  },
  {
    id: 'matplotlib',
    name: 'matplotlib',
    description: '"Foundational plotting library. Create line plots, scatter, bar, histograms, heatmaps, 3D, subplots, export PNG/PDF/SVG, for scientific visualization and publication figures."',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['matplotlib', 'foundational', 'plotting', 'library'],
    priority: 5,
    content: ''
  },
  {
    id: 'mermaidjs-v11',
    name: 'mermaidjs-v11',
    description: 'Create diagrams and visualizations using Mermaid.js v11 syntax. Use when generating flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, Gantt charts, user journeys, timelines, ',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'claudekit',
    triggers: ['mermaidjs', 'v11', 'create', 'diagrams', 'visualizations'],
    priority: 5,
    content: ''
  },
  {
    id: 'networkx',
    name: 'networkx',
    description: 'Comprehensive toolkit for creating, analyzing, and visualizing complex networks and graphs in Python. Use when working with network/graph data structures, analyzing relationships between entities, com',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['networkx', 'comprehensive', 'toolkit', 'creating'],
    priority: 5,
    content: ''
  },
  {
    id: 'plotly',
    name: 'plotly',
    description: 'Interactive scientific and statistical data visualization library for Python. Use when creating charts, plots, or visualizations including scatter plots, line charts, bar charts, heatmaps, 3D plots, g',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['plotly', 'interactive', 'scientific', 'statistical'],
    priority: 5,
    content: ''
  },
  {
    id: 'polars',
    name: 'polars',
    description: '"Fast DataFrame library (Apache Arrow). Select, filter, group_by, joins, lazy evaluation, CSV/Parquet I/O, expression API, for high-performance data analysis workflows."',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['polars', 'fast', 'dataframe', 'library'],
    priority: 5,
    content: ''
  },
  {
    id: 'scientific-visualization',
    name: 'scientific-visualization',
    description: '"Create publication figures with matplotlib/seaborn/plotly. Multi-panel layouts, error bars, significance markers, colorblind-safe, export PDF/EPS/TIFF, for journal-ready scientific plots."',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['scientific', 'visualization', 'create', 'publication', 'figures'],
    priority: 5,
    content: ''
  },
  {
    id: 'seaborn',
    name: 'seaborn',
    description: '"Statistical visualization. Scatter, box, violin, heatmaps, pair plots, regression, correlation matrices, KDE, faceted plots, for exploratory analysis and publication figures."',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['seaborn', 'statistical', 'visualization', 'scatter'],
    priority: 5,
    content: ''
  },
  {
    id: 'statistical-analysis',
    name: 'statistical-analysis',
    description: '"Statistical analysis toolkit. Hypothesis tests (t-test, ANOVA, chi-square), regression, correlation, Bayesian stats, power analysis, assumption checks, APA reporting, for academic research."',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['statistical', 'analysis', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'statsmodels',
    name: 'statsmodels',
    description: '"Statistical modeling toolkit. OLS, GLM, logistic, ARIMA, time series, hypothesis tests, diagnostics, AIC/BIC, for rigorous statistical inference and econometric analysis."',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['statsmodels', 'statistical', 'modeling', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'vaex',
    name: 'vaex',
    description: 'Use this skill for processing and analyzing large tabular datasets (billions of rows) that exceed available RAM. Vaex excels at out-of-core DataFrame operations, lazy evaluation, fast aggregations, ef',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['vaex', 'skill', 'processing', 'analyzing'],
    priority: 5,
    content: ''
  },
  {
    id: 'zarr-python',
    name: 'zarr-python',
    description: '"Chunked N-D arrays for cloud storage. Compressed arrays, parallel I/O, S3/GCS integration, NumPy/Dask/Xarray compatible, for large-scale scientific computing pipelines."',
    category: categories[categoryIndex['data-viz'] ?? 0],
    source: 'scientific',
    triggers: ['zarr', 'python', 'chunked', 'arrays', 'cloud'],
    priority: 5,
    content: ''
  },
  {
    id: 'devops',
    name: 'devops',
    description: 'Deploy and manage cloud infrastructure on Cloudflare (Workers, R2, D1, KV, Pages, Durable Objects, Browser Rendering), Docker containers, and Google Cloud Platform (Compute Engine, GKE, Cloud Run, App',
    category: categories[categoryIndex['devops'] ?? 0],
    source: 'claudekit',
    triggers: ['devops', 'deploy', 'manage', 'cloud'],
    priority: 5,
    content: ''
  },
  {
    id: 'docker',
    name: 'docker',
    description: '|',
    category: categories[categoryIndex['devops'] ?? 0],
    source: 'community',
    triggers: ['docker'],
    priority: 5,
    content: ''
  },
  {
    id: 'doc-coauthoring',
    name: 'doc-coauthoring',
    description: 'Guide users through a structured workflow for co-authoring documentation. Use when user wants to write documentation, proposals, technical specs, decision docs, or similar structured content. This wor',
    category: categories[categoryIndex['document'] ?? 0],
    source: 'anthropic',
    triggers: ['doc', 'coauthoring', 'guide', 'users', 'through'],
    priority: 5,
    content: ''
  },
  {
    id: 'document-skills',
    name: 'document-skills',
    description: 'Claude Code 技能',
    category: categories[categoryIndex['document'] ?? 0],
    source: 'claudekit',
    triggers: ['document', 'skills', 'claude', 'code'],
    priority: 5,
    content: ''
  },
  {
    id: 'docx',
    name: 'docx',
    description: '"Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. When Claude needs to work with professional documents ',
    category: categories[categoryIndex['document'] ?? 0],
    source: 'anthropic',
    triggers: ['docx', 'comprehensive', 'document', 'creation'],
    priority: 5,
    content: ''
  },
  {
    id: 'pdf',
    name: 'pdf',
    description: 'Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms. When Claude needs to fill in a PDF form or programmatically p',
    category: categories[categoryIndex['document'] ?? 0],
    source: 'anthropic',
    triggers: ['pdf', 'comprehensive', 'manipulation', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'pptx',
    name: 'pptx',
    description: '"Presentation creation, editing, and analysis. When Claude needs to work with presentations (.pptx files) for: (1) Creating new presentations, (2) Modifying or editing content, (3) Working with layout',
    category: categories[categoryIndex['document'] ?? 0],
    source: 'anthropic',
    triggers: ['pptx', 'presentation', 'creation', 'editing'],
    priority: 5,
    content: ''
  },
  {
    id: 'xlsx',
    name: 'xlsx',
    description: '"Comprehensive spreadsheet creation, editing, and analysis with support for formulas, formatting, data analysis, and visualization. When Claude needs to work with spreadsheets (.xlsx, .xlsm, .csv, .ts',
    category: categories[categoryIndex['document'] ?? 0],
    source: 'anthropic',
    triggers: ['xlsx', 'comprehensive', 'spreadsheet', 'creation'],
    priority: 5,
    content: ''
  },
  {
    id: 'aesthetic',
    name: 'aesthetic',
    description: 'Create aesthetically beautiful interfaces following proven design principles. Use when building UI/UX, analyzing designs from inspiration sites, generating design images with ai-multimodal, implementi',
    category: categories[categoryIndex['frontend'] ?? 0],
    source: 'claudekit',
    triggers: ['aesthetic', 'create', 'aesthetically', 'beautiful'],
    priority: 5,
    content: ''
  },
  {
    id: 'artifacts-builder',
    name: 'artifacts-builder',
    description: 'Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state manag',
    category: categories[categoryIndex['frontend'] ?? 0],
    source: 'community',
    triggers: ['artifacts', 'builder', 'suite', 'tools', 'creating'],
    priority: 5,
    content: ''
  },
  {
    id: 'canvas-design',
    name: 'canvas-design',
    description: 'Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create ori',
    category: categories[categoryIndex['frontend'] ?? 0],
    source: 'anthropic',
    triggers: ['canvas', 'design', 'create', 'beautiful', 'visual'],
    priority: 5,
    content: ''
  },
  {
    id: 'frontend-design',
    name: 'frontend-design',
    description: 'Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples inclu',
    category: categories[categoryIndex['frontend'] ?? 0],
    source: 'anthropic',
    triggers: ['frontend', 'design', 'create', 'distinctive', 'production'],
    priority: 5,
    content: ''
  },
  {
    id: 'frontend-development',
    name: 'frontend-dev-guidelines',
    description: 'Frontend development guidelines for React/TypeScript applications. Modern patterns including Suspense, lazy loading, useSuspenseQuery, file organization with features directory, MUI v7 styling, TanSta',
    category: categories[categoryIndex['frontend'] ?? 0],
    source: 'claudekit',
    triggers: ['frontend', 'development', 'guidelines'],
    priority: 5,
    content: ''
  },
  {
    id: 'modern-frontend-design',
    name: 'modern-frontend-design',
    description: 'Comprehensive frontend design system for creating distinctive, production-grade interfaces that avoid generic AI aesthetics. Use when users request web components, pages, applications, or any frontend',
    category: categories[categoryIndex['frontend'] ?? 0],
    source: 'anthropic',
    triggers: ['modern', 'frontend', 'design', 'comprehensive'],
    priority: 5,
    content: ''
  },
  {
    id: 'react-components',
    name: 'react-components',
    description: '|',
    category: categories[categoryIndex['frontend'] ?? 0],
    source: 'community',
    triggers: ['react', 'components'],
    priority: 5,
    content: ''
  },
  {
    id: 'theme-factory',
    name: 'theme-factory',
    description: 'Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can apply to any artifact t',
    category: categories[categoryIndex['frontend'] ?? 0],
    source: 'anthropic',
    triggers: ['theme', 'factory', 'toolkit', 'styling', 'artifacts'],
    priority: 5,
    content: ''
  },
  {
    id: 'ui-styling',
    name: 'ui-styling',
    description: 'Create beautiful, accessible user interfaces with shadcn/ui components (built on Radix UI + Tailwind), Tailwind CSS utility-first styling, and canvas-based visual designs. Use when building user inter',
    category: categories[categoryIndex['frontend'] ?? 0],
    source: 'claudekit',
    triggers: ['styling', 'create', 'beautiful', 'accessible'],
    priority: 5,
    content: ''
  },
  {
    id: 'web-artifacts-builder',
    name: 'web-artifacts-builder',
    description: 'Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state manag',
    category: categories[categoryIndex['frontend'] ?? 0],
    source: 'anthropic',
    triggers: ['web', 'artifacts', 'builder', 'suite', 'tools', 'creating'],
    priority: 5,
    content: ''
  },
  {
    id: 'web-frameworks',
    name: 'web-frameworks',
    description: 'Build modern full-stack web applications with Next.js (App Router, Server Components, RSC, PPR, SSR, SSG, ISR), Turborepo (monorepo management, task pipelines, remote caching, parallel execution), and',
    category: categories[categoryIndex['frontend'] ?? 0],
    source: 'claudekit',
    triggers: ['web', 'frameworks', 'build', 'modern', 'full'],
    priority: 5,
    content: ''
  },
  {
    id: 'json-canvas',
    name: 'json-canvas',
    description: 'Create and edit JSON Canvas files (.canvas) with nodes, edges, groups, and connections. Use when working with .canvas files, creating visual canvases, mind maps, flowcharts, or when the user mentions ',
    category: categories[categoryIndex['knowledge'] ?? 0],
    source: 'obsidian',
    triggers: ['json', 'canvas', 'create', 'edit'],
    priority: 5,
    content: ''
  },
  {
    id: 'obsidian-bases',
    name: 'obsidian-bases',
    description: 'Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. Use when working with .base files, creating database-like views of notes, or when the user mentions Bases, ta',
    category: categories[categoryIndex['knowledge'] ?? 0],
    source: 'obsidian',
    triggers: ['obsidian', 'bases', 'create', 'edit'],
    priority: 5,
    content: ''
  },
  {
    id: 'obsidian-markdown',
    name: 'obsidian-markdown',
    description: 'Create and edit Obsidian Flavored Markdown with wikilinks, embeds, callouts, properties, and other Obsidian-specific syntax. Use when working with .md files in Obsidian, or when the user mentions wiki',
    category: categories[categoryIndex['knowledge'] ?? 0],
    source: 'obsidian',
    triggers: ['obsidian', 'markdown', 'create', 'edit'],
    priority: 5,
    content: ''
  },
  {
    id: 'benchling-integration',
    name: 'benchling-integration',
    description: '"Benchling R&D platform integration. Access registry (DNA, proteins), inventory, ELN entries, workflows via API, build Benchling Apps, query Data Warehouse, for lab data management automation."',
    category: categories[categoryIndex['lab-automation'] ?? 0],
    source: 'scientific',
    triggers: ['benchling', 'integration', 'platform'],
    priority: 5,
    content: ''
  },
  {
    id: 'dnanexus-integration',
    name: 'dnanexus-integration',
    description: '"DNAnexus cloud genomics platform. Build apps/applets, manage data (upload/download), dxpy Python SDK, run workflows, FASTQ/BAM/VCF, for genomics pipeline development and execution."',
    category: categories[categoryIndex['lab-automation'] ?? 0],
    source: 'scientific',
    triggers: ['dnanexus', 'integration', 'cloud', 'genomics'],
    priority: 5,
    content: ''
  },
  {
    id: 'iso-13485-certification',
    name: 'iso-13485-certification',
    description: 'Comprehensive toolkit for preparing ISO 13485 certification documentation for medical device Quality Management Systems. Use when users need help with ISO 13485 QMS documentation, including (1) conduc',
    category: categories[categoryIndex['lab-automation'] ?? 0],
    source: 'scientific',
    triggers: ['iso', '13485', 'certification', 'comprehensive', 'toolkit', 'preparing'],
    priority: 5,
    content: ''
  },
  {
    id: 'labarchive-integration',
    name: 'labarchive-integration',
    description: '"Electronic lab notebook API integration. Access notebooks, manage entries/attachments, backup notebooks, integrate with Protocols.io/Jupyter/REDCap, for programmatic ELN workflows."',
    category: categories[categoryIndex['lab-automation'] ?? 0],
    source: 'scientific',
    triggers: ['labarchive', 'integration', 'electronic', 'notebook'],
    priority: 5,
    content: ''
  },
  {
    id: 'latchbio-integration',
    name: 'latchbio-integration',
    description: '"Latch platform for bioinformatics workflows. Build pipelines with Latch SDK, @workflow/@task decorators, deploy serverless workflows, LatchFile/LatchDir, Nextflow/Snakemake integration."',
    category: categories[categoryIndex['lab-automation'] ?? 0],
    source: 'scientific',
    triggers: ['latchbio', 'integration', 'latch', 'platform', 'bioinformatics'],
    priority: 5,
    content: ''
  },
  {
    id: 'modal',
    name: 'modal',
    description: 'Run Python code in the cloud with serverless containers, GPUs, and autoscaling. Use when deploying ML models, running batch processing jobs, scheduling compute-intensive tasks, or serving APIs that re',
    category: categories[categoryIndex['lab-automation'] ?? 0],
    source: 'scientific',
    triggers: ['modal', 'python', 'code', 'cloud'],
    priority: 5,
    content: ''
  },
  {
    id: 'omero-integration',
    name: 'omero-integration',
    description: '"Microscopy data management platform. Access images via Python, retrieve datasets, analyze pixels, manage ROIs/annotations, batch processing, for high-content screening and microscopy workflows."',
    category: categories[categoryIndex['lab-automation'] ?? 0],
    source: 'scientific',
    triggers: ['omero', 'integration', 'microscopy', 'data', 'management'],
    priority: 5,
    content: ''
  },
  {
    id: 'opentrons-integration',
    name: 'opentrons-integration',
    description: '"Lab automation platform for Flex/OT-2 robots. Write Protocol API v2 protocols, liquid handling, hardware modules (heater-shaker, thermocycler), labware management, for automated pipetting workflows."',
    category: categories[categoryIndex['lab-automation'] ?? 0],
    source: 'scientific',
    triggers: ['opentrons', 'integration', 'automation', 'platform', 'flex'],
    priority: 5,
    content: ''
  },
  {
    id: 'protocolsio-integration',
    name: 'protocolsio-integration',
    description: 'Integration with protocols.io API for managing scientific protocols. This skill should be used when working with protocols.io to search, create, update, or publish protocols; manage protocol steps and',
    category: categories[categoryIndex['lab-automation'] ?? 0],
    source: 'scientific',
    triggers: ['protocolsio', 'integration', 'protocols', 'managing'],
    priority: 5,
    content: ''
  },
  {
    id: 'pylabrobot',
    name: 'pylabrobot',
    description: 'Laboratory automation toolkit for controlling liquid handlers, plate readers, pumps, heater shakers, incubators, centrifuges, and analytical equipment. Use this skill when automating laboratory workfl',
    category: categories[categoryIndex['lab-automation'] ?? 0],
    source: 'scientific',
    triggers: ['pylabrobot', 'laboratory', 'automation', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'algorithmic-art',
    name: 'algorithmic-art',
    description: 'Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Use this when users request creating art using code, generative art, algorithmic art, flow fields, or',
    category: categories[categoryIndex['media'] ?? 0],
    source: 'anthropic',
    triggers: ['algorithmic', 'art', 'creating', 'using'],
    priority: 5,
    content: ''
  },
  {
    id: 'generate-image',
    name: 'generate-image',
    description: 'Generate or edit images using AI models (FLUX, Gemini). Use for general-purpose image generation including photos, illustrations, artwork, visual assets, concept art, and any image that isn\'t a techni',
    category: categories[categoryIndex['media'] ?? 0],
    source: 'scientific',
    triggers: ['generate', 'image', 'edit', 'images'],
    priority: 5,
    content: ''
  },
  {
    id: 'image-enhancer',
    name: 'image-enhancer',
    description: 'Improves the quality of images, especially screenshots, by enhancing resolution, sharpness, and clarity. Perfect for preparing images for presentations, documentation, or social media posts.',
    category: categories[categoryIndex['media'] ?? 0],
    source: 'community',
    triggers: ['image', 'enhancer', 'improves', 'quality', 'images'],
    priority: 5,
    content: ''
  },
  {
    id: 'media-processing',
    name: 'media-processing',
    description: 'Process multimedia files with FFmpeg (video/audio encoding, conversion, streaming, filtering, hardware acceleration) and ImageMagick (image manipulation, format conversion, batch processing, effects, ',
    category: categories[categoryIndex['media'] ?? 0],
    source: 'claudekit',
    triggers: ['media', 'processing', 'process', 'multimedia', 'files'],
    priority: 5,
    content: ''
  },
  {
    id: 'slack-gif-creator',
    name: 'slack-gif-creator',
    description: 'Knowledge and utilities for creating animated GIFs optimized for Slack. Provides constraints, validation tools, and animation concepts. Use when users request animated GIFs for Slack like "make me a G',
    category: categories[categoryIndex['media'] ?? 0],
    source: 'anthropic',
    triggers: ['slack', 'gif', 'creator', 'knowledge', 'utilities', 'creating'],
    priority: 5,
    content: ''
  },
  {
    id: 'video-downloader',
    name: 'youtube-downloader',
    description: 'Download YouTube videos with customizable quality and format options. Use this skill when the user asks to download, save, or grab YouTube videos. Supports various quality settings (best, 1080p, 720p,',
    category: categories[categoryIndex['media'] ?? 0],
    source: 'community',
    triggers: ['video', 'downloader', 'download', 'youtube', 'videos'],
    priority: 5,
    content: ''
  },
  {
    id: 'aeon',
    name: 'aeon',
    description: 'This skill should be used for time series machine learning tasks including classification, regression, clustering, forecasting, anomaly detection, segmentation, and similarity search. Use when working',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['aeon', 'skill', 'should', 'used'],
    priority: 5,
    content: ''
  },
  {
    id: 'biomni',
    name: 'biomni',
    description: 'Autonomous biomedical AI agent framework for executing complex research tasks across genomics, drug discovery, molecular biology, and clinical analysis. Use this skill when conducting multi-step biome',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['biomni', 'autonomous', 'biomedical', 'agent'],
    priority: 5,
    content: ''
  },
  {
    id: 'denario',
    name: 'denario',
    description: 'Multiagent AI system for scientific research assistance that automates research workflows from data analysis to publication. This skill should be used when generating research ideas from datasets, dev',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['denario', 'multiagent', 'system', 'scientific'],
    priority: 5,
    content: ''
  },
  {
    id: 'hypogenic',
    name: 'hypogenic',
    description: 'Automated hypothesis generation and testing using large language models. Use this skill when generating scientific hypotheses from datasets, combining literature insights with empirical data, testing ',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['hypogenic', 'automated', 'hypothesis', 'generation'],
    priority: 5,
    content: ''
  },
  {
    id: 'pufferlib',
    name: 'pufferlib',
    description: 'This skill should be used when working with reinforcement learning tasks including high-performance RL training, custom environment development, vectorized parallel simulation, multi-agent systems, or',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['pufferlib', 'skill', 'should', 'used'],
    priority: 5,
    content: ''
  },
  {
    id: 'pymc',
    name: 'pymc-bayesian-modeling',
    description: '"Bayesian modeling with PyMC. Build hierarchical models, MCMC (NUTS), variational inference, LOO/WAIC comparison, posterior checks, for probabilistic programming and inference."',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['pymc', 'bayesian', 'modeling'],
    priority: 5,
    content: ''
  },
  {
    id: 'pymoo',
    name: 'pymoo',
    description: '"Multi-objective optimization framework. NSGA-II, NSGA-III, MOEA/D, Pareto fronts, constraint handling, benchmarks (ZDT, DTLZ), for engineering design and optimization problems."',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['pymoo', 'multi', 'objective', 'optimization'],
    priority: 5,
    content: ''
  },
  {
    id: 'pytorch-lightning',
    name: 'pytorch-lightning',
    description: '"Deep learning framework (PyTorch Lightning). Organize PyTorch code into LightningModules, configure Trainers for multi-GPU/TPU, implement data pipelines, callbacks, logging (W&B, TensorBoard), distri',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['pytorch', 'lightning', 'deep', 'learning', 'framework'],
    priority: 5,
    content: ''
  },
  {
    id: 'scikit-learn',
    name: 'scikit-learn',
    description: 'Machine learning in Python with scikit-learn. Use when working with supervised learning (classification, regression), unsupervised learning (clustering, dimensionality reduction), model evaluation, hy',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['scikit', 'learn', 'machine', 'learning', 'python'],
    priority: 5,
    content: ''
  },
  {
    id: 'scikit-survival',
    name: 'scikit-survival',
    description: 'Comprehensive toolkit for survival analysis and time-to-event modeling in Python using scikit-survival. Use this skill when working with censored survival data, performing time-to-event analysis, fitt',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['scikit', 'survival', 'comprehensive', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'shap',
    name: 'shap',
    description: 'Model interpretability and explainability using SHAP (SHapley Additive exPlanations). Use this skill when explaining machine learning model predictions, computing feature importance, generating SHAP p',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['shap', 'model', 'interpretability', 'explainability'],
    priority: 5,
    content: ''
  },
  {
    id: 'stable-baselines3',
    name: 'stable-baselines3',
    description: 'Use this skill for reinforcement learning tasks including training RL agents (PPO, SAC, DQN, TD3, DDPG, A2C, etc.), creating custom Gym environments, implementing callbacks for monitoring and control,',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['stable', 'baselines3', 'skill', 'reinforcement', 'learning'],
    priority: 5,
    content: ''
  },
  {
    id: 'torch_geometric',
    name: 'torch-geometric',
    description: '"Graph Neural Networks (PyG). Node/graph classification, link prediction, GCN, GAT, GraphSAGE, heterogeneous graphs, molecular property prediction, for geometric deep learning."',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['torch_geometric', 'graph', 'neural', 'networks'],
    priority: 5,
    content: ''
  },
  {
    id: 'transformers',
    name: 'transformers',
    description: 'This skill should be used when working with pre-trained transformer models for natural language processing, computer vision, audio, or multimodal tasks. Use for text generation, classification, questi',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['transformers', 'skill', 'should', 'used'],
    priority: 5,
    content: ''
  },
  {
    id: 'umap-learn',
    name: 'umap-learn',
    description: '"UMAP dimensionality reduction. Fast nonlinear manifold learning for 2D/3D visualization, clustering preprocessing (HDBSCAN), supervised/parametric UMAP, for high-dimensional data."',
    category: categories[categoryIndex['ml-ai'] ?? 0],
    source: 'scientific',
    triggers: ['umap', 'learn', 'dimensionality', 'reduction'],
    priority: 5,
    content: ''
  },
  {
    id: 'astropy',
    name: 'astropy',
    description: 'Comprehensive Python library for astronomy and astrophysics. This skill should be used when working with astronomical data including celestial coordinates, physical units, FITS files, cosmological cal',
    category: categories[categoryIndex['physics-materials'] ?? 0],
    source: 'scientific',
    triggers: ['astropy', 'comprehensive', 'python', 'library'],
    priority: 5,
    content: ''
  },
  {
    id: 'cirq',
    name: 'cirq',
    description: 'Quantum computing framework for building, simulating, optimizing, and executing quantum circuits. Use this skill when working with quantum algorithms, quantum circuit design, quantum simulation (noise',
    category: categories[categoryIndex['physics-materials'] ?? 0],
    source: 'scientific',
    triggers: ['cirq', 'quantum', 'computing', 'framework'],
    priority: 5,
    content: ''
  },
  {
    id: 'fluidsim',
    name: 'fluidsim',
    description: 'Framework for computational fluid dynamics simulations using Python. Use when running fluid dynamics simulations including Navier-Stokes equations (2D/3D), shallow water equations, stratified flows, o',
    category: categories[categoryIndex['physics-materials'] ?? 0],
    source: 'scientific',
    triggers: ['fluidsim', 'framework', 'computational', 'fluid'],
    priority: 5,
    content: ''
  },
  {
    id: 'geopandas',
    name: 'geopandas',
    description: 'Python library for working with geospatial vector data including shapefiles, GeoJSON, and GeoPackage files. Use when working with geographic data for spatial analysis, geometric operations, coordinate',
    category: categories[categoryIndex['physics-materials'] ?? 0],
    source: 'scientific',
    triggers: ['geopandas', 'python', 'library', 'working'],
    priority: 5,
    content: ''
  },
  {
    id: 'pennylane',
    name: 'pennylane',
    description: 'Cross-platform Python library for quantum computing, quantum machine learning, and quantum chemistry. Enables building and training quantum circuits with automatic differentiation, seamless integratio',
    category: categories[categoryIndex['physics-materials'] ?? 0],
    source: 'scientific',
    triggers: ['pennylane', 'cross', 'platform', 'python'],
    priority: 5,
    content: ''
  },
  {
    id: 'pymatgen',
    name: 'pymatgen',
    description: '"Materials science toolkit. Crystal structures (CIF, POSCAR), phase diagrams, band structure, DOS, Materials Project integration, format conversion, for computational materials science."',
    category: categories[categoryIndex['physics-materials'] ?? 0],
    source: 'scientific',
    triggers: ['pymatgen', 'materials', 'science', 'toolkit'],
    priority: 5,
    content: ''
  },
  {
    id: 'qiskit',
    name: 'qiskit',
    description: 'Comprehensive quantum computing toolkit for building, optimizing, and executing quantum circuits. Use when working with quantum algorithms, simulations, or quantum hardware including (1) Building quan',
    category: categories[categoryIndex['physics-materials'] ?? 0],
    source: 'scientific',
    triggers: ['qiskit', 'comprehensive', 'quantum', 'computing'],
    priority: 5,
    content: ''
  },
  {
    id: 'qutip',
    name: 'qutip',
    description: '"Quantum mechanics simulations and analysis using QuTiP (Quantum Toolbox in Python). Use when working with quantum systems including: (1) quantum states (kets, bras, density matrices), (2) quantum ope',
    category: categories[categoryIndex['physics-materials'] ?? 0],
    source: 'scientific',
    triggers: ['qutip', 'quantum', 'mechanics', 'simulations'],
    priority: 5,
    content: ''
  },
  {
    id: 'simpy',
    name: 'simpy',
    description: 'Process-based discrete-event simulation framework in Python. Use this skill when building simulations of systems with processes, queues, resources, and time-based events such as manufacturing systems,',
    category: categories[categoryIndex['physics-materials'] ?? 0],
    source: 'scientific',
    triggers: ['simpy', 'process', 'based', 'discrete'],
    priority: 5,
    content: ''
  },
  {
    id: 'sympy',
    name: 'sympy',
    description: 'Use this skill when working with symbolic mathematics in Python. This skill should be used for symbolic computation tasks including solving equations algebraically, performing calculus operations (der',
    category: categories[categoryIndex['physics-materials'] ?? 0],
    source: 'scientific',
    triggers: ['sympy', 'skill', 'working', 'symbolic'],
    priority: 5,
    content: ''
  },
  {
    id: 'citation-management',
    name: 'citation-management',
    description: 'Comprehensive citation management for academic research. Search Google Scholar and PubMed for papers, extract accurate metadata, validate citations, and generate properly formatted BibTeX entries. Thi',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['citation', 'management', 'comprehensive'],
    priority: 5,
    content: ''
  },
  {
    id: 'get-available-resources',
    name: 'get-available-resources',
    description: 'This skill should be used at the start of any computationally intensive scientific task to detect and report available system resources (CPU cores, GPUs, memory, disk space). It creates a JSON file wi',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['get', 'available', 'resources', 'skill', 'should', 'used'],
    priority: 5,
    content: ''
  },
  {
    id: 'hypothesis-generation',
    name: 'hypothesis-generation',
    description: '"Generate testable hypotheses. Formulate from observations, design experiments, explore competing explanations, develop predictions, propose mechanisms, for scientific inquiry across domains."',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['hypothesis', 'generation', 'generate', 'testable', 'hypotheses'],
    priority: 5,
    content: ''
  },
  {
    id: 'latex-posters',
    name: 'latex-posters',
    description: '"Create professional research posters in LaTeX using beamerposter, tikzposter, or baposter. Support for conference presentations, academic posters, and scientific communication. Includes layout design',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['latex', 'posters', 'create', 'professional', 'research'],
    priority: 5,
    content: ''
  },
  {
    id: 'literature-review',
    name: 'literature-review',
    description: 'Conduct comprehensive, systematic literature reviews using multiple academic databases (PubMed, arXiv, bioRxiv, Semantic Scholar, etc.). This skill should be used when conducting systematic literature',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['literature', 'review', 'conduct', 'comprehensive', 'systematic'],
    priority: 5,
    content: ''
  },
  {
    id: 'market-research-reports',
    name: 'market-research-reports',
    description: '"Generate comprehensive market research reports (50+ pages) in the style of top consulting firms (McKinsey, BCG, Gartner). Features professional LaTeX formatting, extensive visual generation with scie',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['market', 'research', 'reports', 'generate', 'comprehensive'],
    priority: 5,
    content: ''
  },
  {
    id: 'markitdown',
    name: 'markitdown',
    description: '"Convert files and office documents to Markdown. Supports PDF, DOCX, PPTX, XLSX, images (with OCR), audio (with transcription), HTML, CSV, JSON, XML, ZIP, YouTube URLs, EPubs and more."',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['markitdown', 'convert', 'files', 'office'],
    priority: 5,
    content: ''
  },
  {
    id: 'paper-2-web',
    name: 'paper-2-web',
    description: 'This skill should be used when converting academic papers into promotional and presentation formats including interactive websites (Paper2Web), presentation videos (Paper2Video), and conference poster',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['paper', 'web', 'skill', 'should', 'used'],
    priority: 5,
    content: ''
  },
  {
    id: 'peer-review',
    name: 'peer-review',
    description: '"Systematic peer review toolkit. Evaluate methodology, statistics, design, reproducibility, ethics, figure integrity, reporting standards, for manuscript and grant review across disciplines."',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['peer', 'review', 'systematic'],
    priority: 5,
    content: ''
  },
  {
    id: 'perplexity-search',
    name: 'perplexity-search',
    description: 'Perform AI-powered web searches with real-time information using Perplexity models via LiteLLM and OpenRouter. This skill should be used when conducting web searches for current information, finding r',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['perplexity', 'search', 'perform', 'powered', 'searches'],
    priority: 5,
    content: ''
  },
  {
    id: 'pptx-posters',
    name: 'latex-posters',
    description: '"Create professional research posters in LaTeX using beamerposter, tikzposter, or baposter. Support for conference presentations, academic posters, and scientific communication. Includes layout design',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['pptx', 'posters', 'create', 'professional', 'research'],
    priority: 5,
    content: ''
  },
  {
    id: 'research-grants',
    name: 'research-grants',
    description: '"Write competitive research proposals for NSF, NIH, DOE, and DARPA. Agency-specific formatting, review criteria, budget preparation, broader impacts, significance statements, innovation narratives, an',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['research', 'grants', 'write', 'competitive'],
    priority: 5,
    content: ''
  },
  {
    id: 'research-lookup',
    name: 'research-lookup',
    description: '"Look up current research information using Perplexity\'s Sonar Pro Search or Sonar Reasoning Pro models through OpenRouter. Automatically selects the best model based on query complexity. Search acade',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['research', 'lookup', 'look', 'current'],
    priority: 5,
    content: ''
  },
  {
    id: 'scholar-evaluation',
    name: 'scholar-evaluation',
    description: 'Systematically evaluate scholarly work using the ScholarEval framework, providing structured assessment across research quality dimensions including problem formulation, methodology, analysis, and wri',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['scholar', 'evaluation', 'systematically', 'evaluate', 'scholarly'],
    priority: 5,
    content: ''
  },
  {
    id: 'scientific-brainstorming',
    name: 'scientific-brainstorming',
    description: '"Research ideation partner. Generate hypotheses, explore interdisciplinary connections, challenge assumptions, develop methodologies, identify research gaps, for creative scientific problem-solving."',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['scientific', 'brainstorming', 'research', 'ideation', 'partner'],
    priority: 5,
    content: ''
  },
  {
    id: 'scientific-critical-thinking',
    name: 'scientific-critical-thinking',
    description: '"Evaluate research rigor. Assess methodology, experimental design, statistical validity, biases, confounding, evidence quality (GRADE, Cochrane ROB), for critical analysis of scientific claims."',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['scientific', 'critical', 'thinking', 'evaluate', 'research', 'rigor'],
    priority: 5,
    content: ''
  },
  {
    id: 'scientific-schematics',
    name: 'scientific-schematics',
    description: '"Create publication-quality scientific diagrams using Nano Banana Pro AI with smart iterative refinement. Uses Gemini 3 Pro for quality review. Only regenerates if quality is below threshold for your ',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['scientific', 'schematics', 'create', 'publication', 'quality'],
    priority: 5,
    content: ''
  },
  {
    id: 'scientific-slides',
    name: 'scientific-slides',
    description: '"Build slide decks and presentations for research talks. Use this for making PowerPoint slides, conference presentations, seminar talks, research presentations, thesis defense slides, or any scientifi',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['scientific', 'slides', 'build', 'slide', 'decks'],
    priority: 5,
    content: ''
  },
  {
    id: 'scientific-writing',
    name: 'scientific-writing',
    description: '"Core skill for the deep research and writing tool. Write scientific manuscripts in full paragraphs (never bullet points). Use two-stage process: (1) create section outlines with key points using rese',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['scientific', 'writing', 'core', 'skill', 'deep'],
    priority: 5,
    content: ''
  },
  {
    id: 'venue-templates',
    name: 'venue-templates',
    description: 'Access comprehensive LaTeX templates, formatting requirements, and submission guidelines for major scientific publication venues (Nature, Science, PLOS, IEEE, ACM), academic conferences (NeurIPS, ICML',
    category: categories[categoryIndex['sci-communication'] ?? 0],
    source: 'scientific',
    triggers: ['venue', 'templates', 'access', 'comprehensive', 'latex'],
    priority: 5,
    content: ''
  },
  {
    id: 'alphafold-database',
    name: 'alphafold-database',
    description: '"Access AlphaFold\'s 200M+ AI-predicted protein structures. Retrieve structures by UniProt ID, download PDB/mmCIF files, analyze confidence metrics (pLDDT, PAE), for drug discovery and structural biolo',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['alphafold', 'database', 'access', 'predicted'],
    priority: 5,
    content: ''
  },
  {
    id: 'biorxiv-database',
    name: 'biorxiv-database',
    description: 'Efficient database search tool for bioRxiv preprint server. Use this skill when searching for life sciences preprints by keywords, authors, date ranges, or categories, retrieving paper metadata, downl',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['biorxiv', 'database', 'efficient', 'search'],
    priority: 5,
    content: ''
  },
  {
    id: 'brenda-database',
    name: 'brenda-database',
    description: '"Access BRENDA enzyme database via SOAP API. Retrieve kinetic parameters (Km, kcat), reaction equations, organism data, and substrate-specific enzyme information for biochemical research and metabolic',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['brenda', 'database', 'access', 'enzyme'],
    priority: 5,
    content: ''
  },
  {
    id: 'chembl-database',
    name: 'chembl-database',
    description: '"Query ChEMBL\'s bioactive molecules and drug discovery data. Search compounds by structure/properties, retrieve bioactivity data (IC50, Ki), find inhibitors, perform SAR studies, for medicinal chemist',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['chembl', 'database', 'query', 'bioactive'],
    priority: 5,
    content: ''
  },
  {
    id: 'clinicaltrials-database',
    name: 'clinicaltrials-database',
    description: '"Query ClinicalTrials.gov via API v2. Search trials by condition, drug, location, status, or phase. Retrieve trial details by NCT ID, export data, for clinical research and patient matching."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['clinicaltrials', 'database', 'query', 'search'],
    priority: 5,
    content: ''
  },
  {
    id: 'clinpgx-database',
    name: 'clinpgx-database',
    description: '"Access ClinPGx pharmacogenomics data (successor to PharmGKB). Query gene-drug interactions, CPIC guidelines, allele functions, for precision medicine and genotype-guided dosing decisions."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['clinpgx', 'database', 'access', 'pharmacogenomics'],
    priority: 5,
    content: ''
  },
  {
    id: 'clinvar-database',
    name: 'clinvar-database',
    description: '"Query NCBI ClinVar for variant clinical significance. Search by gene/position, interpret pathogenicity classifications, access via E-utilities API or FTP, annotate VCFs, for genomic medicine."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['clinvar', 'database', 'query', 'ncbi'],
    priority: 5,
    content: ''
  },
  {
    id: 'cosmic-database',
    name: 'cosmic-database',
    description: '"Access COSMIC cancer mutation database. Query somatic mutations, Cancer Gene Census, mutational signatures, gene fusions, for cancer research and precision oncology. Requires authentication."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['cosmic', 'database', 'access', 'cancer'],
    priority: 5,
    content: ''
  },
  {
    id: 'drugbank-database',
    name: 'drugbank-database',
    description: 'Access and analyze comprehensive drug information from the DrugBank database including drug properties, interactions, targets, pathways, chemical structures, and pharmacology data. This skill should b',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['drugbank', 'database', 'access', 'analyze', 'comprehensive'],
    priority: 5,
    content: ''
  },
  {
    id: 'ena-database',
    name: 'ena-database',
    description: '"Access European Nucleotide Archive via API/FTP. Retrieve DNA/RNA sequences, raw reads (FASTQ), genome assemblies by accession, for genomics and bioinformatics pipelines. Supports multiple formats."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['ena', 'database', 'access', 'european', 'nucleotide'],
    priority: 5,
    content: ''
  },
  {
    id: 'ensembl-database',
    name: 'ensembl-database',
    description: '"Query Ensembl genome database REST API for 250+ species. Gene lookups, sequence retrieval, variant analysis, comparative genomics, orthologs, VEP predictions, for genomic research."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['ensembl', 'database', 'query', 'genome'],
    priority: 5,
    content: ''
  },
  {
    id: 'fda-database',
    name: 'fda-database',
    description: '"Query openFDA API for drugs, devices, adverse events, recalls, regulatory submissions (510k, PMA), substance identification (UNII), for FDA regulatory data analysis and safety research."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['fda', 'database', 'query', 'openfda', 'drugs'],
    priority: 5,
    content: ''
  },
  {
    id: 'gene-database',
    name: 'gene-database',
    description: '"Query NCBI Gene via E-utilities/Datasets API. Search by symbol/ID, retrieve gene info (RefSeqs, GO, locations, phenotypes), batch lookups, for gene annotation and functional analysis."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['gene', 'database', 'query', 'ncbi'],
    priority: 5,
    content: ''
  },
  {
    id: 'geo-database',
    name: 'geo-database',
    description: '"Access NCBI GEO for gene expression/genomics data. Search/download microarray and RNA-seq datasets (GSE, GSM, GPL), retrieve SOFT/Matrix files, for transcriptomics and expression analysis."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['geo', 'database', 'access', 'ncbi', 'gene'],
    priority: 5,
    content: ''
  },
  {
    id: 'gwas-database',
    name: 'gwas-database',
    description: '"Query NHGRI-EBI GWAS Catalog for SNP-trait associations. Search variants by rs ID, disease/trait, gene, retrieve p-values and summary statistics, for genetic epidemiology and polygenic risk scores."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['gwas', 'database', 'query', 'nhgri'],
    priority: 5,
    content: ''
  },
  {
    id: 'hmdb-database',
    name: 'hmdb-database',
    description: '"Access Human Metabolome Database (220K+ metabolites). Search by name/ID/structure, retrieve chemical properties, biomarker data, NMR/MS spectra, pathways, for metabolomics and identification."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['hmdb', 'database', 'access', 'human', 'metabolome'],
    priority: 5,
    content: ''
  },
  {
    id: 'kegg-database',
    name: 'kegg-database',
    description: '"Direct REST API access to KEGG (academic use only). Pathway analysis, gene-pathway mapping, metabolic pathways, drug interactions, ID conversion. For Python workflows with multiple databases, prefer ',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['kegg', 'database', 'direct', 'rest', 'access'],
    priority: 5,
    content: ''
  },
  {
    id: 'metabolomics-workbench-database',
    name: 'metabolomics-workbench-database',
    description: '"Access NIH Metabolomics Workbench via REST API (4,200+ studies). Query metabolites, RefMet nomenclature, MS/NMR data, m/z searches, study metadata, for metabolomics and biomarker discovery."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['metabolomics', 'workbench', 'database', 'access'],
    priority: 5,
    content: ''
  },
  {
    id: 'ncbi-gene-database',
    name: 'gene-database',
    description: '"Query NCBI Gene via E-utilities/Datasets API. Search by symbol/ID, retrieve gene info (RefSeqs, GO, locations, phenotypes), batch lookups, for gene annotation and functional analysis."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['ncbi', 'gene', 'database', 'query'],
    priority: 5,
    content: ''
  },
  {
    id: 'openalex-database',
    name: 'openalex-database',
    description: 'Query and analyze scholarly literature using the OpenAlex database. This skill should be used when searching for academic papers, analyzing research trends, finding works by authors or institutions, t',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['openalex', 'database', 'query', 'analyze', 'scholarly'],
    priority: 5,
    content: ''
  },
  {
    id: 'opentargets-database',
    name: 'opentargets-database',
    description: '"Query Open Targets Platform for target-disease associations, drug target discovery, tractability/safety data, genetics/omics evidence, known drugs, for therapeutic target identification."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['opentargets', 'database', 'query', 'open', 'targets'],
    priority: 5,
    content: ''
  },
  {
    id: 'pdb-database',
    name: 'pdb-database',
    description: '"Access RCSB PDB for 3D protein/nucleic acid structures. Search by text/sequence/structure, download coordinates (PDB/mmCIF), retrieve metadata, for structural biology and drug discovery."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['pdb', 'database', 'access', 'rcsb', 'protein'],
    priority: 5,
    content: ''
  },
  {
    id: 'pubchem-database',
    name: 'pubchem-database',
    description: '"Query PubChem via PUG-REST API/PubChemPy (110M+ compounds). Search by name/CID/SMILES, retrieve properties, similarity/substructure searches, bioactivity, for cheminformatics."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['pubchem', 'database', 'query', 'rest'],
    priority: 5,
    content: ''
  },
  {
    id: 'pubmed-database',
    name: 'pubmed-database',
    description: '"Direct REST API access to PubMed. Advanced Boolean/MeSH queries, E-utilities API, batch processing, citation management. For Python workflows, prefer biopython (Bio.Entrez). Use this for direct HTTP/',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['pubmed', 'database', 'direct', 'rest', 'access'],
    priority: 5,
    content: ''
  },
  {
    id: 'reactome-database',
    name: 'reactome-database',
    description: '"Query Reactome REST API for pathway analysis, enrichment, gene-pathway mapping, disease pathways, molecular interactions, expression analysis, for systems biology studies."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['reactome', 'database', 'query', 'rest'],
    priority: 5,
    content: ''
  },
  {
    id: 'string-database',
    name: 'string-database',
    description: '"Query STRING API for protein-protein interactions (59M proteins, 20B interactions). Network analysis, GO/KEGG enrichment, interaction discovery, 5000+ species, for systems biology."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['string', 'database', 'query', 'protein'],
    priority: 5,
    content: ''
  },
  {
    id: 'uniprot-database',
    name: 'uniprot-database',
    description: '"Direct REST API access to UniProt. Protein searches, FASTA retrieval, ID mapping, Swiss-Prot/TrEMBL. For Python workflows with multiple databases, prefer bioservices (unified interface to 40+ service',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['uniprot', 'database', 'direct', 'rest', 'access'],
    priority: 5,
    content: ''
  },
  {
    id: 'uspto-database',
    name: 'uspto-database',
    description: '"Access USPTO APIs for patent/trademark searches, examination history (PEDS), assignments, citations, office actions, TSDR, for IP analysis and prior art searches."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['uspto', 'database', 'access', 'apis'],
    priority: 5,
    content: ''
  },
  {
    id: 'zinc-database',
    name: 'zinc-database',
    description: '"Access ZINC (230M+ purchasable compounds). Search by ZINC ID/SMILES, similarity searches, 3D-ready structures for docking, analog discovery, for virtual screening and drug discovery."',
    category: categories[categoryIndex['sci-databases'] ?? 0],
    source: 'scientific',
    triggers: ['zinc', 'database', 'access', 'purchasable'],
    priority: 5,
    content: ''
  },
  {
    id: 'browser-automation',
    name: 'browser-automation',
    description: '|',
    category: categories[categoryIndex['testing'] ?? 0],
    source: 'community',
    triggers: ['browser', 'automation'],
    priority: 5,
    content: ''
  },
  {
    id: 'code-review',
    name: 'code-review',
    description: 'Use when receiving code review feedback (especially if unclear or technically questionable), when completing tasks or major features requiring review before proceeding, or before making any completion',
    category: categories[categoryIndex['testing'] ?? 0],
    source: 'claudekit',
    triggers: ['code', 'review', 'receiving'],
    priority: 5,
    content: ''
  },
  {
    id: 'defense-in-depth',
    name: 'Defense-in-Depth Validation',
    description: 'Validate at every layer data passes through to make bugs impossible',
    category: categories[categoryIndex['testing'] ?? 0],
    source: 'claudekit',
    triggers: ['defense', 'depth', 'validate', 'every', 'layer'],
    priority: 5,
    content: ''
  },
  {
    id: 'receiving-code-review',
    name: 'receiving-code-review',
    description: 'Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable - requires technical rigor and verification, not performative',
    category: categories[categoryIndex['testing'] ?? 0],
    source: 'superpowers',
    triggers: ['receiving', 'code', 'review'],
    priority: 5,
    content: ''
  },
  {
    id: 'requesting-code-review',
    name: 'requesting-code-review',
    description: 'Use when completing tasks, implementing major features, or before merging to verify work meets requirements',
    category: categories[categoryIndex['testing'] ?? 0],
    source: 'superpowers',
    triggers: ['requesting', 'code', 'review', 'completing', 'tasks', 'implementing'],
    priority: 5,
    content: ''
  },
  {
    id: 'root-cause-tracing',
    name: 'Root Cause Tracing',
    description: 'Systematically trace bugs backward through call stack to find original trigger',
    category: categories[categoryIndex['testing'] ?? 0],
    source: 'claudekit',
    triggers: ['root', 'cause', 'tracing', 'systematically', 'trace', 'bugs'],
    priority: 5,
    content: ''
  },
  {
    id: 'systematic-debugging',
    name: 'Systematic Debugging',
    description: 'Four-phase debugging framework that ensures root cause investigation before attempting fixes. Never jump to solutions.',
    category: categories[categoryIndex['testing'] ?? 0],
    source: 'claudekit',
    triggers: ['systematic', 'debugging', 'four', 'phase'],
    priority: 5,
    content: ''
  },
  {
    id: 'test-driven-development',
    name: 'test-driven-development',
    description: 'Use when implementing any feature or bugfix, before writing implementation code',
    category: categories[categoryIndex['testing'] ?? 0],
    source: 'superpowers',
    triggers: ['test', 'driven', 'development', 'implementing', 'feature', 'bugfix'],
    priority: 5,
    content: ''
  },
  {
    id: 'verification-before-completion',
    name: 'Verification Before Completion',
    description: 'Run verification commands and confirm output before claiming success',
    category: categories[categoryIndex['testing'] ?? 0],
    source: 'claudekit',
    triggers: ['verification', 'before', 'completion', 'commands', 'confirm'],
    priority: 5,
    content: ''
  },
  {
    id: 'webapp-testing',
    name: 'webapp-testing',
    description: 'Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser l',
    category: categories[categoryIndex['testing'] ?? 0],
    source: 'anthropic',
    triggers: ['webapp', 'testing', 'toolkit', 'interacting'],
    priority: 5,
    content: ''
  },
  {
    id: 'brainstorming',
    name: 'brainstorming',
    description: '"You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'superpowers',
    triggers: ['brainstorming', 'must', 'before', 'creative'],
    priority: 5,
    content: ''
  },
  {
    id: 'citation-validator',
    name: 'citation-validator',
    description: '验证研究报告中所有声明的引用准确性、来源质量和格式规范性。确保每个事实性声明都有可验证的来源，并提供来源质量评级。当最终确定研究报告、审查他人研究、发布或分享研究之前使用此技能。',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'deep-research',
    triggers: ['citation', 'validator'],
    priority: 5,
    content: ''
  },
  {
    id: 'collision-zone-thinking',
    name: 'Collision-Zone Thinking',
    description: 'Force unrelated concepts together to discover emergent properties - "What if we treated X like Y?"',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'claudekit',
    triggers: ['collision', 'zone', 'thinking', 'force', 'unrelated', 'concepts'],
    priority: 5,
    content: ''
  },
  {
    id: 'context-engineering',
    name: 'context-engineering',
    description: '>-',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'claudekit',
    triggers: ['context', 'engineering'],
    priority: 5,
    content: ''
  },
  {
    id: 'executing-plans',
    name: 'executing-plans',
    description: 'Use when you have a written implementation plan to execute in a separate session with review checkpoints',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'superpowers',
    triggers: ['executing', 'plans', 'written', 'implementation', 'plan'],
    priority: 5,
    content: ''
  },
  {
    id: 'got-controller',
    name: 'got-controller',
    description: 'Graph of Thoughts (GoT) Controller - 管理研究图状态，执行图操作（Generate, Aggregate, Refine, Score），优化研究路径质量。当研究主题复杂或多方面、需要策略性探索（深度 vs 广度）、高质量研究时使用此技能。',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'deep-research',
    triggers: ['got', 'controller', 'graph', 'thoughts'],
    priority: 5,
    content: ''
  },
  {
    id: 'inversion-exercise',
    name: 'Inversion Exercise',
    description: 'Flip core assumptions to reveal hidden constraints and alternative approaches - "what if the opposite were true?"',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'claudekit',
    triggers: ['inversion', 'exercise', 'flip', 'core', 'assumptions'],
    priority: 5,
    content: ''
  },
  {
    id: 'meta-pattern-recognition',
    name: 'Meta-Pattern Recognition',
    description: 'Spot patterns appearing in 3+ domains to find universal principles',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'claudekit',
    triggers: ['meta', 'pattern', 'recognition', 'spot', 'patterns', 'appearing'],
    priority: 5,
    content: ''
  },
  {
    id: 'planning-with-files',
    name: 'planning-with-files',
    description: 'Transforms workflow to use Manus-style persistent markdown files for planning, progress tracking, and knowledge storage. Use when starting complex tasks, multi-step projects, research tasks, or when t',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'planning',
    triggers: ['planning', 'with', 'files', 'transforms', 'workflow', 'manus'],
    priority: 5,
    content: ''
  },
  {
    id: 'question-refiner',
    name: 'question-refiner',
    description: '将原始研究问题细化为结构化的深度研究任务。通过提问澄清需求，生成符合 OpenAI/Google Deep Research 标准的结构化提示词。当用户提出研究问题、需要帮助定义研究范围、或想要生成结构化研究提示词时使用此技能。',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'deep-research',
    triggers: ['question', 'refiner', 'openai', 'google', 'deep'],
    priority: 5,
    content: ''
  },
  {
    id: 'research-executor',
    name: 'research-executor',
    description: '执行完整的 7 阶段深度研究流程。接收结构化研究任务，自动部署多个并行研究智能体，生成带完整引用的综合研究报告。当用户有结构化的研究提示词时使用此技能。',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'deep-research',
    triggers: ['research', 'executor'],
    priority: 5,
    content: ''
  },
  {
    id: 'scale-game',
    name: 'Scale Game',
    description: 'Test at extremes (1000x bigger/smaller, instant/year-long) to expose fundamental truths hidden at normal scales',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'claudekit',
    triggers: ['scale', 'game', 'test', 'extremes', 'bigger'],
    priority: 5,
    content: ''
  },
  {
    id: 'sequential-thinking',
    name: 'sequential-thinking',
    description: 'Use when complex problems require systematic step-by-step reasoning with ability to revise thoughts, branch into alternative approaches, or dynamically adjust scope. Ideal for multi-stage analysis, de',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'claudekit',
    triggers: ['sequential', 'thinking', 'complex', 'problems', 'require'],
    priority: 5,
    content: ''
  },
  {
    id: 'simplification-cascades',
    name: 'Simplification Cascades',
    description: 'Find one insight that eliminates multiple components - "if this is true, we don\'t need X, Y, or Z"',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'claudekit',
    triggers: ['simplification', 'cascades', 'find', 'insight', 'eliminates'],
    priority: 5,
    content: ''
  },
  {
    id: 'synthesizer',
    name: 'synthesizer',
    description: '将多个研究智能体的发现综合成连贯、结构化的研究报告。解决矛盾、提取共识、创建统一叙述。当多个研究智能体完成研究、需要将发现组合成统一报告、发现之间存在矛盾时使用此技能。',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'deep-research',
    triggers: ['synthesizer'],
    priority: 5,
    content: ''
  },
  {
    id: 'when-stuck',
    name: 'When Stuck - Problem-Solving Dispatch',
    description: 'Dispatch to the right problem-solving technique based on how you\'re stuck',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'claudekit',
    triggers: ['when', 'stuck', 'dispatch', 'right', 'problem'],
    priority: 5,
    content: ''
  },
  {
    id: 'writing-plans',
    name: 'writing-plans',
    description: 'Use when you have a spec or requirements for a multi-step task, before touching code',
    category: categories[categoryIndex['thinking'] ?? 0],
    source: 'superpowers',
    triggers: ['writing', 'plans', 'spec', 'requirements', 'multi'],
    priority: 5,
    content: ''
  },
  {
    id: 'ai-multimodal',
    name: 'ai-multimodal',
    description: 'Process and generate multimedia content using Google Gemini API. Capabilities include analyze audio files (transcription with timestamps, summarization, speech understanding, music/sound analysis up t',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'claudekit',
    triggers: ['multimodal', 'process', 'generate', 'multimedia'],
    priority: 5,
    content: ''
  },
  {
    id: 'better-auth',
    name: 'better-auth',
    description: 'Implement authentication and authorization with Better Auth - a framework-agnostic TypeScript authentication framework. Features include email/password authentication with verification, OAuth provider',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'claudekit',
    triggers: ['better', 'auth', 'implement', 'authentication', 'authorization'],
    priority: 5,
    content: ''
  },
  {
    id: 'brand-guidelines',
    name: 'brand-guidelines',
    description: 'Applies Anthropic\'s official brand colors and typography to any sort of artifact that may benefit from having Anthropic\'s look-and-feel. Use it when brand colors or style guidelines, visual formatting',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'anthropic',
    triggers: ['brand', 'guidelines', 'applies', 'anthropic', 'official'],
    priority: 5,
    content: ''
  },
  {
    id: 'changelog-generator',
    name: 'changelog-generator',
    description: 'Automatically creates user-facing changelogs from git commits by analyzing commit history, categorizing changes, and transforming technical commits into clear, customer-friendly release notes. Turns h',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'community',
    triggers: ['changelog', 'generator', 'automatically', 'creates', 'user'],
    priority: 5,
    content: ''
  },
  {
    id: 'chrome-devtools',
    name: 'chrome-devtools',
    description: 'Browser automation, debugging, and performance analysis using Puppeteer CLI scripts. Use for automating browsers, taking screenshots, analyzing performance, monitoring network traffic, web scraping, f',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'claudekit',
    triggers: ['chrome', 'devtools', 'browser', 'automation', 'debugging'],
    priority: 5,
    content: ''
  },
  {
    id: 'claude-code',
    name: 'claude-code',
    description: 'Claude Code 技能',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'claudekit',
    triggers: ['claude', 'code'],
    priority: 5,
    content: ''
  },
  {
    id: 'competitive-ads-extractor',
    name: 'competitive-ads-extractor',
    description: 'Extracts and analyzes competitors\' ads from ad libraries (Facebook, LinkedIn, etc.) to understand what messaging, problems, and creative approaches are working. Helps inspire and improve your own ad c',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'community',
    triggers: ['competitive', 'ads', 'extractor', 'extracts', 'analyzes', 'competitors'],
    priority: 5,
    content: ''
  },
  {
    id: 'content-research-writer',
    name: 'content-research-writer',
    description: 'Assists in writing high-quality content by conducting research, adding citations, improving hooks, iterating on outlines, and providing real-time feedback on each section. Transforms your writing proc',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'community',
    triggers: ['content', 'research', 'writer', 'assists', 'writing', 'high'],
    priority: 5,
    content: ''
  },
  {
    id: 'developer-growth-analysis',
    name: 'developer-growth-analysis',
    description: 'Analyzes your recent Claude Code chat history to identify coding patterns, development gaps, and areas for improvement, curates relevant learning resources from HackerNews, and automatically sends a p',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'community',
    triggers: ['developer', 'growth', 'analysis', 'analyzes', 'recent', 'claude'],
    priority: 5,
    content: ''
  },
  {
    id: 'dispatching-parallel-agents',
    name: 'dispatching-parallel-agents',
    description: 'Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'superpowers',
    triggers: ['dispatching', 'parallel', 'agents', 'facing', 'independent', 'tasks'],
    priority: 5,
    content: ''
  },
  {
    id: 'docs-seeker',
    name: 'docs-seeker',
    description: '"Searching internet for technical documentation using llms.txt standard, GitHub repositories via Repomix, and parallel exploration. Use when user needs: (1) Latest documentation for libraries/framewor',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'claudekit',
    triggers: ['docs', 'seeker', 'searching', 'internet', 'technical'],
    priority: 5,
    content: ''
  },
  {
    id: 'domain-name-brainstormer',
    name: 'domain-name-brainstormer',
    description: 'Generates creative domain name ideas for your project and checks availability across multiple TLDs (.com, .io, .dev, .ai, etc.). Saves hours of brainstorming and manual checking.',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'community',
    triggers: ['domain', 'name', 'brainstormer', 'generates', 'creative'],
    priority: 5,
    content: ''
  },
  {
    id: 'file-organizer',
    name: 'file-organizer',
    description: 'Intelligently organizes your files and folders across your computer by understanding context, finding duplicates, suggesting better structures, and automating cleanup tasks. Reduces cognitive load and',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'community',
    triggers: ['file', 'organizer', 'intelligently', 'organizes', 'files'],
    priority: 5,
    content: ''
  },
  {
    id: 'finishing-a-development-branch',
    name: 'finishing-a-development-branch',
    description: 'Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'superpowers',
    triggers: ['finishing', 'development', 'branch', 'implementation', 'complete', 'tests'],
    priority: 5,
    content: ''
  },
  {
    id: 'google-adk-python',
    name: 'google-adk-python',
    description: 'Claude Code 技能',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'claudekit',
    triggers: ['google', 'adk', 'python', 'claude', 'code'],
    priority: 5,
    content: ''
  },
  {
    id: 'internal-comms',
    name: 'internal-comms',
    description: 'A set of resources to help me write all kinds of internal communications, using the formats that my company likes to use. Claude should use this skill whenever asked to write some sort of internal com',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'anthropic',
    triggers: ['internal', 'comms', 'resources', 'help', 'write'],
    priority: 5,
    content: ''
  },
  {
    id: 'invoice-organizer',
    name: 'invoice-organizer',
    description: 'Automatically organizes invoices and receipts for tax preparation by reading messy files, extracting key information, renaming them consistently, and sorting them into logical folders. Turns hours of ',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'community',
    triggers: ['invoice', 'organizer', 'automatically', 'organizes', 'invoices'],
    priority: 5,
    content: ''
  },
  {
    id: 'lead-research-assistant',
    name: 'lead-research-assistant',
    description: 'Identifies high-quality leads for your product or service by analyzing your business, searching for target companies, and providing actionable contact strategies. Perfect for sales, business developme',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'community',
    triggers: ['lead', 'research', 'assistant', 'identifies', 'high', 'quality'],
    priority: 5,
    content: ''
  },
  {
    id: 'mcp-builder',
    name: 'mcp-builder',
    description: 'Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate externa',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'anthropic',
    triggers: ['mcp', 'builder', 'guide', 'creating', 'high'],
    priority: 5,
    content: ''
  },
  {
    id: 'mcp-management',
    name: 'mcp-management',
    description: 'Manage Model Context Protocol (MCP) servers - discover, analyze, and execute tools/prompts/resources from configured MCP servers. Use when working with MCP integrations, need to discover available MCP',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'claudekit',
    triggers: ['mcp', 'management', 'manage', 'model', 'context'],
    priority: 5,
    content: ''
  },
  {
    id: 'meeting-insights-analyzer',
    name: 'meeting-insights-analyzer',
    description: 'Analyzes meeting transcripts and recordings to uncover behavioral patterns, communication insights, and actionable feedback. Identifies when you avoid conflict, use filler words, dominate conversation',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'community',
    triggers: ['meeting', 'insights', 'analyzer', 'analyzes', 'transcripts'],
    priority: 5,
    content: ''
  },
  {
    id: 'raffle-winner-picker',
    name: 'raffle-winner-picker',
    description: 'Picks random winners from lists, spreadsheets, or Google Sheets for giveaways, raffles, and contests. Ensures fair, unbiased selection with transparency.',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'community',
    triggers: ['raffle', 'winner', 'picker', 'picks', 'random', 'winners'],
    priority: 5,
    content: ''
  },
  {
    id: 'repomix',
    name: 'repomix',
    description: 'Package entire code repositories into single AI-friendly files using Repomix. Capabilities include pack codebases with customizable include/exclude patterns, generate multiple output formats (XML, Mar',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'claudekit',
    triggers: ['repomix', 'package', 'entire', 'code'],
    priority: 5,
    content: ''
  },
  {
    id: 'shopify',
    name: 'shopify',
    description: 'Build Shopify applications, extensions, and themes using GraphQL/REST APIs, Shopify CLI, Polaris UI components, and Liquid templating. Capabilities include app development with OAuth authentication, c',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'claudekit',
    triggers: ['shopify', 'build', 'applications'],
    priority: 5,
    content: ''
  },
  {
    id: 'skill-creator',
    name: 'skill-creator',
    description: 'Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude\'s capabilities with specialized knowledge, workfl',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'anthropic',
    triggers: ['skill', 'creator', 'guide', 'creating', 'effective'],
    priority: 5,
    content: ''
  },
  {
    id: 'skill-share',
    name: 'skill-share',
    description: 'A skill that creates new Claude skills and automatically shares them on Slack using Rube for seamless team collaboration and skill discovery.',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'community',
    triggers: ['skill', 'share', 'creates', 'claude'],
    priority: 5,
    content: ''
  },
  {
    id: 'subagent-driven-development',
    name: 'subagent-driven-development',
    description: 'Use when executing implementation plans with independent tasks in the current session',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'superpowers',
    triggers: ['subagent', 'driven', 'development', 'executing', 'implementation', 'plans'],
    priority: 5,
    content: ''
  },
  {
    id: 'using-git-worktrees',
    name: 'using-git-worktrees',
    description: 'Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated git worktrees with smart directory selection and safety verificat',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'superpowers',
    triggers: ['using', 'git', 'worktrees', 'starting', 'feature', 'work'],
    priority: 5,
    content: ''
  },
  {
    id: 'using-superpowers',
    name: 'using-superpowers',
    description: 'Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'superpowers',
    triggers: ['using', 'superpowers', 'starting', 'conversation', 'establishes'],
    priority: 5,
    content: ''
  },
    {
    id: 'writing-skills',
    name: 'writing-skills',
    description: 'Use when creating new skills, editing existing skills, or verifying skills work before deployment',
    category: categories[categoryIndex['tools'] ?? 0],
    source: 'superpowers',
    triggers: ['writing', 'skills', 'creating', 'editing'],
    priority: 5,
    content: ''
  },
  // skill-from-masters skills
  {
    id: 'skill-from-masters',
    name: 'Skill From Masters',
    description: 'Help users create high-quality skills by discovering and incorporating proven methodologies from domain experts. Use BEFORE skill-creator when creating new skills - it enhances skill-creator by first identifying expert frameworks and best practices.',
    category: categories[categoryIndex['skill-dev'] ?? 0],
    source: 'skill-from-masters',
    triggers: ['create', 'skill', 'skill-from-masters', 'help me create a skill', 'I want to make a skill', 'methodology', 'expert', 'framework', 'best practices'],
    priority: 8,
    content: ''
  },
];
