import { z } from 'zod';
import { SkillLoader } from '../engine/loader.js';
import { UnloadResult } from '../types.js';
export declare const unloadSkillSchema: z.ZodObject<{
    skill_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    skill_id: string;
}, {
    skill_id: string;
}>;
export type UnloadSkillArgs = z.infer<typeof unloadSkillSchema>;
export interface UnloadSkillResult {
    success: boolean;
    skillId: string;
    status: UnloadResult['status'];
    message: string;
}
export declare function createUnloadSkillHandler(loader: SkillLoader): (args: UnloadSkillArgs) => Promise<UnloadSkillResult>;
//# sourceMappingURL=unload-skill.d.ts.map