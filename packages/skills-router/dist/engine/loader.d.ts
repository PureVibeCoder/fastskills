import { LoadResult, UnloadResult } from '../types.js';
export declare class SkillLoader {
    private claudeSkillsDir;
    private loadedSkills;
    constructor();
    private ensureDir;
    loadSkill(skillId: string, sourcePath: string): Promise<LoadResult>;
    unloadSkill(skillId: string): Promise<UnloadResult>;
    listLoaded(): Promise<string[]>;
    getLoadedSkillInfo(): Promise<Array<{
        id: string;
        path: string;
        isSymlink: boolean;
    }>>;
}
//# sourceMappingURL=loader.d.ts.map