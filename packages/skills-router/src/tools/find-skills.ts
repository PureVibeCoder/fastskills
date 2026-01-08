import { z } from 'zod';
import { SkillSearchEngine } from '../engine/search.js';
import { detectIntent } from '../engine/intent.js';
import { SkillMeta, IntentType } from '../types.js';

export const findSkillsSchema = z.object({
  query: z.string().describe('任务描述或关键词'),
  limit: z.number().default(5).describe('返回结果数量'),
  category: z.string().optional().describe('限定分类'),
});

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

export function createFindSkillsHandler(engine: SkillSearchEngine) {
  return async function findSkills(args: FindSkillsArgs): Promise<FindSkillsResult> {
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
