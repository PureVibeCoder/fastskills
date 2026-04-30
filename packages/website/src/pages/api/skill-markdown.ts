import type { APIRoute } from 'astro';
import { skills } from '../../data/skills';

export const prerender = false;

const ID_RE = /^[a-zA-Z0-9_-]+$/;

export const GET: APIRoute = async ({ url, request }) => {
  const id = url.searchParams.get('id');
  if (!id || !ID_RE.test(id)) {
    return new Response(JSON.stringify({ error: 'Invalid id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const jsonUrl = new URL('/data/skills-content.json', request.url);
    const jsonRes = await fetch(jsonUrl.toString());
    if (jsonRes.ok) {
      const map = (await jsonRes.json()) as Record<string, string>;
      const fromJson = map[id];
      if (fromJson) {
        return new Response(fromJson, {
          status: 200,
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=86400'
          }
        });
      }
    }
  } catch {
    // ignore; fall through to skills.ts
  }

  const skill = skills.find((s) => s.id === id);
  const markdown = skill?.content ?? '';
  if (!markdown) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
