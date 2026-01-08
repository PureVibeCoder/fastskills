import { SkillLoader } from '../engine/loader.js';
import { SkillSearchEngine } from '../engine/search.js';

export interface ListSkillsResult {
  active: Array<{
    id: string;
    path: string;
    isSymlink: boolean;
  }>;
  available: number;
  message: string;
}

export function createListSkillsHandler(loader: SkillLoader, engine: SkillSearchEngine) {
  return async function listSkills(): Promise<ListSkillsResult> {
    const activeSkills = await loader.getLoadedSkillInfo();
    const availableCount = engine.getSkillCount();
    
    return {
      active: activeSkills,
      available: availableCount,
      message: activeSkills.length > 0
        ? `当前已加载 ${activeSkills.length} 个技能，共有 ${availableCount} 个可用技能`
        : `当前没有已加载的技能，共有 ${availableCount} 个可用技能`
    };
  };
}
