export interface Category {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  parent?: string; // 父分类 ID，用于子分类
}

export const categories: Category[] = [
  {
    id: 'frontend',
    name: '前端开发',
    nameEn: 'Frontend',
    description: 'UI 设计、组件开发、样式系统',
    icon: '🎨'
  },
  {
    id: 'backend',
    name: '后端开发',
    nameEn: 'Backend',
    description: 'API、数据库、服务端架构',
    icon: '⚙️'
  },
  {
    id: 'testing',
    name: '测试质量',
    nameEn: 'Testing',
    description: 'E2E 测试、代码审查、质量保障',
    icon: '✅'
  },
  {
    id: 'devops',
    name: 'DevOps',
    nameEn: 'DevOps',
    description: '部署、CI/CD、容器化',
    icon: '🚀'
  },
  // 科学研究 - 主分类
  {
    id: 'scientific',
    name: '科学研究',
    nameEn: 'Scientific',
    description: '生物信息学、化学、医学、AI研究',
    icon: '🔬'
  },
  // 科学研究 - 子分类
  {
    id: 'bioinformatics',
    name: '生物信息学',
    nameEn: 'Bioinformatics',
    description: '基因组学、序列分析、单细胞分析',
    icon: '🧬',
    parent: 'scientific'
  },
  {
    id: 'cheminformatics',
    name: '化学信息学',
    nameEn: 'Cheminformatics',
    description: '药物发现、分子设计、虚拟筛选',
    icon: '🧪',
    parent: 'scientific'
  },
  {
    id: 'clinical',
    name: '临床医学',
    nameEn: 'Clinical',
    description: '临床研究、精准医疗、变异解读',
    icon: '🏥',
    parent: 'scientific'
  },
  {
    id: 'ml-ai',
    name: '机器学习与AI',
    nameEn: 'ML & AI',
    description: '深度学习、强化学习、模型解释',
    icon: '🤖',
    parent: 'scientific'
  },
  {
    id: 'physics-materials',
    name: '物理与材料',
    nameEn: 'Physics & Materials',
    description: '量子计算、天文学、材料科学',
    icon: '🔮',
    parent: 'scientific'
  },
  {
    id: 'data-viz',
    name: '数据分析与可视化',
    nameEn: 'Data & Visualization',
    description: '统计分析、网络分析、科学绘图',
    icon: '📊',
    parent: 'scientific'
  },
  {
    id: 'sci-databases',
    name: '科学数据库',
    nameEn: 'Scientific Databases',
    description: 'PubMed、UniProt、ChEMBL 等数据库',
    icon: '🗄️',
    parent: 'scientific'
  },
  {
    id: 'sci-communication',
    name: '科学写作与交流',
    nameEn: 'Scientific Communication',
    description: '论文写作、同行评审、海报制作',
    icon: '📝',
    parent: 'scientific'
  },
  {
    id: 'lab-automation',
    name: '实验室自动化',
    nameEn: 'Lab Automation',
    description: '液体处理、实验流程自动化',
    icon: '🔧',
    parent: 'scientific'
  },
  {
    id: 'document',
    name: '文档处理',
    nameEn: 'Documentation',
    description: '文档生成、办公文件处理',
    icon: '📄'
  },
  {
    id: 'knowledge',
    name: '知识管理',
    nameEn: 'Knowledge',
    description: 'Obsidian、笔记系统、知识库管理',
    icon: '📓'
  },
  {
    id: 'media',
    name: '媒体处理',
    nameEn: 'Media',
    description: '图片、视频、音频处理',
    icon: '🎬'
  },
  {
    id: 'thinking',
    name: '思维方法',
    nameEn: 'Thinking',
    description: '问题分析、决策辅助',
    icon: '🧠'
  },
  {
    id: 'tools',
    name: '开发工具',
    nameEn: 'Tools',
    description: 'MCP、工具开发、自动化',
    icon: '🛠️'
  },
  {
    id: 'skill-dev',
    name: '技能开发',
    nameEn: 'Skill Development',
    description: '技能创建、开发最佳实践、专家方法论',
    icon: '🧙'
  }
];

// 获取主分类（无父分类的分类）
export function getMainCategories(): Category[] {
  return categories.filter(cat => !cat.parent);
}

// 获取子分类
export function getSubCategories(parentId: string): Category[] {
  return categories.filter(cat => cat.parent === parentId);
}

// 获取科学研究子分类
export function getScientificSubCategories(): Category[] {
  return getSubCategories('scientific');
}
