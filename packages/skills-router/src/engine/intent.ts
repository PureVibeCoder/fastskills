import { IntentType, IntentPattern } from '../types.js';

/**
 * Domain-specific context keywords that override generic intent detection
 * When these keywords appear, the intent should be mapped to RESEARCH instead of DESIGN
 */
const CHEMISTRY_DOMAIN_KEYWORDS = [
  /\b(molecule|molecular|compound|drug|ligand|protein|rdkit|smiles|chemical|chemistry|cheminformatics)\b/i,
  /分子|化合物|药物|配体|蛋白质|化学/i,
  /\b(gene|genomic|dna|rna|sequencing|biological|bioinformatics)\b/i,
  /基因|基因组|序列|生物信息/i,
  /\b(quantum|physics|atom|particle)\b/i,
  /量子|物理|原子|粒子/i,
];

const DEVOPS_DOMAIN_KEYWORDS = [
  /\b(kubernetes|k8s|docker|container|helm|terraform|ansible|cicd|pipeline)\b/i,
  /ci\/cd/i,
  /容器|编排|运维|集群/i,
];

const BACKEND_DOMAIN_KEYWORDS = [
  /\b(graphql|mongodb|postgresql|redis|backend)\b/i,
  /服务端|后端/i,
];

const BROWSER_AUTOMATION_KEYWORDS = [
  /\b(playwright|puppeteer|selenium|scraping|crawler|crawl)\b/i,
  /爬虫|抓取/i,
];

/**
 * Check if query contains domain-specific keywords
 */
function detectDomainContext(query: string): 'chemistry' | 'devops' | 'backend' | 'browser' | null {
  for (const pattern of CHEMISTRY_DOMAIN_KEYWORDS) {
    if (pattern.test(query)) return 'chemistry';
  }
  for (const pattern of DEVOPS_DOMAIN_KEYWORDS) {
    if (pattern.test(query)) return 'devops';
  }
  for (const pattern of BACKEND_DOMAIN_KEYWORDS) {
    if (pattern.test(query)) return 'backend';
  }
  for (const pattern of BROWSER_AUTOMATION_KEYWORDS) {
    if (pattern.test(query)) return 'browser';
  }
  return null;
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: IntentType.CREATE,
    patterns: [
      /创建|新建|开发|实现|写一个|做一个|生成/i,
      /build|create|implement|make|generate|develop|write/i,
    ],
    weight: 1.0
  },
  {
    intent: IntentType.RESEARCH,
    patterns: [
      /研究|调研|分析|查找|搜索|了解/i,
      /research|investigate|analyze|search|find|explore|study/i,
    ],
    weight: 1.0
  },
  {
    intent: IntentType.DEBUG,
    patterns: [
      /调试|修复|解决|排查|错误|bug|问题/i,
      /debug|fix|solve|troubleshoot|error|bug|issue|problem/i,
    ],
    weight: 1.0
  },
  {
    intent: IntentType.REFACTOR,
    patterns: [
      /重构|优化|改进|整理|清理/i,
      /refactor|optimize|improve|clean|restructure/i,
    ],
    weight: 1.0
  },
  {
    intent: IntentType.DOCUMENT,
    patterns: [
      /文档|注释|说明|readme|文档化/i,
      /document|readme|comment|explain|describe|doc/i,
    ],
    weight: 1.0
  },
  {
    intent: IntentType.TEST,
    patterns: [
      /测试|单元测试|集成测试|e2e|覆盖率|pytest|jest|vitest/i,
      /test|testing|unit\s*test|e2e|coverage|spec/i,
    ],
    weight: 1.0
  },
  {
    intent: IntentType.DEPLOY,
    patterns: [
      /部署|发布|上线|docker|ci\/cd|kubernetes/i,
      /deploy|release|publish|docker|ci\/cd|kubernetes|k8s/i,
    ],
    weight: 1.0
  },
  {
    intent: IntentType.ANALYZE,
    patterns: [
      /分析|统计|数据|可视化|图表/i,
      /analyze|statistics|data|visualize|chart|plot|graph/i,
    ],
    weight: 1.0
  },
  {
    intent: IntentType.CONVERT,
    patterns: [
      /转换|迁移|导入|导出|格式/i,
      /convert|migrate|import|export|format|transform/i,
    ],
    weight: 1.0
  },
  {
    intent: IntentType.DESIGN,
    patterns: [
      /设计|ui|ux|界面|样式|布局/i,
      /\bdesign\b|ui|ux|interface|style|layout|frontend/i,
    ],
    weight: 1.0
  },
  {
    intent: IntentType.OPTIMIZE,
    patterns: [
      /优化|性能|加速|缓存|压缩/i,
      /optimize|performance|speed|cache|compress|faster/i,
    ],
    weight: 1.0
  },
];

export function detectIntent(query: string): IntentType {
  // 先检测显式意图（避免域上下文覆盖用户明确的意图）
  let bestMatch = { intent: IntentType.UNKNOWN, score: 0 };

  for (const pattern of INTENT_PATTERNS) {
    for (const regex of pattern.patterns) {
      if (regex.test(query)) {
        const score = pattern.weight;
        if (score > bestMatch.score) {
          bestMatch = { intent: pattern.intent, score };
        }
      }
    }
  }

  const domainContext = detectDomainContext(query);

  // 只在意图未知或为 DESIGN 时，化学/生物域才覆盖为 RESEARCH
  // 保留用户显式的 debug/deploy/create 等意图
  if (domainContext === 'chemistry' &&
      (bestMatch.intent === IntentType.UNKNOWN || bestMatch.intent === IntentType.DESIGN)) {
    return IntentType.RESEARCH;
  }

  if (bestMatch.intent !== IntentType.UNKNOWN) {
    return bestMatch.intent;
  }

  // 其他域的默认意图
  if (domainContext === 'devops') {
    return IntentType.DEPLOY;
  }
  if (domainContext === 'browser') {
    return IntentType.CREATE;
  }

  return bestMatch.intent;
}

export function getIntentKeywords(intent: IntentType): string[] {
  const keywordMap: Record<IntentType, string[]> = {
    [IntentType.CREATE]: ['create', 'build', 'implement', 'generate', 'develop'],
    [IntentType.RESEARCH]: ['research', 'analyze', 'study', 'explore', 'investigate'],
    [IntentType.DEBUG]: ['debug', 'fix', 'troubleshoot', 'error', 'bug'],
    [IntentType.REFACTOR]: ['refactor', 'optimize', 'clean', 'improve', 'restructure'],
    [IntentType.DOCUMENT]: ['document', 'readme', 'explain', 'describe', 'comment'],
    [IntentType.TEST]: ['test', 'testing', 'coverage', 'spec', 'e2e'],
    [IntentType.DEPLOY]: ['deploy', 'release', 'publish', 'docker', 'kubernetes'],
    [IntentType.ANALYZE]: ['analyze', 'statistics', 'data', 'visualize', 'chart'],
    [IntentType.CONVERT]: ['convert', 'migrate', 'import', 'export', 'transform'],
    [IntentType.DESIGN]: ['design', 'ui', 'ux', 'interface', 'style'],
    [IntentType.OPTIMIZE]: ['optimize', 'performance', 'speed', 'cache', 'faster'],
    [IntentType.UNKNOWN]: [],
  };
  
  return keywordMap[intent] || [];
}
