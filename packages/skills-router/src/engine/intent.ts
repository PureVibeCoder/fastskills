import { IntentType, IntentPattern } from '../types.js';

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
      /测试|单元测试|集成测试|e2e|覆盖率/i,
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
      /design|ui|ux|interface|style|layout|frontend/i,
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
