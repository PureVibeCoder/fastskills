import type { APIRoute } from 'astro';
import { SKILL_TO_SOURCE } from '../../data/skill-sources';

export const prerender = true;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(SKILL_TO_SOURCE), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, immutable',
      'Access-Control-Allow-Origin': '*'
    }
  });
};
