import type { Skill } from '../data/skills';

/**
 * 下载单个技能文件
 */
export function downloadSingleSkill(skill: Skill): void {
  // 创建 Blob
  const blob = new Blob([skill.content], { type: 'text/markdown' });

  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${skill.id}-SKILL.md`;

  // 触发下载
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


