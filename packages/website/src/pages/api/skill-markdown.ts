import type { APIRoute } from 'astro';
import { skillMarkdownAssetUrl } from '../../utils/skill-markdown-public-path';

/** Kept for bookmarks; redirects to CDN-cached static shard from inject-skill-content.mjs. */
export const prerender = false;

const ID_RE = /^[a-zA-Z0-9_-]+$/;

export const GET: APIRoute = async ({ url, request }) => {
  const id = url.searchParams.get('id');
  if (!id || !ID_RE.test(id)) {
    return new Response(JSON.stringify({ error: 'Invalid id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const assetUrl = new URL(skillMarkdownAssetUrl(id), request.url);
  return Response.redirect(assetUrl.toString(), 302);
};
