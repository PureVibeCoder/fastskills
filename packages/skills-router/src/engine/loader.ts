import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { LoadResult, UnloadResult } from '../types.js';
import { validateSkillPath, sanitizeSkillId } from './security.js';

export interface SkillLoaderOptions {
  claudeSkillsDir?: string;
}

export class SkillLoader {
  private claudeSkillsDir: string;
  private loadedSkills: Map<string, string> = new Map();

  constructor(options: SkillLoaderOptions = {}) {
    this.claudeSkillsDir = options.claudeSkillsDir ?? 
      process.env.FASTSKILLS_CLAUDE_SKILLS_DIR ?? 
      path.join(os.homedir(), '.claude', 'skills');
  }

  getSkillsDir(): string {
    return this.claudeSkillsDir;
  }

  private async ensureDir(): Promise<void> {
    await fs.mkdir(this.claudeSkillsDir, { recursive: true });
  }

  async loadSkill(skillId: string, sourcePath: string): Promise<LoadResult> {
    // Sanitize skillId to prevent path traversal
    const safeSkillId = sanitizeSkillId(skillId);
    if (safeSkillId !== skillId) {
      return {
        status: 'error',
        skillId,
        error: `无效的技能 ID: ${skillId}，已被清理为: ${safeSkillId}`
      };
    }

    const validation = validateSkillPath(sourcePath);
    if (!validation.valid) {
      return { 
        status: 'error', 
        skillId, 
        error: validation.error 
      };
    }

    await this.ensureDir();
    
    const targetPath = path.join(this.claudeSkillsDir, safeSkillId);
    
    if (this.loadedSkills.has(safeSkillId)) {
      return { status: 'already_loaded', path: targetPath, skillId: safeSkillId };
    }
    
    try {
      const stat = await fs.lstat(targetPath);
      if (stat.isSymbolicLink() || stat.isDirectory()) {
        this.loadedSkills.set(safeSkillId, targetPath);
        return { status: 'already_exists', path: targetPath, skillId: safeSkillId };
      }
    } catch (error: unknown) {
      // Only ignore ENOENT (file not found), rethrow other errors
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
        return {
          status: 'error',
          skillId: safeSkillId,
          error: `检查目标路径失败: ${error.message}`
        };
      }
      // Target doesn't exist, continue to create
    }
    
    try {
      const absoluteSource = path.resolve(sourcePath);
      
      // Verify source exists and is a directory
      try {
        const sourceStat = await fs.stat(absoluteSource);
        if (!sourceStat.isDirectory()) {
          return {
            status: 'error',
            skillId: safeSkillId,
            error: `源路径不是目录: ${absoluteSource}`
          };
        }
      } catch (error: unknown) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
          return { 
            status: 'error', 
            skillId: safeSkillId, 
            error: `源路径不存在: ${absoluteSource}` 
          };
        }
        throw error;
      }
      
      await fs.symlink(absoluteSource, targetPath, 'dir');
      
      this.loadedSkills.set(safeSkillId, targetPath);
      
      return { 
        status: 'loaded', 
        path: targetPath,
        skillId: safeSkillId,
        message: `技能 ${safeSkillId} 已加载，Claude Code 将自动检测`
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { 
        status: 'error', 
        skillId: safeSkillId, 
        error: `创建 symlink 失败: ${errorMessage}` 
      };
    }
  }

  async unloadSkill(skillId: string): Promise<UnloadResult> {
    const safeSkillId = sanitizeSkillId(skillId);
    const targetPath = path.join(this.claudeSkillsDir, safeSkillId);
    
    try {
      const stat = await fs.lstat(targetPath);
      if (stat.isSymbolicLink()) {
        await fs.unlink(targetPath);
        this.loadedSkills.delete(safeSkillId);
        return { status: 'unloaded', skillId: safeSkillId };
      }
      return { 
        status: 'not_symlink', 
        skillId: safeSkillId, 
        message: '目标不是由本工具创建的 symlink' 
      };
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return { status: 'not_found', skillId: safeSkillId };
      }
      // Handle permission errors
      if (error instanceof Error && 'code' in error && 
          (error.code === 'EACCES' || error.code === 'EPERM')) {
        return {
          status: 'error',
          skillId: safeSkillId,
          message: `权限不足: ${error.message}`
        };
      }
      return { 
        status: 'error', 
        skillId: safeSkillId, 
        message: `卸载失败: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  async listLoaded(): Promise<string[]> {
    await this.ensureDir();
    
    try {
      const entries = await fs.readdir(this.claudeSkillsDir, { withFileTypes: true });
      return entries
        .filter(e => e.isSymbolicLink() || e.isDirectory())
        .map(e => e.name);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return [];
      }
      // Log and return empty for permission errors
      if (error instanceof Error && 'code' in error && 
          (error.code === 'EACCES' || error.code === 'EPERM')) {
        console.error(`[SkillLoader] Permission error listing skills: ${error.message}`);
        return [];
      }
      throw error;
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
            } catch (error: unknown) {
              // Log but continue with fallback
              if (error instanceof Error) {
                console.error(`[SkillLoader] Failed to read symlink ${fullPath}: ${error.message}`);
              }
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
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return [];
      }
      if (error instanceof Error && 'code' in error && 
          (error.code === 'EACCES' || error.code === 'EPERM')) {
        console.error(`[SkillLoader] Permission error getting skill info: ${error.message}`);
        return [];
      }
      throw error;
    }
    
    return result;
  }
}
