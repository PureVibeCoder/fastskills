import { SkillMeta, SearchResult } from '../types.js';
export declare class SkillSearchEngine {
    private tfidf;
    private skills;
    private initialized;
    constructor(skills?: SkillMeta[]);
    private buildIndex;
    setSkills(skills: SkillMeta[]): void;
    search(query: string, limit?: number, options?: {
        category?: string;
    }): SearchResult[];
    private generateReason;
    getSkillById(id: string): SkillMeta | undefined;
    getAllSkills(): SkillMeta[];
    getSkillCount(): number;
}
//# sourceMappingURL=search.d.ts.map