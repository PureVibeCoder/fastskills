import JSZip from 'jszip';
import type { Skill } from '../data/skills';
import { SKILL_TO_SOURCE } from '../data/skill-sources';

export interface SkillForPackage {
  id: string;
  name: string;
  content: string;
}

/**
 * 尝试从本地文件读取 SKILL.md 内容（通过 API 端点）
 */
async function tryReadSkillFile(skillId: string): Promise<string | null> {
  const skillSource = SKILL_TO_SOURCE[skillId];
  if (!skillSource) return null;

  const apiUrl = `/api/skill-content?source=${skillSource.source}&path=${skillSource.path}`;

  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      return await response.text();
    }
  } catch (error) {
    console.warn(`[packager] Failed to fetch SKILL.md for ${skillId}:`, error);
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
