/**
 * Synonym expansion for Chinese-English bilingual search
 * and domain-specific alias expansion
 */

/**
 * Chinese to English synonym mappings
 * When a Chinese term is detected, expand with related English terms
 */
export const CHINESE_TO_ENGLISH_SYNONYMS: Record<string, string[]> = {
  '蛋白质': ['protein', 'alphafold', 'esm'],
  '结构': ['structure', 'structural', '3d'],
  '预测': ['prediction', 'predict', 'forecast'],
  '单细胞': ['single-cell', 'scRNA', 'scanpy'],
  '细胞': ['cell', 'cellular'],
  '基因': ['gene', 'genomic', 'genome'],
  '序列': ['sequence', 'sequencing', 'ngs'],
  '分子': ['molecule', 'molecular', 'compound'],
  '化学': ['chemistry', 'chemical', 'cheminformatics'],
  '药物': ['drug', 'pharmaceutical', 'medicine'],
  '设计': ['design'],
  '爬虫': ['crawler', 'scraping', 'spider', 'playwright', 'puppeteer'],
  '自动化': ['automation', 'automated', 'auto'],
  '浏览器': ['browser', 'chrome', 'web'],
  '网页': ['web', 'webpage', 'html'],
  '数据库': ['database', 'sql', 'mongodb', 'postgresql'],
  '机器学习': ['machine-learning', 'ml', 'deep-learning'],
  '深度学习': ['deep-learning', 'neural', 'pytorch', 'tensorflow'],
  '可视化': ['visualization', 'visualize', 'plot', 'chart'],
  '统计': ['statistics', 'statistical', 'stats'],
  '测试': ['test', 'testing', 'pytest', 'jest', 'vitest'],
  '部署': ['deploy', 'deployment', 'kubernetes', 'docker'],
  '容器': ['container', 'docker', 'kubernetes', 'k8s'],
  '前端': ['frontend', 'react', 'vue', 'ui'],
  '后端': ['backend', 'api', 'server'],
  '文档': ['document', 'documentation', 'docs'],
};

/**
 * Domain-specific alias mappings
 * When a domain term is detected, expand with related concepts
 */
export const DOMAIN_ALIASES: Record<string, string[]> = {
  'rdkit': ['chemistry', 'cheminformatics', 'molecule', 'smiles', 'drug-discovery'],
  'scanpy': ['single-cell', 'scRNA-seq', 'bioinformatics', 'cell-analysis'],
  'alphafold': ['protein', 'structure', 'prediction', 'bioinformatics'],
  'pytorch': ['deep-learning', 'machine-learning', 'neural-network', 'ml'],
  'tensorflow': ['deep-learning', 'machine-learning', 'neural-network', 'ml'],
  'playwright': ['browser', 'automation', 'testing', 'scraping', 'e2e'],
  'puppeteer': ['browser', 'automation', 'scraping', 'chrome'],
  'docker': ['container', 'devops', 'deployment', 'kubernetes'],
  'kubernetes': ['k8s', 'container', 'orchestration', 'devops'],
  'react': ['frontend', 'ui', 'component', 'jsx', 'tsx'],
  'vue': ['frontend', 'ui', 'component', 'spa'],
  'pytest': ['testing', 'python', 'unit-test', 'tdd'],
  'jest': ['testing', 'javascript', 'unit-test', 'tdd'],
  'opencv': ['computer-vision', 'image-processing', 'cv'],
  'pandas': ['data-analysis', 'dataframe', 'python', 'tabular'],
  'numpy': ['numerical', 'array', 'python', 'scientific'],
  'matplotlib': ['visualization', 'plotting', 'charts', 'python'],
  'plotly': ['visualization', 'interactive', 'charts', 'dashboard'],
  'git': ['version-control', 'vcs', 'github', 'repository'],
  'nlp': ['natural-language', 'text', 'language-processing', 'transformers'],
  'llm': ['large-language-model', 'gpt', 'claude', 'ai'],
};

/**
 * Expand a query with synonyms and domain aliases
 * @param query - The original query string
 * @returns Expanded query with additional terms
 */
export function expandQueryWithSynonyms(query: string): string {
  const expandedTerms: string[] = query.split(/\s+/);

  // Expand Chinese terms
  for (const [chinese, english] of Object.entries(CHINESE_TO_ENGLISH_SYNONYMS)) {
    if (query.includes(chinese)) {
      expandedTerms.push(...english);
    }
  }

  // Expand domain aliases using word boundary matching
  // to avoid substring false positives (e.g., "reaction" should not match "react")
  for (const [alias, expansions] of Object.entries(DOMAIN_ALIASES)) {
    const wordBoundary = new RegExp(`\\b${alias}\\b`, 'i');
    if (wordBoundary.test(query)) {
      expandedTerms.push(...expansions);
    }
  }

  // Deduplicate and join
  return [...new Set(expandedTerms)].join(' ');
}
