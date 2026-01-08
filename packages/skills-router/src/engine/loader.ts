import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { LoadResult, UnloadResult } from '../types.js';
import { validateSkillPath } from './security.js';

export class SkillLoader {
  private claudeSkillsDir: string;
  private loadedSkills: Map<string, string> = new Map();

  constructor() {
    this.claudeSkillsDir = path.join(os.homedir(), '.claude', 'skills');
  }

  private async ensureDir(): Promise<void> {
    await fs.mkdir(this.claudeSkillsDir, { recursive: true });
  }

  async loadSkill(skillId: string, sourcePath: string): Promise<LoadResult> {
    const validation = validateSkillPath(sourcePath);
    if (!validation.valid) {
      return { 
        status: 'error', 
        skillId, 
        error: validation.error 
      };
    }

    await this.ensureDir();
    
    const targetPath = path.join(this.claudeSkillsDir, skillId);
    
    if (this.loadedSkills.has(skillId)) {
      return { status: 'already_loaded', path: targetPath, skillId };
    }
    
    try {
      const stat = await fs.lstat(targetPath);
      if (stat.isSymbolicLink() || stat.isDirectory()) {
        this.loadedSkills.set(skillId, targetPath);
        return { status: 'already_exists', path: targetPath, skillId };
      }
    } catch {
      // Target doesn't exist, continue to create
    }
    
    try {
      const absoluteSource = path.resolve(sourcePath);
      
      const sourceExists = await fs.access(absoluteSource)
        .then(() => true)
        .catch(() => false);
      
      if (!sourceExists) {
        return { 
          status: 'error', 
          skillId, 
          error: `源路径不存在: ${absoluteSource}` 
        };
      }
      
      await fs.symlink(absoluteSource, targetPath, 'dir');
      
      this.loadedSkills.set(skillId, targetPath);
      
      return { 
        status: 'loaded', 
        path: targetPath,
        skillId,
        message: `技能 ${skillId} 已加载，Claude Code 将自动检测`
      };
    } catch (error) {
      return { 
        status: 'error', 
        skillId, 
        error: `创建 symlink 失败: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  async unloadSkill(skillId: string): Promise<UnloadResult> {
    const targetPath = path.join(this.claudeSkillsDir, skillId);
    
    try {
      const stat = await fs.lstat(targetPath);
      if (stat.isSymbolicLink()) {
        await fs.unlink(targetPath);
        this.loadedSkills.delete(skillId);
        return { status: 'unloaded', skillId };
      }
      return { 
        status: 'not_symlink', 
        skillId, 
        message: '目标不是由本工具创建的 symlink' 
      };
    } catch {
      return { status: 'not_found', skillId };
    }
  }

  async listLoaded(): Promise<string[]> {
    await this.ensureDir();
    
    try {
      const entries = await fs.readdir(this.claudeSkillsDir, { withFileTypes: true });
      return entries
        .filter(e => e.isSymbolicLink() || e.isDirectory())
        .map(e => e.name);
    } catch {
      return [];
    }
  }

  async getLoadedSkillInfo(): Promise<Array<{ id: string; path: string; isSymlink: boolean }>> {
    await this.ensureDir();
    
    const result: Array<{ id: string; path: string; isSymlink: boolean }> = [];
    
    try {
      const entries = await fs.readdir(this.claudeSkillsDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isSymbolicLink() || entry.isDirectory()) {
          const fullPath = path.join(this.claudeSkillsDir, entry.name);
          let realPath = fullPath;
          
          if (entry.isSymbolicLink()) {
            try {
              realPath = await fs.readlink(fullPath);
            } catch {
              realPath = fullPath;
            }
          }
          
          result.push({
            id: entry.name,
            path: realPath,
            isSymlink: entry.isSymbolicLink()
          });
        }
      }
    } catch {
      // Directory might not exist
    }
    
    return result;
  }
}
