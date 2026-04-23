import type { Category } from './categories.js';

const categoryKeywords: Record<string, string[]> = {
  frontend: ['frontend', 'ui', 'ux', 'react', 'vue', 'css', 'html', 'tailwind', 'design', 'component', '界面', '前端'],
  backend: ['backend', 'api', 'server', 'database', 'sql', 'node', '后端', '服务端', '数据库'],
  testing: ['test', 'e2e', 'unit', 'testing', 'debug', 'review', '测试', '调试'],
  devops: ['deploy', 'ci/cd', 'docker', 'kubernetes', 'k8s', 'devops', '部署', '容器'],
  scientific: ['scientific', 'research', 'bio', 'chemistry', 'physics', 'science', '科学', '研究', 'bioinformatics', 'cheminformatics'],
  document: ['document', 'pdf', 'docx', 'pptx', 'xlsx', 'office', '文档', '办公'],
  knowledge: ['knowledge', 'obsidian', 'note', '笔记', '知识', 'markdown'],
  media: ['image', 'video', 'audio', 'media', '图片', '视频', '音频', '处理'],
  thinking: ['thinking', 'problem-solving', 'decision', '思维', '问题', '分析'],
  tools: ['tool', 'cli', 'automation', '开发工具', '工具', '自动化'],
  'skill-dev': ['skill', 'create skill', 'skill development', '技能开发', '创建技能']
};

export function detectSkillCategory(name: string, description: string, categories: Category[]): string {
  const text = `${name} ${description}`.toLowerCase();

  // Calculate scores for each category
  const scores: Record<string, number> = {};

  for (const [categoryId, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    scores[categoryId] = score;
  }

  // Find category with highest score
  let bestCategory = 'skill-dev'; // Default
  let bestScore = 0;

  for (const [categoryId, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = categoryId;
    }
  }

  // Check if category exists
  if (!categories.find(c => c.id === bestCategory)) {
    return 'tools'; // Fallback
  }

  return bestCategory;
}
