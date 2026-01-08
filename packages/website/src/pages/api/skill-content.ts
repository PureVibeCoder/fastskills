import type { APIRoute } from 'astro';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

// 禁用预渲染，使用服务端渲染
export const prerender = false;

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
  'superpowers': path.resolve(__dirname, '../../../superpowers/skills'),
  'skill-from-masters': path.resolve(__dirname, '../../../skill-from-masters/skill-from-masters')
};

/**
 * Validates and sanitizes a skill path to prevent path traversal attacks.
 * @param skillPath - The raw path from user input
 * @returns The sanitized path or null if invalid
 */
function sanitizeSkillPath(skillPath: string): string | null {
  // Reject empty paths
  if (!skillPath || skillPath.trim() === '') {
    return null;
  }

  // Normalize the path to resolve any . or .. segments
  const normalized = path.normalize(skillPath);

  // Reject paths containing path traversal sequences
  if (normalized.includes('..') || normalized.includes('..\\')) {
    return null;
  }

  // Reject absolute paths
  if (path.isAbsolute(normalized)) {
    return null;
  }

  // Reject paths starting with traversal attempts
  if (normalized.startsWith('/') || normalized.startsWith('\\')) {
    return null;
  }

  // Only allow alphanumeric, hyphens, underscores, and forward slashes
  const safePattern = /^[a-zA-Z0-9_\-\/]+$/;
  if (!safePattern.test(normalized)) {
    return null;
  }

  return normalized;
}

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

  // Sanitize the skill path to prevent path traversal attacks
  const sanitizedPath = sanitizeSkillPath(skillPath);
  if (!sanitizedPath) {
    return new Response(JSON.stringify({ error: 'Invalid path: path traversal not allowed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Construct the full path and verify it stays within the base directory
  const fullPath = path.resolve(basePath, sanitizedPath, 'SKILL.md');
  
  // Double-check that the resolved path is still within the allowed base path
  if (!fullPath.startsWith(basePath + path.sep) && fullPath !== basePath) {
    return new Response(JSON.stringify({ error: 'Access denied: path outside allowed directory' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    return new Response(content, {
      status: 200,
      headers: { 'Content-Type': 'text/markdown' }
    });
  } catch (err) {
    const error = err as NodeJS.ErrnoException;
    if (error.code === 'ENOENT') {
      // Don't expose full path in error response to prevent information disclosure
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (error.code === 'EACCES') {
      return new Response(JSON.stringify({ error: 'Permission denied' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ error: 'Internal server error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
