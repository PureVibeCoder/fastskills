/**
 * 首页「场景技能包」下载弹窗使用的套件定义与过滤逻辑（纯数据，可供客户端脚本 import）。
 */

export interface ScenarioPackMeta {
  name: string;
  description: string;
}

/** 套件 key -> 展示文案 */
export const scenarioSkillPacks: Record<string, ScenarioPackMeta> = {
  'frontend-developer': {
    name: '前端开发者套件',
    description: '适合前端工程师，包含 UI 设计、组件开发、响应式布局等技能'
  },
  'fullstack-developer': {
    name: '全栈开发者套件',
    description: '覆盖前后端开发全流程，适合全栈工程师'
  },
  'document-production': {
    name: '文档生产套件',
    description: '专注于文档生成和处理，适合技术写作者'
  },
  'knowledge-management': {
    name: '知识管理套件',
    description: 'Obsidian 笔记系统、知识库管理、可视化'
  },
  'devops-engineer': {
    name: 'DevOps 工程师套件',
    description: 'CI/CD、容器化、部署自动化相关技能'
  },
  'task-planning': {
    name: '任务规划套件',
    description: 'Manus 风格文件规划、任务追踪、上下文工程'
  },
  'testing-qa': {
    name: '测试与质量保障套件',
    description: '自动化测试、代码审查、质量保障'
  },
  'backend-specialist': {
    name: '后端专家套件',
    description: 'API 设计、数据库、认证授权相关技能'
  },
  'design-system': {
    name: '设计系统套件',
    description: 'UI 设计、主题、品牌相关技能'
  },
  'content-creator': {
    name: '内容创作套件',
    description: '适合内容创作者和营销人员'
  },
  'research-analyst': {
    name: '研究分析套件',
    description: '深度研究和数据分析相关技能'
  },
  'media-processing': {
    name: '媒体处理套件',
    description: '图片、视频等媒体文件处理'
  },
  'productivity-tools': {
    name: '效率工具套件',
    description: '提升日常工作效率的实用技能'
  },
  'drug-discovery': {
    name: '药物发现套件',
    description: '虚拟筛选、分子对接、ADMET 预测、化合物优化'
  },
  'genomics-bioinformatics': {
    name: '基因组学与生物信息学套件',
    description: '序列分析、单细胞 RNA-seq、基因调控网络'
  },
  'clinical-research': {
    name: '临床研究套件',
    description: '临床试验、变异解读、药物基因组学、精准医疗'
  },
  'ml-deep-learning': {
    name: '机器学习与深度学习套件',
    description: 'PyTorch、scikit-learn、强化学习、模型解释'
  },
  'quantum-physics': {
    name: '量子计算与物理套件',
    description: '量子计算、天文学、材料科学'
  },
  'data-visualization': {
    name: '科学数据可视化套件',
    description: '统计分析、网络可视化、出版级图表'
  },
  'scientific-databases': {
    name: '科学数据库套件',
    description: 'PubMed、UniProt、KEGG 等科学数据库访问'
  },
  'scientific-writing': {
    name: '科学写作与交流套件',
    description: '论文写作、同行评审、海报制作、文献管理'
  },
  'proteomics-multiomics': {
    name: '蛋白质组学与多组学套件',
    description: '质谱分析、蛋白质工程、多组学整合'
  },
  'lab-automation': {
    name: '实验室自动化套件',
    description: '液体处理、实验流程自动化、LIMS 集成'
  },
  'medical-imaging': {
    name: '医学影像与病理套件',
    description: 'DICOM 处理、全切片分析、计算病理学'
  }
};

const categoryKeywordMap: Record<string, string> = {
  前端: 'frontend',
  后端: 'backend',
  测试: 'testing',
  DevOps: 'devops',
  文档: 'document',
  知识管理: 'knowledge',
  媒体: 'media',
  内容创作: 'content',
  研究分析: 'research',
  效率: 'productivity',
  设计: 'design',
  药物: 'cheminformatics',
  基因组: 'bioinformatics',
  临床: 'clinical',
  机器学习: 'ml-ai',
  量子: 'physics-materials',
  数据可视化: 'data-viz',
  科学数据库: 'sci-databases',
  科学写作: 'sci-communication',
  蛋白质组: 'scientific',
  实验室: 'lab-automation',
  医学影像: 'clinical'
};

export interface ClientSkillListItem {
  id: string;
  name: string;
  description: string;
  category: { id: string; name: string; icon: string };
  triggers: string[];
  source: string;
  priority: number;
}

export function filterSkillsForScenarioPack(
  allSkills: ClientSkillListItem[],
  packKey: string
): ClientSkillListItem[] {
  const pack = scenarioSkillPacks[packKey];
  if (!pack) return allSkills;

  const keywords = pack.name.split(/[和与]/)[0];
  let categoryId: string | null = null;
  for (const [key, value] of Object.entries(categoryKeywordMap)) {
    if (keywords.includes(key)) {
      categoryId = value;
      break;
    }
  }

  if (!categoryId) return allSkills.slice(0, 5);
  return allSkills.filter((s) => s.category.id === categoryId);
}
