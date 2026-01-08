import { describe, it, expect, beforeEach } from 'vitest';
import { SkillSearchEngine } from '../src/engine/search.js';
import { SkillMeta, IntentType } from '../src/types.js';

const createMockSkill = (partial: Partial<SkillMeta>): SkillMeta => ({
  id: partial.id ?? 'test-skill',
  name: partial.name ?? 'Test Skill',
  description: partial.description ?? 'A test skill',
  category: partial.category ?? 'tools',
  source: partial.source ?? 'test',
  triggers: partial.triggers ?? ['test'],
  path: partial.path ?? '/path/to/skill',
  fullDescription: partial.fullDescription,
});

describe('SkillSearchEngine', () => {
  let engine: SkillSearchEngine;
  let testSkills: SkillMeta[];

  beforeEach(() => {
    testSkills = [
      createMockSkill({
        id: 'scanpy',
        name: 'Scanpy',
        description: 'Single-cell RNA-seq analysis with scanpy',
        category: 'bioinformatics',
        triggers: ['scanpy', 'single-cell', 'rna-seq', 'scRNA'],
      }),
      createMockSkill({
        id: 'react-design',
        name: 'React Design',
        description: 'Build React components with modern patterns',
        category: 'frontend',
        triggers: ['react', 'component', 'frontend', 'ui'],
      }),
      createMockSkill({
        id: 'docker-deploy',
        name: 'Docker Deploy',
        description: 'Deploy applications with Docker containers',
        category: 'devops',
        triggers: ['docker', 'container', 'deploy', 'kubernetes'],
      }),
      createMockSkill({
        id: 'pytest',
        name: 'Pytest',
        description: 'Python testing with pytest framework',
        category: 'testing',
        triggers: ['pytest', 'test', 'python', 'unittest'],
      }),
      createMockSkill({
        id: 'rdkit',
        name: 'RDKit',
        description: 'Cheminformatics and molecular analysis with RDKit',
        category: 'cheminformatics',
        triggers: ['rdkit', 'molecule', 'chemistry', 'drug'],
      }),
    ];
    engine = new SkillSearchEngine(testSkills);
  });

  describe('constructor', () => {
    it('initializes with empty skills array', () => {
      const emptyEngine = new SkillSearchEngine([]);
      expect(emptyEngine.getSkillCount()).toBe(0);
    });

    it('initializes with provided skills', () => {
      expect(engine.getSkillCount()).toBe(5);
    });
  });

  describe('search', () => {
    it('returns empty array for empty engine', () => {
      const emptyEngine = new SkillSearchEngine([]);
      const results = emptyEngine.search('test');
      expect(results).toEqual([]);
    });

    it('finds skills by trigger keywords', () => {
      const results = engine.search('scanpy single-cell');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].skill.id).toBe('scanpy');
    });

    it('finds skills by description content', () => {
      const results = engine.search('RNA-seq analysis');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.skill.id === 'scanpy')).toBe(true);
    });

    it('respects limit parameter', () => {
      const results = engine.search('test', 2);
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('filters by category when specified', () => {
      const results = engine.search('test', 10, { category: 'frontend' });
      for (const result of results) {
        expect(result.skill.category).toBe('frontend');
      }
    });

    it('returns results sorted by score descending', () => {
      const results = engine.search('react component');
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    it('includes reason in results', () => {
      const results = engine.search('docker deploy');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].reason).toBeDefined();
      expect(typeof results[0].reason).toBe('string');
    });

    it('handles Chinese queries', () => {
      const results = engine.search('创建React组件');
      expect(results.length).toBeGreaterThan(0);
    });

    it('handles mixed Chinese and English queries', () => {
      const results = engine.search('研究 single-cell 数据');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('intent-based boosting', () => {
    it('boosts scientific categories for RESEARCH intent', () => {
      const results = engine.search('research analyze bioinformatics data');
      const bioResult = results.find(r => r.skill.category === 'bioinformatics');
      expect(bioResult).toBeDefined();
    });

    it('boosts frontend category for DESIGN intent', () => {
      const results = engine.search('design a user interface');
      const frontendResults = results.filter(r => r.skill.category === 'frontend');
      expect(frontendResults.length).toBeGreaterThan(0);
    });

    it('boosts devops category for DEPLOY intent', () => {
      const results = engine.search('deploy to production');
      const devopsResult = results.find(r => r.skill.category === 'devops');
      expect(devopsResult).toBeDefined();
    });

    it('returns relevant results when category matches intent', () => {
      const results = engine.search('add unit test coverage');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('getSkillById', () => {
    it('returns skill when found', () => {
      const skill = engine.getSkillById('scanpy');
      expect(skill).toBeDefined();
      expect(skill?.id).toBe('scanpy');
    });

    it('returns undefined when not found', () => {
      const skill = engine.getSkillById('nonexistent');
      expect(skill).toBeUndefined();
    });
  });

  describe('getAllSkills', () => {
    it('returns all skills', () => {
      const skills = engine.getAllSkills();
      expect(skills.length).toBe(5);
    });
  });

  describe('setSkills', () => {
    it('replaces existing skills', () => {
      const newSkills = [
        createMockSkill({ id: 'new-skill', name: 'New Skill' }),
      ];
      engine.setSkills(newSkills);
      expect(engine.getSkillCount()).toBe(1);
      expect(engine.getSkillById('scanpy')).toBeUndefined();
      expect(engine.getSkillById('new-skill')).toBeDefined();
    });

    it('rebuilds search index', () => {
      const newSkills = [
        createMockSkill({
          id: 'unique-skill',
          name: 'Unique Skill',
          description: 'A very unique description',
          triggers: ['uniquekeyword'],
        }),
      ];
      engine.setSkills(newSkills);
      const results = engine.search('uniquekeyword');
      expect(results.length).toBe(1);
      expect(results[0].skill.id).toBe('unique-skill');
    });
  });

  describe('reason generation', () => {
    it('generates trigger match reason', () => {
      const results = engine.search('scanpy');
      const scanpyResult = results.find(r => r.skill.id === 'scanpy');
      expect(scanpyResult?.reason).toContain('匹配关键词');
    });

    it('generates semantic reason for non-trigger matches', () => {
      const results = engine.search('something random molecular');
      if (results.length > 0) {
        expect(results[0].reason).toBeDefined();
      }
    });
  });
});
