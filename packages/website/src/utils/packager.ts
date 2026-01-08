import JSZip from 'jszip';
import type { Skill } from '../data/skills';
import { SKILL_TO_SOURCE } from '../data/skill-sources';
import { scanSkillContent, generateSecuritySummary, generateDetailedSecurityReport, type SecurityReport } from './security-scanner';

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

  // 生成安全扫描报告
  const securityReports = skillContents.map(skill => 
    scanSkillContent(skill.id, skill.name, skill.content)
  );

  // 添加技能文件
  skillContents.forEach(skill => {
    zip.file(`${skill.id}/SKILL.md`, skill.content);
  });

  // 生成 README（包含安全扫描报告）
  const readme = generatePackReadme(skillContents, packName, securityReports);
  zip.file('README.md', readme);

  // 添加安全扫描详细报告
  if (securityReports.some(r => r.findings.length > 0)) {
    const detailedReport = generateDetailedSecurityReport(securityReports);
    zip.file('SECURITY_REPORT.md', detailedReport);
  }

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
  packName: string,
  securityReports: SecurityReport[]
): string {
  const securitySummary = generateSecuritySummary(securityReports);

  return `# ${packName}

本技能包由 Skills Controller (https://github.com/marovole/skillscontroller) 聚合提供，共包含 ${skills.length} 个技能。

> [!IMPORTANT]
> **使用前必读**：在导入任何技能到 Claude Code 之前，请务必：
> 1. 下载并阅读每个技能目录下的 \`SKILL.md\` 文件
> 2. 检查技能的触发词、操作指南和预期行为
> 3. 确保您理解技能将执行的所有操作
> 4. 仅导入来自可信来源的技能

${securitySummary}

## 包含的技能

${skills.map(s => `- **${s.name}** (\`${s.id}\`)`).join('\n')}

## 集成方法

### 方式一：全局集成 (推荐)

1. 解压本文件
2. 将需要的技能目录（如 \`frontend-design/\`）复制到您的全局技能目录：
   - macOS/Linux: \`~/.claude/skills/\`
3. 重新启动 Claude Code

### 方式二：项目局部集成

1. 解压本文件
2. 将技能目录复制到您当前项目的 \`.claude/skills/\` 目录中
3. 重新启动 Claude Code

## 安全建议

### 下载后检查清单

- [ ] 检查 \`SKILL.md\` 文件的来源是否可信
- [ ] 确认触发词不会与您的其他技能冲突
- [ ] 验证操作指南中的命令不会执行危险操作
- [ ] 检查是否有网络请求或文件操作
- [ ] 确保理解所有操作的后果

### 危险信号（发现时请谨慎）

- 要求执行未知的 shell 命令
- 尝试访问敏感文件或目录
- 使用 \`eval()\` 或类似动态代码执行
- 包含硬编码的 API 密钥或密码
- 尝试修改系统配置

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
