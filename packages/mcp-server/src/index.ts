import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { healthRoutes } from './routes/health';
import { toolsRoutes } from './routes/tools';
import { sseRoutes } from './routes/sse';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

app.use('*', logger());
app.use('*', cors());

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    }
  }, 500);
});

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
