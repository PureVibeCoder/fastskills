import type { SkillMeta, SearchResult } from '../types';
import {
  TfIdfEngine,
  expandQueryWithSynonyms,
  detectIntent,
  getIntentKeywords,
  IntentType,
  INTENT_CATEGORY_MAP
} from '../engine';

let skillsIndex: SkillMeta[] | null = null;
let searchEngine: TfIdfEngine | null = null;
let lastFetch = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const DEFAULT_GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/PureVibeCoder/fastskills/main';

/**
 * Fetch and cache the skills index
 */
async function getSkillsIndex(indexUrl: string): Promise<SkillMeta[]> {
  const now = Date.now();
  if (skillsIndex && (now - lastFetch) < CACHE_TTL) {
    return skillsIndex;
  }

  const response = await fetch(indexUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch skills index: ${response.status}`);
  }

  skillsIndex = await response.json();
  lastFetch = now;

  // Rebuild search engine with new index
  searchEngine = new TfIdfEngine();
  for (const skill of skillsIndex!) {
    const document = [
      skill.name,
      skill.name, // Double weight for name
      skill.description,
      skill.triggers.join(' '),
      skill.category,
      skill.fullDescription || ''
    ].join(' ');
    searchEngine.addDocument(skill.id, document);
  }

  return skillsIndex!;
}

/**
 * Generate a human-readable reason for the match
 */
function generateReason(query: string, skill: SkillMeta, intent: IntentType): string {
  const queryTokens = new Set(query.toLowerCase().split(/\s+/));
  const matchedTriggers = skill.triggers.filter(t =>
    queryTokens.has(t.toLowerCase())
  );

  if (matchedTriggers.length > 0) {
    return `匹配关键词: ${matchedTriggers.slice(0, 3).join(', ')}`;
  }

  if (intent !== IntentType.UNKNOWN) {
    const intentCategories = INTENT_CATEGORY_MAP[intent] || [];
    if (intentCategories.includes(skill.category)) {
      return `意图匹配: ${intent} → ${skill.category}`;
    }
  }

  return `语义相关: ${skill.category}`;
}

/**
 * Search for skills matching a query
 * Uses TF-IDF with synonym expansion and intent detection
 */
export async function searchSkills(
  indexUrl: string,
  query: string,
  limit: number = 5,
  category?: string
): Promise<SearchResult[]> {
  const index = await getSkillsIndex(indexUrl);

  if (!searchEngine || index.length === 0) {
    return [];
  }

  // Detect intent and expand query
  const intent = detectIntent(query);
  const intentKeywords = getIntentKeywords(intent);
  const expandedQuery = expandQueryWithSynonyms(query);
  const enhancedQuery = [...expandedQuery.split(/\s+/), ...intentKeywords].join(' ');

  // Get initial TF-IDF results (get more than needed for filtering)
  const tfidfResults = searchEngine.search(enhancedQuery, limit * 3);

  // Build result list with score adjustments
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();
  const firstWord = queryLower.split(/\s+/)[0];

  for (const { id, score } of tfidfResults) {
    const skill = index.find(s => s.id === id);
    if (!skill) continue;

    // Category filter
    if (category && skill.category !== category) continue;

    let adjustedScore = score;

    // Boost for intent-matching categories
    if (intent !== IntentType.UNKNOWN) {
      const intentCategories = INTENT_CATEGORY_MAP[intent] || [];
      if (intentCategories.includes(skill.category)) {
        adjustedScore *= 1.5;
      }
    }

    // Boost for exact ID/name matches
    const skillIdLower = skill.id.toLowerCase();
    if (queryLower.includes(skillIdLower) ||
        (firstWord.length >= 4 &&
         (skillIdLower === firstWord || skillIdLower.startsWith(firstWord + '-')))) {
      adjustedScore *= 3.0;
    }

    // Boost for trigger matches
    if (skill.triggers.some(t => queryLower.includes(t.toLowerCase()))) {
      adjustedScore *= 2.0;
    }

    results.push({
      skill,
      score: adjustedScore,
      reason: generateReason(query, skill, intent)
    });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * List all skills, optionally filtered by category
 */
export async function listSkills(indexUrl: string, category?: string): Promise<SkillMeta[]> {
  const index = await getSkillsIndex(indexUrl);
  if (category) {
    return index.filter(s => s.category === category);
  }
  return index;
}

/**
 * Get the full content of a skill by ID
 */
export async function getSkillContent(indexUrl: string, skillId: string): Promise<string | null> {
  const index = await getSkillsIndex(indexUrl);
  const skill = index.find(s => s.id === skillId);

  if (!skill) return null;

  const baseUrl = skill.baseUrl || DEFAULT_GITHUB_RAW_BASE;
  const skillPath = skill.path;
  const url = `${baseUrl}/${skillPath}/SKILL.md`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const readmeUrl = `${baseUrl}/${skillPath}/README.md`;
      const readmeResponse = await fetch(readmeUrl);
      if (readmeResponse.ok) {
        return await readmeResponse.text();
      }
      return skill.fullDescription || null;
    }
    return await response.text();
  } catch {
    return skill.fullDescription || null;
  }
}
