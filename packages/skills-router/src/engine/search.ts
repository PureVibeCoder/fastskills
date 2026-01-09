import natural from 'natural';
import { SkillMeta, SearchResult, IntentType } from '../types.js';
import { detectIntent, getIntentKeywords } from './intent.js';

const CHINESE_TO_ENGLISH_SYNONYMS: Record<string, string[]> = {
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

const DOMAIN_ALIASES: Record<string, string[]> = {
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

function expandQueryWithSynonyms(query: string): string {
  let expandedTerms: string[] = query.split(/\s+/);
  
  for (const [chinese, english] of Object.entries(CHINESE_TO_ENGLISH_SYNONYMS)) {
    if (query.includes(chinese)) {
      expandedTerms.push(...english);
    }
  }
  
  // 使用单词边界匹配避免子串误匹配（如 "reaction" 不应匹配 "react"）
  for (const [alias, expansions] of Object.entries(DOMAIN_ALIASES)) {
    const wordBoundary = new RegExp(`\\b${alias}\\b`, 'i');
    if (wordBoundary.test(query)) {
      expandedTerms.push(...expansions);
    }
  }
  
  return [...new Set(expandedTerms)].join(' ');
}

const INTENT_CATEGORY_MAP: Record<IntentType, string[]> = {
  [IntentType.CREATE]: ['frontend', 'backend', 'tools', 'skill-dev'],
  [IntentType.RESEARCH]: ['scientific', 'bioinformatics', 'cheminformatics', 'sci-databases'],
  [IntentType.DEBUG]: ['testing', 'thinking', 'tools'],
  [IntentType.REFACTOR]: ['backend', 'frontend', 'thinking'],
  [IntentType.DOCUMENT]: ['document', 'sci-communication', 'knowledge'],
  [IntentType.TEST]: ['testing', 'tools'],
  [IntentType.DEPLOY]: ['devops', 'tools'],
  [IntentType.ANALYZE]: ['data-viz', 'ml-ai', 'scientific'],
  [IntentType.CONVERT]: ['document', 'tools', 'media'],
  [IntentType.DESIGN]: ['frontend', 'media', 'data-viz'],
  [IntentType.OPTIMIZE]: ['backend', 'devops', 'ml-ai'],
  [IntentType.UNKNOWN]: [],
};

export class SkillSearchEngine {
  private tfidf: natural.TfIdf;
  private skills: SkillMeta[];
  private initialized: boolean = false;

  constructor(skills: SkillMeta[] = []) {
    this.tfidf = new natural.TfIdf();
    this.skills = skills;
    
    if (skills.length > 0) {
      this.buildIndex();
    }
  }

  private buildIndex(): void {
    for (const skill of this.skills) {
      const document = [
        skill.name,
        skill.name,
        skill.description,
        skill.triggers.join(' '),
        skill.category,
        skill.fullDescription || ''
      ].join(' ');
      
      this.tfidf.addDocument(document);
    }
    this.initialized = true;
  }

  setSkills(skills: SkillMeta[]): void {
    this.skills = skills;
    this.tfidf = new natural.TfIdf();
    this.buildIndex();
  }

  search(query: string, limit: number = 5, options?: { category?: string }): SearchResult[] {
    if (!this.initialized || this.skills.length === 0) {
      return [];
    }

    const results: SearchResult[] = [];
    const intent = detectIntent(query);
    const intentKeywords = getIntentKeywords(intent);
    const expandedQuery = expandQueryWithSynonyms(query);
    const enhancedQuery = [...expandedQuery.split(/\s+/), ...intentKeywords].join(' ');
    
    this.tfidf.tfidfs(enhancedQuery, (index, score) => {
      if (score > 0 && index < this.skills.length) {
        const skill = this.skills[index];
        
        let adjustedScore = score;
        if (intent !== IntentType.UNKNOWN) {
          const intentCategories = INTENT_CATEGORY_MAP[intent] || [];
          if (intentCategories.includes(skill.category)) {
            adjustedScore *= 1.5;
          }
        }

        const queryLower = query.toLowerCase();
        const skillIdLower = skill.id.toLowerCase();
        const skillNameLower = skill.name.toLowerCase();

        // 只对长度 >= 4 的首词进行加权，且要求精确匹配或作为技能ID前缀
        // 避免 "api", "data" 等短词过度抬高大量技能分数
        const firstWord = queryLower.split(/\s+/)[0];
        if (queryLower.includes(skillIdLower) ||
            (firstWord.length >= 4 &&
             (skillIdLower === firstWord || skillIdLower.startsWith(firstWord + '-')))) {
          adjustedScore *= 3.0;
        }
        if (skill.triggers.some(t => queryLower.includes(t.toLowerCase()))) {
          adjustedScore *= 2.0;
        }
        
        results.push({
          skill,
          score: adjustedScore,
          reason: this.generateReason(query, skill, intent)
        });
      }
    });
    
    let filteredResults = results;
    if (options?.category) {
      filteredResults = results.filter(r => r.skill.category === options.category);
    }
    
    return filteredResults
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private generateReason(query: string, skill: SkillMeta, intent: IntentType): string {
    const queryTokens = new Set(query.toLowerCase().split(/\s+/));
    const matchedTriggers = skill.triggers.filter(t => 
      queryTokens.has(t.toLowerCase())
    );
    
    if (matchedTriggers.length > 0) {
      return `匹配关键词: ${matchedTriggers.slice(0, 3).join(', ')}`;
    }
    
    if (intent !== IntentType.UNKNOWN) {
      const intentCategories = INTENT_CATEGORY_MAP[intent] || [];
      if (intentCategories.includes(skill.category)) {
        return `意图匹配: ${intent} → ${skill.category}`;
      }
    }
    
    return `语义相关: ${skill.category}`;
  }

  getSkillById(id: string): SkillMeta | undefined {
    return this.skills.find(s => s.id === id);
  }

  getAllSkills(): SkillMeta[] {
    return this.skills;
  }

  getSkillCount(): number {
    return this.skills.length;
  }
}
