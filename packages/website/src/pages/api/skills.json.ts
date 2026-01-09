import type { APIRoute } from 'astro';
import { skills } from '../../data/skills';
import { SKILL_TO_SOURCE } from '../../data/skill-sources';
import { REPO_CONFIG } from '../../data/repo-config';
import fs from 'node:fs';
import path from 'node:path';

// Load content from the external JSON file generated at build time
// Note: In development, this file might not exist yet if script hasn't run.
// We try to read it dynamically.
let skillsContent: Record<string, string> = {};
try {
  const contentPath = path.resolve('./public/data/skills-content.json');
  if (fs.existsSync(contentPath)) {
    const raw = fs.readFileSync(contentPath, 'utf-8');
    skillsContent = JSON.parse(raw);
  }
} catch (e) {
  console.warn('Could not load skills-content.json:', e);
}

export const GET: APIRoute = async () => {
  const remoteSkills = skills.map((skill) => {
    const sourceInfo = SKILL_TO_SOURCE[skill.id];
    const config = REPO_CONFIG[skill.source];

    // Default fallback
    let baseUrl = 'https://raw.githubusercontent.com/PureVibeCoder/fastskills/main';
    let path = skill.id;
    let fullDescription = undefined;

    if (config) {
      baseUrl = config.rawBase;
    }

    if (sourceInfo && config) {
       // Construct path using config.contentPath logic
       // The sourceInfo.path is usually the relative path inside the content directory
       // e.g. 'canvas-design' inside 'anthropic-skills/skills'

       // If REPO_CONFIG says contentPath is 'skills', and sourceInfo.path is 'canvas-design'
       // then the full remote path is 'skills/canvas-design'

       if (config.contentPath === '.') {
         path = sourceInfo.path;
       } else {
         path = `${config.contentPath}/${sourceInfo.path}`;
       }
    } else if (sourceInfo) {
      // Legacy fallback logic if config is missing but mapping exists
       path = sourceInfo.path;
    }

    // Include full description if available (from build-time extraction)
    // This allows MCP server to work even if GitHub Raw is blocked or flaky
    if (skillsContent[skill.id]) {
      fullDescription = skillsContent[skill.id];
    }

    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      category: skill.category.id,
      source: skill.source,
      triggers: skill.triggers || [],
      path: path,
      baseUrl: baseUrl,
      fullDescription // Optional field for MCP server fallback
    };
  });

  return new Response(JSON.stringify(remoteSkills, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*'
    }
  });
};
