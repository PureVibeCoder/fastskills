import { z } from 'zod';
import { detectIntent } from '../engine/intent.js';
export const findSkillsSchema = z.object({
    query: z.string().describe('任务描述或关键词'),
    limit: z.number().default(5).describe('返回结果数量'),
    category: z.string().optional().describe('限定分类'),
});
export function createFindSkillsHandler(engine) {
    return async function findSkills(args) {
        const intent = detectIntent(args.query);
        const searchResults = engine.search(args.query, args.limit * 2, {
            category: args.category
        });
        const results = searchResults.slice(0, args.limit).map(r => ({
            id: r.skill.id,
            name: r.skill.name,
            description: r.skill.description.slice(0, 200),
            category: r.skill.category,
            source: r.skill.source,
            score: Math.round(r.score * 100) / 100,
            reason: r.reason
        }));
        return {
            intent,
            query: args.query,
            results,
            totalSkills: engine.getSkillCount()
        };
    };
}
//# sourceMappingURL=find-skills.js.map