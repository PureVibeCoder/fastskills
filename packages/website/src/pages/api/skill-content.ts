import type { APIRoute } from 'astro';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SOURCE_BASE_PATHS: Record<string, string> = {
  'anthropic': path.resolve(__dirname, '../../../anthropic-skills/skills'),
  'scientific': path.resolve(__dirname, '../../../scientific-skills/scientific-skills'),
  'claudekit': path.resolve(__dirname, '../../../claudekit-skills/.claude/skills'),
  'community': path.resolve(__dirname, '../../../awesome-claude-skills'),
  'composio': path.resolve(__dirname, '../../../composio-skills/skills'),
  'voltagent': path.resolve(__dirname, '../../../voltagent-skills/skills'),
  'obsidian': path.resolve(__dirname, '../../../obsidian-skills/skills'),
  'planning': path.resolve(__dirname, '../../../planning-with-files'),
  'deep-research': path.resolve(__dirname, '../../../deep-research-skills/.claude/skills'),
  'superpowers': path.resolve(__dirname, '../../../superpowers/skills')
};

export const GET: APIRoute = async ({ url }) => {
  const source = url.searchParams.get('source');
  const skillPath = url.searchParams.get('path');

  if (!source || !skillPath) {
    return new Response(JSON.stringify({ error: 'Missing source or path parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const basePath = SOURCE_BASE_PATHS[source];
  if (!basePath) {
    return new Response(JSON.stringify({ error: 'Invalid source' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const fullPath = path.join(basePath, skillPath, 'SKILL.md');

  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    return new Response(content, {
      status: 200,
      headers: { 'Content-Type': 'text/markdown' }
    });
  } catch {
    return new Response(JSON.stringify({ error: 'File not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
