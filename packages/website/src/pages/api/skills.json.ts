import type { APIRoute } from 'astro';
import { skills } from '../../data/skills';
import { SKILL_TO_SOURCE } from '../../data/skill-sources';
import { REPO_CONFIG } from '../../data/repo-config';
import { getExtraCategoryIds, getSkillTags } from '../../utils/skill-tags';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = true;

function loadSkillsContent(): Record<string, string> {
  try {
    const contentPath = path.resolve('./public/data/skills-content.json');
    if (fs.existsSync(contentPath)) {
      const raw = fs.readFileSync(contentPath, 'utf-8');
      return JSON.parse(raw) as Record<string, string>;
    }
  } catch (e) {
    console.warn('Could not load skills-content.json:', e);
  }
  return {};
}

export const GET: APIRoute = async () => {
  const skillsContent = loadSkillsContent();
  const remoteSkills = skills.map((skill) => {
    const sourceInfo = SKILL_TO_SOURCE[skill.id];
    const config = REPO_CONFIG[skill.source];

    let baseUrl = 'https://raw.githubusercontent.com/PureVibeCoder/fastskills/main';
    let rawPath = skill.id;
    let fullDescription: string | undefined;

    if (config) {
      baseUrl = config.rawBase;
    }

    if (sourceInfo && config) {
      if (config.contentPath === '.') {
        rawPath = sourceInfo.path;
      } else if (!config.contentPath) {
        rawPath = sourceInfo.path;
      } else {
        rawPath = sourceInfo.path
          ? `${config.contentPath}/${sourceInfo.path}`
          : config.contentPath;
      }
    } else if (sourceInfo) {
      rawPath = sourceInfo.path;
    }

    if (skillsContent[skill.id]) {
      fullDescription = skillsContent[skill.id];
    }

    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      category: skill.category.id,
      tags: getSkillTags(skill),
      extraCategoryIds: getExtraCategoryIds(skill),
      source: skill.source,
      triggers: skill.triggers || [],
      path: rawPath,
      baseUrl,
      fullDescription
    };
  });

  return new Response(JSON.stringify(remoteSkills, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, immutable',
      'Access-Control-Allow-Origin': '*'
    }
  });
};
