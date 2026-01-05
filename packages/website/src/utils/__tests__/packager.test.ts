import { describe, it, expect } from 'vitest';
import { filterSkillsForPack, skillPacks } from '../packager';
import type { Skill } from '../../data/skills';

const createMockSkill = (id: string, categoryId: string): Skill => ({
  id,
  name: `Skill ${id}`,
  description: `Description for ${id}`,
  category: {
    id: categoryId,
    name: categoryId,
    nameEn: categoryId,
    description: '',
    icon: ''
  },
  source: 'anthropic',
  triggers: [],
  priority: 1,
  content: ''
});

describe('filterSkillsForPack', () => {
  const mockSkills: Skill[] = [
    createMockSkill('skill-1', 'frontend'),
    createMockSkill('skill-2', 'frontend'),
    createMockSkill('skill-3', 'backend'),
    createMockSkill('skill-4', 'testing'),
    createMockSkill('skill-5', 'devops')
  ];

  it('returns all skills when packKey is "all"', () => {
    const result = filterSkillsForPack(mockSkills, 'all');
    expect(result).toHaveLength(5);
  });

  it('filters frontend skills correctly', () => {
    const result = filterSkillsForPack(mockSkills, 'frontend');
    expect(result).toHaveLength(2);
    expect(result.every(s => s.category.id === 'frontend')).toBe(true);
  });

  it('filters backend skills correctly', () => {
    const result = filterSkillsForPack(mockSkills, 'backend');
    expect(result).toHaveLength(1);
    expect(result[0].category.id).toBe('backend');
  });

  it('filters fullstack skills correctly (frontend + backend + testing)', () => {
    const result = filterSkillsForPack(mockSkills, 'fullstack');
    expect(result).toHaveLength(4);
    const categoryIds = result.map(s => s.category.id);
    expect(categoryIds).toContain('frontend');
    expect(categoryIds).toContain('backend');
    expect(categoryIds).toContain('testing');
    expect(categoryIds).not.toContain('devops');
  });

  it('returns all skills for unknown pack key', () => {
    const result = filterSkillsForPack(mockSkills, 'unknown-pack');
    expect(result).toHaveLength(5);
  });
});

describe('skillPacks', () => {
  it('has all required pack definitions', () => {
    expect(skillPacks).toHaveProperty('frontend');
    expect(skillPacks).toHaveProperty('backend');
    expect(skillPacks).toHaveProperty('testing');
    expect(skillPacks).toHaveProperty('devops');
    expect(skillPacks).toHaveProperty('fullstack');
    expect(skillPacks).toHaveProperty('all');
  });

  it('each pack has name, description, and categoryIds', () => {
    Object.values(skillPacks).forEach(pack => {
      expect(pack).toHaveProperty('name');
      expect(pack).toHaveProperty('description');
      expect(pack).toHaveProperty('categoryIds');
      expect(Array.isArray(pack.categoryIds)).toBe(true);
    });
  });

  it('"all" pack has empty categoryIds array', () => {
    expect(skillPacks.all.categoryIds).toEqual([]);
  });
});
