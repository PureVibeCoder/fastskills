import { describe, it, expect } from 'vitest';
import { 
  SkillMetaSchema, 
  SkillsIndexSchema, 
  validateSkillsIndex, 
  safeValidateSkillsIndex 
} from '../src/schemas/skills-schema.js';

describe('SkillMetaSchema', () => {
  const validSkill = {
    id: 'test-skill',
    name: 'Test Skill',
    description: 'A test skill',
    category: 'tools',
    source: 'test',
    triggers: ['test', 'skill'],
    path: '/path/to/skill',
  };

  it('validates a correct skill object', () => {
    const result = SkillMetaSchema.safeParse(validSkill);
    expect(result.success).toBe(true);
  });

  it('accepts optional fullDescription', () => {
    const withDescription = { ...validSkill, fullDescription: 'Full description here' };
    const result = SkillMetaSchema.safeParse(withDescription);
    expect(result.success).toBe(true);
  });

  it('rejects missing id', () => {
    const { id, ...noId } = validSkill;
    const result = SkillMetaSchema.safeParse(noId);
    expect(result.success).toBe(false);
  });

  it('rejects empty id', () => {
    const emptyId = { ...validSkill, id: '' };
    const result = SkillMetaSchema.safeParse(emptyId);
    expect(result.success).toBe(false);
  });

  it('rejects missing name', () => {
    const { name, ...noName } = validSkill;
    const result = SkillMetaSchema.safeParse(noName);
    expect(result.success).toBe(false);
  });

  it('rejects non-array triggers', () => {
    const badTriggers = { ...validSkill, triggers: 'not-an-array' };
    const result = SkillMetaSchema.safeParse(badTriggers);
    expect(result.success).toBe(false);
  });
});

describe('SkillsIndexSchema', () => {
  it('validates an array of skills', () => {
    const skills = [
      {
        id: 'skill-1',
        name: 'Skill One',
        description: 'First skill',
        category: 'tools',
        source: 'test',
        triggers: ['one'],
        path: '/path/1',
      },
      {
        id: 'skill-2',
        name: 'Skill Two',
        description: 'Second skill',
        category: 'frontend',
        source: 'test',
        triggers: ['two'],
        path: '/path/2',
      },
    ];
    const result = SkillsIndexSchema.safeParse(skills);
    expect(result.success).toBe(true);
  });

  it('validates empty array', () => {
    const result = SkillsIndexSchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it('rejects non-array', () => {
    const result = SkillsIndexSchema.safeParse({ skills: [] });
    expect(result.success).toBe(false);
  });

  it('rejects array with invalid items', () => {
    const skills = [
      { id: 'valid', name: 'Valid', description: '', category: '', source: '', triggers: [], path: '' },
      { invalid: 'object' },
    ];
    const result = SkillsIndexSchema.safeParse(skills);
    expect(result.success).toBe(false);
  });
});

describe('validateSkillsIndex', () => {
  it('returns validated data for valid input', () => {
    const skills = [
      {
        id: 'skill-1',
        name: 'Skill One',
        description: 'First',
        category: 'tools',
        source: 'test',
        triggers: [],
        path: '/path',
      },
    ];
    const result = validateSkillsIndex(skills);
    expect(result).toEqual(skills);
  });

  it('throws for invalid input', () => {
    expect(() => validateSkillsIndex([{ invalid: true }])).toThrow();
  });
});

describe('safeValidateSkillsIndex', () => {
  it('returns success:true for valid input', () => {
    const skills = [
      {
        id: 'skill-1',
        name: 'Skill One',
        description: 'First',
        category: 'tools',
        source: 'test',
        triggers: [],
        path: '/path',
      },
    ];
    const result = safeValidateSkillsIndex(skills);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(skills);
    }
  });

  it('returns success:false with error for invalid input', () => {
    const result = safeValidateSkillsIndex([{ invalid: true }]);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
      expect(result.error.errors.length).toBeGreaterThan(0);
    }
  });
});
