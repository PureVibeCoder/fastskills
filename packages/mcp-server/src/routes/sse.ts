import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { handleMCPMessage } from '../mcp/handler';
import type { Env } from '../types';

export const sseRoutes = new Hono<{ Bindings: Env }>();

sseRoutes.get('/', async (c) => {
  return streamSSE(c, async (stream) => {
    await stream.writeSSE({
      event: 'open',
      data: JSON.stringify({
        protocolVersion: '2024-11-05',
        serverInfo: { name: 'fastskills', version: '1.0.0' }
      })
    });

    const keepAlive = setInterval(async () => {
      try {
        await stream.writeSSE({ event: 'ping', data: '' });
      } catch {
        clearInterval(keepAlive);
      }
    }, 30000);

    stream.onAbort(() => {
      clearInterval(keepAlive);
    });
  });
});

sseRoutes.post('/message', async (c) => {
  const body = await c.req.json();
  const indexUrl = c.env.SKILLS_INDEX_URL;
  const response = await handleMCPMessage(body, indexUrl);
  return c.json(response);
});
