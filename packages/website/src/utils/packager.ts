import JSZip from 'jszip';
import type { Skill } from '../data/skills';

// 子模块技能目录映射（source -> 相对路径）
const SKILL_SOURCE_PATHS: Record<string, string> = {
  'anthropic': '../../../anthropic-skills/skills',
  'scientific': '../../../scientific-skills/skills',
  'claudekit': '../../../claudekit-skills/.claude/skills',
  'community': '../../../awesome-claude-skills/skills',
  'composio': '../../../composio-skills/skills',
  'voltagent': '../../../voltagent-skills/skills',
  'obsidian': '../../../obsidian-skills/skills',
  'planning': '../../../planning-with-files/skills'
};

export interface SkillForPackage {
  id: string;
  name: string;
  content: string;
}

// 技能到源目录的映射
const SKILL_TO_SOURCE: Record<string, { source: string; path: string }> = {
  // anthropic-skills
  'frontend-design': { source: 'anthropic', path: 'frontend-design' },
  'modern-frontend-design': { source: 'anthropic', path: 'modern-frontend-design' },
  'brand-guidelines': { source: 'anthropic', path: 'brand-guidelines' },
  'canvas-design': { source: 'anthropic', path: 'canvas-design' },
  'theme-factory': { source: 'anthropic', path: 'theme-factory' },
  'pdf': { source: 'anthropic', path: 'pdf' },
  'doc-coauthoring': { source: 'anthropic', path: 'doc-coauthoring' },
  'docx': { source: 'anthropic', path: 'docx' },
  'pptx': { source: 'anthropic', path: 'pptx' },
  'xlsx': { source: 'anthropic', path: 'xlsx' },
  'algorithmic-art': { source: 'anthropic', path: 'algorithmic-art' },
  'slack-gif-creator': { source: 'anthropic', path: 'slack-gif-creator' },
  'mcp-builder': { source: 'anthropic', path: 'mcp-builder' },
  'skill-creator': { source: 'anthropic', path: 'skill-creator' },
  'internal-comms': { source: 'anthropic', path: 'internal-comms' },
  'web-artifacts-builder': { source: 'anthropic', path: 'web-artifacts-builder' },
  'webapp-testing': { source: 'anthropic', path: 'webapp-testing' },
  // claudekit-skills
  'backend-development': { source: 'claudekit', path: 'backend-development' },
  'database-design': { source: 'claudekit', path: 'databases' },
  'devops': { source: 'claudekit', path: 'devops' },
  'sequential-thinking': { source: 'claudekit', path: 'sequential-thinking' },
  'code-review': { source: 'claudekit', path: 'code-review' },
  'document-skills': { source: 'claudekit', path: 'document-skills' },
  // community skills
  'react-components': { source: 'community', path: 'react-components' },
  'docker': { source: 'community', path: 'docker' },
  'browser-automation': { source: 'community', path: 'browser-automation' },
  'image-enhancer': { source: 'community', path: 'image-enhancer' },
  // scientific skills
  'biopython': { source: 'scientific', path: 'biopython' },
  'rdkit': { source: 'scientific', path: 'rdkit' },
  'scanpy': { source: 'scientific', path: 'scanpy' },
  'deepchem': { source: 'scientific', path: 'deepchem' },
  'pubmed': { source: 'scientific', path: 'pubmed' },
  // obsidian skills
  'obsidian-markdown': { source: 'obsidian', path: 'obsidian-markdown' },
  'obsidian-bases': { source: 'obsidian', path: 'obsidian-bases' },
  'json-canvas': { source: 'obsidian', path: 'json-canvas' },
  // planning
  'planning-with-files': { source: 'planning', path: 'planning-with-files' }
};

/**
 * 尝试从本地文件读取 SKILL.md 内容
 */
async function tryReadSkillFile(skillId: string): Promise<string | null> {
  const skillSource = SKILL_TO_SOURCE[skillId];
  if (!skillSource) return null;

  const basePath = SKILL_SOURCE_PATHS[skillSource.source];
  if (!basePath) return null;

  const skillPath = `${basePath}/${skillSource.path}/SKILL.md`;

  try {
    const response = await fetch(skillPath);
    if (response.ok) {
      return await response.text();
    }
  } catch {
    // 跨域或网络错误，忽略
  }

  return null;
}

/**
 * 获取技能的完整内容（优先从文件读取，否则使用 skills.ts 中的内容）
 */
