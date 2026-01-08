import { z } from 'zod';
import { SkillLoader } from '../engine/loader.js';
import { SkillSearchEngine } from '../engine/search.js';
export declare const loadSkillsSchema: z.ZodObject<{
    skills: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    skills: string[];
}, {
    skills: string[];
}>;
export type LoadSkillsArgs = z.infer<typeof loadSkillsSchema>;
export interface LoadSkillsResult {
    success: boolean;
    loaded: string[];
    already_loaded: string[];
    failed: Array<{
        skillId: string;
        error?: string;
    }>;
    message: string;
}
export declare function createLoadSkillsHandler(loader: SkillLoader, engine: SkillSearchEngine): (args: LoadSkillsArgs) => Promise<LoadSkillsResult>;
//# sourceMappingURL=load-skills.d.ts.map