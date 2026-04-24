import type { Skill } from '../data/skills';

/** 显式标签；未设置时默认使用主分类 id；Three.js 系列额外带 threejs slug */
export function getSkillTags(skill: Skill): string[] {
  if (skill.tags?.length) return skill.tags;
  if (skill.source === 'threejs') {
    return ['threejs', skill.category.id];
  }
  return [skill.category.id];
}

export function getExtraCategoryIds(skill: Skill): string[] {
  return skill.extraCategoryIds ?? [];
}
