import { Hono } from 'hono';
import { z } from 'zod';
import { searchSkills, getSkillContent, listSkills } from '../services/skills';
import type { Env } from '../types';

export const toolsRoutes = new Hono<{ Bindings: Env }>();

const findSkillsSchema = z.object({
  query: z.string(),
  limit: z.number().optional().default(5),
  category: z.string().optional()
});

toolsRoutes.post('/find_skills', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = findSkillsSchema.parse(body);
    const { query, limit, category } = parsed;
    const indexUrl = c.env.SKILLS_INDEX_URL;
    const results = await searchSkills(indexUrl, query, limit, category);
    const message = results.length > 0
      ? `✅ 找到 ${results.length} 个相关技能：${results.map(r => r.skill.name).join('、')}`
      : `❌ 未找到匹配 "${query}" 的技能，请尝试其他关键词`;
    return c.json({ message, skills: results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid parameters', details: error.errors }, 400);
    }
    throw error;
  }
});

toolsRoutes.get('/list_skills', async (c) => {
  const category = c.req.query('category');
  const indexUrl = c.env.SKILLS_INDEX_URL;
  const skills = await listSkills(indexUrl, category);
  const message = category
    ? `📋 分类 "${category}" 共有 ${skills.length} 个技能`
    : `📋 共有 ${skills.length} 个可用技能`;
  return c.json({ message, total: skills.length, skills });
});

toolsRoutes.get('/skills/:id/content', async (c) => {
  const id = c.req.param('id');
  const indexUrl = c.env.SKILLS_INDEX_URL;
  const content = await getSkillContent(indexUrl, id);
  if (!content) {
    return c.json({ message: `❌ 技能 "${id}" 不存在`, error: 'Skill not found' }, 404);
  }
  const sizeKB = (content.length / 1024).toFixed(1);
  return c.json({
    message: `✅ 已加载技能 "${id}" 的完整内容（${sizeKB}KB）`,
    id,
    content
  });
});
