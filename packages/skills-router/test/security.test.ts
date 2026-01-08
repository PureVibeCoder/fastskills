import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateSkillPath, sanitizeSkillId } from '../src/engine/security.js';
import * as os from 'os';
import * as path from 'path';

describe('validateSkillPath', () => {
  const originalCwd = process.cwd();

  describe('allowed paths', () => {
    it('allows paths under current working directory', () => {
      const testPath = path.join(process.cwd(), 'some', 'skill');
      const result = validateSkillPath(testPath);
      expect(result.valid).toBe(true);
    });

    it('allows paths under ~/.claude', () => {
      const testPath = path.join(os.homedir(), '.claude', 'skills', 'test-skill');
      const result = validateSkillPath(testPath);
      expect(result.valid).toBe(true);
    });

    it('allows paths under ~/GitHub', () => {
      const testPath = path.join(os.homedir(), 'GitHub', 'project', 'skill');
      const result = validateSkillPath(testPath);
      expect(result.valid).toBe(true);
    });

    it('allows paths under ~/Projects', () => {
      const testPath = path.join(os.homedir(), 'Projects', 'skill');
      const result = validateSkillPath(testPath);
      expect(result.valid).toBe(true);
    });

    it('allows paths under /tmp', () => {
      const testPath = '/tmp/test-skill';
      const result = validateSkillPath(testPath);
      expect(result.valid).toBe(true);
    });
  });

  describe('blocked paths', () => {
    it('blocks /etc paths', () => {
      const result = validateSkillPath('/etc/passwd');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('/etc');
    });

    it('blocks /var paths', () => {
      const result = validateSkillPath('/var/log/syslog');
      expect(result.valid).toBe(false);
    });

    it('blocks /usr paths', () => {
      const result = validateSkillPath('/usr/bin/node');
      expect(result.valid).toBe(false);
    });

    it('blocks ~/.ssh paths', () => {
      const testPath = path.join(os.homedir(), '.ssh', 'id_rsa');
      const result = validateSkillPath(testPath);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('.ssh');
    });

    it('blocks ~/.gnupg paths', () => {
      const testPath = path.join(os.homedir(), '.gnupg', 'private-keys');
      const result = validateSkillPath(testPath);
      expect(result.valid).toBe(false);
    });

    it('blocks ~/.aws paths', () => {
      const testPath = path.join(os.homedir(), '.aws', 'credentials');
      const result = validateSkillPath(testPath);
      expect(result.valid).toBe(false);
    });

    it('blocks ~/.config paths', () => {
      const testPath = path.join(os.homedir(), '.config', 'secrets');
      const result = validateSkillPath(testPath);
      expect(result.valid).toBe(false);
    });
  });

  describe('path traversal prevention', () => {
    it('rejects paths with ..', () => {
      const result = validateSkillPath('/tmp/../etc/passwd');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('..');
    });

    it('rejects relative paths with ..', () => {
      const result = validateSkillPath('../../../etc/passwd');
      expect(result.valid).toBe(false);
    });
  });

  describe('paths not in allowed list', () => {
    it('rejects random paths not in allowed prefixes', () => {
      const result = validateSkillPath('/random/path/skill');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('不在允许范围内');
    });
  });
});

describe('sanitizeSkillId', () => {
  it('converts to lowercase', () => {
    expect(sanitizeSkillId('MySkill')).toBe('myskill');
  });

  it('replaces spaces with hyphens', () => {
    expect(sanitizeSkillId('my skill')).toBe('my-skill');
  });

  it('removes special characters', () => {
    expect(sanitizeSkillId('my@skill#test!')).toBe('my-skill-test');
  });

  it('collapses multiple hyphens', () => {
    expect(sanitizeSkillId('my---skill')).toBe('my-skill');
  });

  it('removes leading and trailing hyphens', () => {
    expect(sanitizeSkillId('-my-skill-')).toBe('my-skill');
  });

  it('truncates to 64 characters', () => {
    const longId = 'a'.repeat(100);
    expect(sanitizeSkillId(longId).length).toBe(64);
  });

  it('handles path traversal attempts', () => {
    expect(sanitizeSkillId('../../../etc/passwd')).toBe('etc-passwd');
  });

  it('handles empty string', () => {
    expect(sanitizeSkillId('')).toBe('');
  });

  it('preserves valid skill IDs', () => {
    expect(sanitizeSkillId('frontend-design')).toBe('frontend-design');
    expect(sanitizeSkillId('scanpy')).toBe('scanpy');
    expect(sanitizeSkillId('react-component-builder')).toBe('react-component-builder');
  });

  it('handles underscores', () => {
    expect(sanitizeSkillId('my_skill_name')).toBe('my_skill_name');
  });
});
