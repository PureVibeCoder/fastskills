import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { healthRoutes } from './routes/health';
import { toolsRoutes } from './routes/tools';
import { sseRoutes } from './routes/sse';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

app.route('/health', healthRoutes);

app.route('/api', toolsRoutes);

app.route('/sse', sseRoutes);

app.get('/', (c) =>
  c.json({
    name: 'FastSkills MCP Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      sse: '/sse',
      api: {
        find_skills: 'POST /api/find_skills',
        list_skills: 'GET /api/list_skills',
        get_skill_content: 'GET /api/skills/:id/content'
      }
    }
  })
);

export default app;
