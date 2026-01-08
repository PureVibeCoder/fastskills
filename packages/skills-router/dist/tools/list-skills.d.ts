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
export declare function createListSkillsHandler(loader: SkillLoader, engine: SkillSearchEngine): () => Promise<ListSkillsResult>;
//# sourceMappingURL=list-skills.d.ts.map