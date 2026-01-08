import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SkillLoader } from '../src/engine/loader.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('SkillLoader', () => {
  let tempDir: string;
  let sourceDir: string;
  let skillsDir: string;
  let loader: SkillLoader;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'skills-test-'));
    tempDir = await fs.realpath(tempDir);
    sourceDir = path.join(tempDir, 'source');
    skillsDir = path.join(tempDir, 'skills');
    await fs.mkdir(sourceDir, { recursive: true });
    await fs.writeFile(path.join(sourceDir, 'SKILL.md'), '# Test Skill');
    
    loader = new SkillLoader({ claudeSkillsDir: skillsDir });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors in tests
    }
  });

  describe('constructor', () => {
    it('uses provided claudeSkillsDir', () => {
      const customDir = '/custom/skills/dir';
      const customLoader = new SkillLoader({ claudeSkillsDir: customDir });
      expect(customLoader.getSkillsDir()).toBe(customDir);
    });

    it('uses environment variable when provided', () => {
      const originalEnv = process.env.FASTSKILLS_CLAUDE_SKILLS_DIR;
      process.env.FASTSKILLS_CLAUDE_SKILLS_DIR = '/env/skills/dir';
      
      const envLoader = new SkillLoader();
      expect(envLoader.getSkillsDir()).toBe('/env/skills/dir');
      
      if (originalEnv) {
        process.env.FASTSKILLS_CLAUDE_SKILLS_DIR = originalEnv;
      } else {
        delete process.env.FASTSKILLS_CLAUDE_SKILLS_DIR;
      }
    });

    it('uses default ~/.claude/skills when no options', () => {
      const originalEnv = process.env.FASTSKILLS_CLAUDE_SKILLS_DIR;
      delete process.env.FASTSKILLS_CLAUDE_SKILLS_DIR;
      
      const defaultLoader = new SkillLoader();
      expect(defaultLoader.getSkillsDir()).toBe(path.join(os.homedir(), '.claude', 'skills'));
      
      if (originalEnv) {
        process.env.FASTSKILLS_CLAUDE_SKILLS_DIR = originalEnv;
      }
    });
  });

  describe('loadSkill', () => {
    it('creates symlink for valid skill', async () => {
      const result = await loader.loadSkill('test-skill', sourceDir);
      
      expect(result.status).toBe('loaded');
      expect(result.skillId).toBe('test-skill');
      expect(result.path).toContain('test-skill');
      
      const targetPath = path.join(skillsDir, 'test-skill');
      const stat = await fs.lstat(targetPath);
      expect(stat.isSymbolicLink()).toBe(true);
    });

    it('returns already_loaded for duplicate load', async () => {
      await loader.loadSkill('test-skill', sourceDir);
      const result = await loader.loadSkill('test-skill', sourceDir);
      
      expect(result.status).toBe('already_loaded');
    });

    it('returns already_exists when symlink exists from previous session', async () => {
      await fs.mkdir(skillsDir, { recursive: true });
      await fs.symlink(sourceDir, path.join(skillsDir, 'existing-skill'), 'dir');
      
      const newLoader = new SkillLoader({ claudeSkillsDir: skillsDir });
      const result = await newLoader.loadSkill('existing-skill', sourceDir);
      
      expect(result.status).toBe('already_exists');
    });

    it('rejects invalid skill IDs with path traversal', async () => {
      const result = await loader.loadSkill('../../../etc/passwd', sourceDir);
      
      expect(result.status).toBe('error');
      expect(result.error).toContain('无效的技能 ID');
    });

    it('rejects blocked paths like /etc', async () => {
      const result = await loader.loadSkill('test-skill', '/etc/passwd');
      
      expect(result.status).toBe('error');
      expect(result.error).toContain('/etc');
    });

    it('rejects source paths that are files not directories', async () => {
      const filePath = path.join(tempDir, 'file.txt');
      await fs.writeFile(filePath, 'content');
      
      const result = await loader.loadSkill('test-skill', filePath);
      
      expect(result.status).toBe('error');
      expect(result.error).toContain('不是目录');
    });

    it('rejects non-existent source paths in allowed directories', async () => {
      const nonExistentPath = path.join(tempDir, 'nonexistent');
      const result = await loader.loadSkill('test-skill', nonExistentPath);
      
      expect(result.status).toBe('error');
      expect(result.error).toContain('源路径不存在');
    });
  });

  describe('unloadSkill', () => {
    it('removes symlink for loaded skill', async () => {
      await loader.loadSkill('test-skill', sourceDir);
      const result = await loader.unloadSkill('test-skill');
      
      expect(result.status).toBe('unloaded');
      expect(result.skillId).toBe('test-skill');
      
      const targetPath = path.join(skillsDir, 'test-skill');
      await expect(fs.lstat(targetPath)).rejects.toThrow();
    });

    it('returns not_found for non-existent skill', async () => {
      const result = await loader.unloadSkill('nonexistent');
      
      expect(result.status).toBe('not_found');
    });

    it('returns not_symlink for real directory', async () => {
      await fs.mkdir(path.join(skillsDir, 'real-dir'), { recursive: true });
      
      const result = await loader.unloadSkill('real-dir');
      
      expect(result.status).toBe('not_symlink');
    });

    it('sanitizes skill ID before unload', async () => {
      await loader.loadSkill('test-skill', sourceDir);
      const result = await loader.unloadSkill('TEST-SKILL');
      
      expect(result.skillId).toBe('test-skill');
    });
  });

  describe('listLoaded', () => {
    it('returns empty array when no skills loaded', async () => {
      const list = await loader.listLoaded();
      expect(list).toEqual([]);
    });

    it('returns loaded skill names', async () => {
      await loader.loadSkill('skill-a', sourceDir);
      
      const sourceDir2 = path.join(tempDir, 'source2');
      await fs.mkdir(sourceDir2);
      await fs.writeFile(path.join(sourceDir2, 'SKILL.md'), '# Skill B');
      await loader.loadSkill('skill-b', sourceDir2);
      
      const list = await loader.listLoaded();
      expect(list).toContain('skill-a');
      expect(list).toContain('skill-b');
    });
  });

  describe('getLoadedSkillInfo', () => {
    it('returns empty array when no skills loaded', async () => {
      const info = await loader.getLoadedSkillInfo();
      expect(info).toEqual([]);
    });

    it('returns skill info with paths', async () => {
      await loader.loadSkill('test-skill', sourceDir);
      
      const info = await loader.getLoadedSkillInfo();
      expect(info.length).toBe(1);
      expect(info[0].id).toBe('test-skill');
      expect(info[0].isSymlink).toBe(true);
      expect(info[0].path).toBe(sourceDir);
    });
  });
});
