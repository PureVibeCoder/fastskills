#!/usr/bin/env npx tsx
/**
 * Skill Coverage Report Generator
 *
 * This script tests the search engine's ability to correctly trigger
 * skills based on their triggers/keywords. It generates a report showing:
 * - Overall coverage rate
 * - Skills that are well-covered
 * - Skills that may need better triggers
 *
 * Usage:
 *   npx tsx scripts/coverage-report.ts
 */

import { TfIdfEngine } from '../src/engine/tfidf';
import { expandQueryWithSynonyms } from '../src/engine/synonyms';
import { detectIntent, getIntentKeywords, INTENT_CATEGORY_MAP, IntentType } from '../src/engine/intent';

interface SkillMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  triggers: string[];
  fullDescription?: string;
}

interface CoverageResult {
  skillId: string;
  skillName: string;
  category: string;
  triggers: string[];
  bestQuery: string;
  bestRank: number;
  covered: boolean;
}

const SKILLS_INDEX_URL = 'https://fastskills.pages.dev/api/skills.json';

async function fetchSkillsIndex(): Promise<SkillMeta[]> {
  const response = await fetch(SKILLS_INDEX_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch skills index: ${response.status}`);
  }
  return response.json();
}

function buildSearchEngine(skills: SkillMeta[]): TfIdfEngine {
  const engine = new TfIdfEngine();

  for (const skill of skills) {
    const document = [
      skill.name,
      skill.name,
      skill.description,
      skill.triggers.join(' '),
      skill.category,
      skill.fullDescription || ''
    ].join(' ');
    engine.addDocument(skill.id, document);
  }

  return engine;
}

function searchWithBoosts(
  engine: TfIdfEngine,
  skills: SkillMeta[],
  query: string,
  limit: number = 10
): { id: string; score: number }[] {
  const intent = detectIntent(query);
  const intentKeywords = getIntentKeywords(intent);
  const expandedQuery = expandQueryWithSynonyms(query);
  const enhancedQuery = [...expandedQuery.split(/\s+/), ...intentKeywords].join(' ');

  const tfidfResults = engine.search(enhancedQuery, limit * 3);
  const queryLower = query.toLowerCase();
  const firstWord = queryLower.split(/\s+/)[0];

  const results: { id: string; score: number }[] = [];

  for (const { id, score } of tfidfResults) {
    const skill = skills.find(s => s.id === id);
    if (!skill) continue;

    let adjustedScore = score;

    if (intent !== IntentType.UNKNOWN) {
      const intentCategories = INTENT_CATEGORY_MAP[intent] || [];
      if (intentCategories.includes(skill.category)) {
        adjustedScore *= 1.5;
      }
    }

    const skillIdLower = skill.id.toLowerCase();
    if (queryLower.includes(skillIdLower) ||
        (firstWord.length >= 4 &&
         (skillIdLower === firstWord || skillIdLower.startsWith(firstWord + '-')))) {
      adjustedScore *= 3.0;
    }

    if (skill.triggers.some(t => queryLower.includes(t.toLowerCase()))) {
      adjustedScore *= 2.0;
    }

    results.push({ id, score: adjustedScore });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function generateCoverageReport(): Promise<void> {
  console.log('Fetching skills index...');
  const skills = await fetchSkillsIndex();
  console.log(`Loaded ${skills.length} skills\n`);

  console.log('Building search engine...');
  const engine = buildSearchEngine(skills);

  const coverageResults: CoverageResult[] = [];
  const TOP_N = 5; // Consider covered if skill appears in top 5

  console.log('Testing skill coverage...\n');

  for (const skill of skills) {
    // Test queries: skill name, each trigger, and combined
    const testQueries = [
      skill.name,
      skill.id,
      ...skill.triggers.slice(0, 5),
      skill.triggers.slice(0, 3).join(' ')
    ].filter(q => q && q.length > 0);

    let bestRank = Infinity;
    let bestQuery = '';

    for (const query of testQueries) {
      const results = searchWithBoosts(engine, skills, query, 10);
      const rank = results.findIndex(r => r.id === skill.id);

      if (rank !== -1 && rank < bestRank) {
        bestRank = rank;
        bestQuery = query;
      }
    }

    coverageResults.push({
      skillId: skill.id,
      skillName: skill.name,
      category: skill.category,
      triggers: skill.triggers.slice(0, 3),
      bestQuery,
      bestRank: bestRank === Infinity ? -1 : bestRank + 1,
      covered: bestRank < TOP_N
    });
  }

  // Generate report
  const coveredTop5 = coverageResults.filter(r => r.bestRank > 0 && r.bestRank <= 5);
  const coveredTop10 = coverageResults.filter(r => r.bestRank > 0 && r.bestRank <= 10);
  const uncovered = coverageResults.filter(r => r.bestRank === -1 || r.bestRank > 10);

  console.log('='.repeat(60));
  console.log('SKILL COVERAGE REPORT');
  console.log('='.repeat(60));
  console.log();
  console.log(`Total Skills: ${skills.length}`);
  console.log(`Covered (rank ≤ 5): ${coveredTop5.length} (${(coveredTop5.length / skills.length * 100).toFixed(1)}%)`);
  console.log(`Covered (rank ≤ 10): ${coveredTop10.length} (${(coveredTop10.length / skills.length * 100).toFixed(1)}%)`);
  console.log(`Uncovered/Low Rank: ${uncovered.length} (${(uncovered.length / skills.length * 100).toFixed(1)}%)`);
  console.log();

  if (uncovered.length > 0) {
    console.log('-'.repeat(60));
    console.log('UNCOVERED/LOW-RANK SKILLS (need better triggers):');
    console.log('-'.repeat(60));

    for (const r of uncovered.slice(0, 20)) {
      console.log(`  ${r.skillId}`);
      console.log(`    Name: ${r.skillName}`);
      console.log(`    Category: ${r.category}`);
      console.log(`    Triggers: ${r.triggers.join(', ') || '(none)'}`);
      console.log(`    Best Rank: ${r.bestRank === -1 ? 'Not found' : r.bestRank}`);
      console.log();
    }

    if (uncovered.length > 20) {
      console.log(`  ... and ${uncovered.length - 20} more`);
    }
  }

  console.log('-'.repeat(60));
  console.log('COVERAGE BY CATEGORY:');
  console.log('-'.repeat(60));

  const categories = [...new Set(skills.map(s => s.category))].sort();
  for (const category of categories) {
    const categorySkills = coverageResults.filter(r => r.category === category);
    const categoryCovered = categorySkills.filter(r => r.covered);
    const pct = (categoryCovered.length / categorySkills.length * 100).toFixed(0);
    const bar = '█'.repeat(Math.floor(parseInt(pct) / 5)) + '░'.repeat(20 - Math.floor(parseInt(pct) / 5));
    console.log(`  ${category.padEnd(20)} ${bar} ${categoryCovered.length}/${categorySkills.length} (${pct}%)`);
  }

  console.log();
  console.log('='.repeat(60));
}

generateCoverageReport().catch(console.error);
