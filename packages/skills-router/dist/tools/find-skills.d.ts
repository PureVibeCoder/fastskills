import { z } from 'zod';
import { SkillSearchEngine } from '../engine/search.js';
import { IntentType } from '../types.js';
export declare const findSkillsSchema: z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodDefault<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    query: string;
    limit: number;
    category?: string | undefined;
}, {
    query: string;
    category?: string | undefined;
    limit?: number | undefined;
}>;
export type FindSkillsArgs = z.infer<typeof findSkillsSchema>;
export interface FindSkillsResult {
    intent: IntentType;
    query: string;
    results: Array<{
        id: string;
        name: string;
        description: string;
        category: string;
        source: string;
        score: number;
        reason: string;
    }>;
    totalSkills: number;
}
export declare function createFindSkillsHandler(engine: SkillSearchEngine): (args: FindSkillsArgs) => Promise<FindSkillsResult>;
//# sourceMappingURL=find-skills.d.ts.map