async function getSkillContent(skill: Skill): Promise<string> {
  // 优先尝试从本地文件读取
  const fileContent = await tryReadSkillFile(skill.id);
  if (fileContent) {
    return fileContent;
  }

  // 回退到 skills.ts 中的 content
  if (skill.content) {
    return skill.content;
  }

  // 如果都没有，生成一个基础内容
  return `---
name: ${skill.id}
description: ${skill.description}
---

# ${skill.name}

${skill.description}

## 来源

此技能来自 ${skill.source} 来源。

## 使用方法

请参考原始来源获取完整的使用文档。
`;
}

/**
 * 下载技能包（ZIP 格式）
 */
export async function downloadSkillPack(
  skills: Skill[],
  packName: string
): Promise<void> {
  // 创建 ZIP 实例
  const zip = new JSZip();

  // 并行获取所有技能内容
  const skillContents = await Promise.all(
    skills.map(async (skill) => {
      const content = await getSkillContent(skill);
      return { id: skill.id, name: skill.name, content };
    })
  );

  // 添加技能文件
  skillContents.forEach(skill => {
    zip.file(`${skill.id}/SKILL.md`, skill.content);
  });

  // 生成 README
  const readme = generatePackReadme(skillContents, packName);
  zip.file('README.md', readme);

  // 生成 ZIP 文件
  const content = await zip.generateAsync({ type: 'blob' });

  // 下载
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${packName}-skills-pack.zip`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 生成技能包 README
 */
function generatePackReadme(
  skills: SkillForPackage[],
  packName: string
): string {
  return `# ${packName}

本技能包包含 ${skills.length} 个技能，由 Skills Controller 提供。

## 包含的技能

${skills.map(s => `- **${s.name}** (\`${s.id}\`)`).join('\n')}

## 安装方法

### 方法一：手动安装

1. 解压本文件
2. 将技能目录复制到 \`~/.claude/skills/\` 目录
3. 重启 Claude Code

### 方法二：项目集成

如果你想将这些技能集成到你的项目中：

1. 解压本文件
2. 将技能目录复制到项目的技能目录（如 \`./anthropic-skills/skills/\`）
3. 确保 Skills Controller 配置了正确的技能路径

## 技能来源

Skills Controller - https://github.com/marovole/skillscontroller

## 许可证

MIT License
`;
}

export interface SkillPack {
  name: string;
  description: string;
  categoryIds: string[];
}

export const skillPacks: Record<string, SkillPack> = {
  frontend: {
    name: '前端开发技能包',
    description: '包含 UI 设计、React 组件、样式系统等前端技能',
    categoryIds: ['frontend']
  },
  backend: {
    name: '后端开发技能包',
    description: '包含 API 设计、数据库、服务端架构等后端技能',
    categoryIds: ['backend']
  },
  testing: {
    name: '测试质量技能包',
    description: '包含 E2E 测试、代码审查、质量保障等测试技能',
    categoryIds: ['testing']
  },
  devops: {
    name: 'DevOps 技能包',
    description: '包含 CI/CD、Docker、部署等 DevOps 技能',
    categoryIds: ['devops']
  },
  fullstack: {
    name: '全栈开发技能包',
    description: '包含前端、后端、测试等全栈开发技能',
    categoryIds: ['frontend', 'backend', 'testing']
  },
  all: {
    name: '完整技能包',
    description: '包含所有可用的技能',
    categoryIds: []
  }
};

export function filterSkillsForPack(
  allSkills: Skill[],
  packKey: string
): Skill[] {
  const pack = skillPacks[packKey];
  if (!pack) {
    return allSkills;
  }

  if (pack.categoryIds.length === 0) {
    return allSkills;
  }

  return allSkills.filter(skill =>
    pack.categoryIds.includes(skill.category.id)
  );
}

/**
 * 显示技能包下载选择器
 */
export function showPackDownloadModal(
  allSkills: Skill[],
  onDownload: (skills: Skill[], packName: string) => void
): void {
  // 创建模态框 HTML
  const modalHtml = `
    <div id="pack-modal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>下载技能包</h2>
          <button class="modal-close" id="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-description">选择要下载的技能包：</p>
          <div class="pack-list">
            ${Object.entries(skillPacks).map(([key, pack]) => `
              <button class="pack-button" data-pack="${key}">
                <div class="pack-name">${pack.name}</div>
                <div class="pack-description">${pack.description}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // 添加到页面
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById('pack-modal');
  const closeBtn = document.getElementById('close-modal');

  // 关闭模态框
  const closeModal = () => {
    modal?.remove();
  };

  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.querySelectorAll('.pack-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const button = btn as HTMLButtonElement;
      const packKey = button.dataset.pack;
      if (packKey && packKey in skillPacks) {
        const skills = filterSkillsForPack(allSkills, packKey);
        const pack = skillPacks[packKey];
        onDownload(skills, pack.name);
        closeModal();
      }
    });
  });
}
