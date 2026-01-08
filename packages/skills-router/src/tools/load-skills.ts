import { z } from 'zod';
import { SkillLoader } from '../engine/loader.js';
import { SkillSearchEngine } from '../engine/search.js';
import { LoadResult } from '../types.js';

export const loadSkillsSchema = z.object({
  skills: z.array(z.string()).describe('要加载的技能 ID 列表'),
});

export type LoadSkillsArgs = z.infer<typeof loadSkillsSchema>;

export interface LoadSkillsResult {
  success: boolean;
  loaded: string[];
  already_loaded: string[];
  failed: Array<{ skillId: string; error?: string }>;
  message: string;
}

export function createLoadSkillsHandler(loader: SkillLoader, engine: SkillSearchEngine) {
  return async function loadSkills(args: LoadSkillsArgs): Promise<LoadSkillsResult> {
    const results: (LoadResult & { skillId: string })[] = [];
    
    for (const skillId of args.skills) {
      const skill = engine.getSkillById(skillId);
      
      if (!skill) {
        results.push({ 
          skillId, 
          status: 'not_found', 
          error: `技能 ${skillId} 不存在于索引中` 
        });
        continue;
      }
      
      const result = await loader.loadSkill(skillId, skill.path);
      results.push({ ...result, skillId });
    }
    
    const loaded = results.filter(r => r.status === 'loaded');
    const alreadyLoaded = results.filter(r => 
      r.status === 'already_loaded' || r.status === 'already_exists'
    );
    const failed = results.filter(r => 
      r.status === 'not_found' || r.status === 'error'
    );
    
    return {
      success: failed.length === 0,
      loaded: loaded.map(r => r.skillId),
      already_loaded: alreadyLoaded.map(r => r.skillId),
      failed: failed.map(r => ({ skillId: r.skillId, error: r.error })),
      message: loaded.length > 0 
        ? `已加载 ${loaded.length} 个技能，Claude Code 将自动检测` 
        : alreadyLoaded.length > 0
          ? `${alreadyLoaded.length} 个技能已经加载`
          : '没有新技能被加载'
    };
  };
}
