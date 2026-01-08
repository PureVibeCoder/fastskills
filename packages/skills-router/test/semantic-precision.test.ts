import { describe, it, expect, beforeAll } from 'vitest';
import { SkillSearchEngine } from '../src/engine/search.js';
import { SkillMeta } from '../src/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SkillTriggerResult {
  skillId: string;
  skillName: string;
  category: string;
  triggers: string[];
  foundByTriggers: boolean;
  foundByDescription: boolean;
  foundById: boolean;
  topResultWhenSearched: boolean;
  rankWhenSearchedByTrigger: number;
  competingSkills: string[];
}

interface AmbiguityReport {
  query: string;
  matchedSkills: Array<{
    id: string;
    name: string;
    score: number;
    category: string;
  }>;
  hasAmbiguity: boolean;
  ambiguityReason?: string;
}

describe('Semantic Trigger Precision Tests', () => {
  let allSkills: SkillMeta[];
  let engine: SkillSearchEngine;
  const triggerResults: SkillTriggerResult[] = [];
  const ambiguityReports: AmbiguityReport[] = [];

  beforeAll(async () => {
    const skillsPath = path.join(__dirname, '..', 'src', 'data', 'skills.json');
    const content = await fs.readFile(skillsPath, 'utf-8');
    allSkills = JSON.parse(content);
    engine = new SkillSearchEngine(allSkills);
  });

  describe('Individual Skill Trigger Validation', () => {
    it('validates all skills can be found by their primary trigger', async () => {
      const failedSkills: string[] = [];
      const weakSkills: string[] = [];

      for (const skill of allSkills) {
        if (skill.triggers.length === 0) {
          failedSkills.push(`${skill.id} (no triggers)`);
          continue;
        }

        const primaryTrigger = skill.triggers[0];
        const results = engine.search(primaryTrigger, 10);
        
        const found = results.some(r => r.skill.id === skill.id);
        const rank = results.findIndex(r => r.skill.id === skill.id);
        
        if (!found) {
          failedSkills.push(`${skill.id} (trigger: "${primaryTrigger}")`);
        } else if (rank > 4) {
          weakSkills.push(`${skill.id} (rank: ${rank + 1}, trigger: "${primaryTrigger}")`);
        }

        triggerResults.push({
          skillId: skill.id,
          skillName: skill.name,
          category: skill.category,
          triggers: skill.triggers,
          foundByTriggers: found,
          foundByDescription: false,
          foundById: false,
          topResultWhenSearched: rank === 0,
          rankWhenSearchedByTrigger: rank === -1 ? 999 : rank + 1,
          competingSkills: results.slice(0, 5).filter(r => r.skill.id !== skill.id).map(r => r.skill.id)
        });
      }

      console.log('\n=== TRIGGER VALIDATION REPORT ===');
      console.log(`Total skills: ${allSkills.length}`);
      console.log(`Skills found by primary trigger: ${allSkills.length - failedSkills.length}`);
      console.log(`Skills NOT found by primary trigger: ${failedSkills.length}`);
      console.log(`Skills with weak ranking (>5): ${weakSkills.length}`);
      
      if (failedSkills.length > 0) {
        console.log('\nFailed skills (not found by trigger):');
        failedSkills.slice(0, 20).forEach(s => console.log(`  - ${s}`));
        if (failedSkills.length > 20) {
          console.log(`  ... and ${failedSkills.length - 20} more`);
        }
      }

      if (weakSkills.length > 0) {
        console.log('\nWeak skills (rank > 5):');
        weakSkills.slice(0, 20).forEach(s => console.log(`  - ${s}`));
        if (weakSkills.length > 20) {
          console.log(`  ... and ${weakSkills.length - 20} more`);
        }
      }

      const successRate = (allSkills.length - failedSkills.length) / allSkills.length;
      expect(successRate).toBeGreaterThan(0.8);
    });

    it('validates all skills can be found by their own ID', () => {
      const failedSkills: string[] = [];

      for (const skill of allSkills) {
        const results = engine.search(skill.id, 5);
        const isTopResult = results.length > 0 && results[0].skill.id === skill.id;
        
        if (!isTopResult) {
          failedSkills.push(skill.id);
        }
      }

      console.log('\n=== ID SEARCH VALIDATION ===');
      console.log(`Skills found as top result by ID: ${allSkills.length - failedSkills.length}/${allSkills.length}`);
      
      if (failedSkills.length > 0) {
        console.log('Skills NOT top result when searched by ID:');
        failedSkills.slice(0, 10).forEach(id => console.log(`  - ${id}`));
      }

      expect(failedSkills.length).toBeLessThan(allSkills.length * 0.1);
    });
  });

  describe('Ambiguity Detection Tests', () => {
    it('detects ambiguous triggers that match multiple skills', () => {
      const triggerFrequency: Record<string, string[]> = {};
      
      for (const skill of allSkills) {
        for (const trigger of skill.triggers) {
          const normalizedTrigger = trigger.toLowerCase();
          if (!triggerFrequency[normalizedTrigger]) {
            triggerFrequency[normalizedTrigger] = [];
          }
          triggerFrequency[normalizedTrigger].push(skill.id);
        }
      }

      const ambiguousTriggers = Object.entries(triggerFrequency)
        .filter(([_, skills]) => skills.length > 3)
        .sort((a, b) => b[1].length - a[1].length);

      console.log('\n=== AMBIGUOUS TRIGGERS (used by 4+ skills) ===');
      ambiguousTriggers.slice(0, 30).forEach(([trigger, skills]) => {
        console.log(`  "${trigger}": ${skills.length} skills`);
        console.log(`    → ${skills.slice(0, 5).join(', ')}${skills.length > 5 ? '...' : ''}`);
      });

      const veryAmbiguous = ambiguousTriggers.filter(([_, skills]) => skills.length > 10);
      console.log(`\nHighly ambiguous triggers (10+ skills): ${veryAmbiguous.length}`);
    });

    it('tests common query ambiguity scenarios', () => {
      const testQueries = [
        { query: 'analyze data', expectedCategories: ['ml-ai', 'data-viz', 'scientific'] },
        { query: 'machine learning', expectedCategories: ['ml-ai'] },
        { query: 'create component', expectedCategories: ['frontend'] },
        { query: 'test automation', expectedCategories: ['testing'] },
        { query: 'deploy application', expectedCategories: ['devops'] },
        { query: 'write documentation', expectedCategories: ['document', 'sci-communication'] },
        { query: 'protein analysis', expectedCategories: ['bioinformatics', 'scientific'] },
        { query: 'drug discovery', expectedCategories: ['cheminformatics', 'clinical'] },
        { query: 'sequence alignment', expectedCategories: ['bioinformatics'] },
        { query: 'visualization chart', expectedCategories: ['data-viz'] },
        { query: 'neural network training', expectedCategories: ['ml-ai'] },
        { query: 'database query', expectedCategories: ['sci-databases', 'backend'] },
        { query: 'browser automation', expectedCategories: ['testing', 'frontend'] },
        { query: 'api development', expectedCategories: ['backend'] },
        { query: 'image processing', expectedCategories: ['data-viz', 'ml-ai'] },
      ];

      console.log('\n=== QUERY AMBIGUITY ANALYSIS ===\n');

      for (const { query, expectedCategories } of testQueries) {
        const results = engine.search(query, 10);
        const topCategories = results.slice(0, 5).map(r => r.skill.category);
        const uniqueCategories = [...new Set(topCategories)];
        
        const matchesExpected = expectedCategories.some(cat => uniqueCategories.includes(cat));
        const unexpectedCategories = uniqueCategories.filter(cat => !expectedCategories.includes(cat));
        
        const report: AmbiguityReport = {
          query,
          matchedSkills: results.slice(0, 5).map(r => ({
            id: r.skill.id,
            name: r.skill.name,
            score: Math.round(r.score * 100) / 100,
            category: r.skill.category
          })),
          hasAmbiguity: uniqueCategories.length > 2,
          ambiguityReason: uniqueCategories.length > 2 
            ? `Returns ${uniqueCategories.length} different categories: ${uniqueCategories.join(', ')}`
            : undefined
        };
        
        ambiguityReports.push(report);

        console.log(`Query: "${query}"`);
        console.log(`  Expected: [${expectedCategories.join(', ')}]`);
        console.log(`  Got: [${uniqueCategories.join(', ')}]`);
        console.log(`  Match: ${matchesExpected ? '✓' : '✗'}, Ambiguous: ${report.hasAmbiguity ? 'YES' : 'no'}`);
        console.log(`  Top results:`);
        results.slice(0, 3).forEach((r, i) => {
          console.log(`    ${i + 1}. ${r.skill.id} (${r.skill.category}) - score: ${r.score.toFixed(2)}`);
        });
        console.log('');
      }
    });

    it('identifies skills with overlapping semantic space', () => {
      const categoryPairs: Record<string, Set<string>> = {};
      
      for (const skill of allSkills) {
        const results = engine.search(skill.triggers.slice(0, 3).join(' '), 10);
        const competitors = results
          .filter(r => r.skill.id !== skill.id && r.score > 0.5 * results[0].score)
          .map(r => r.skill.id);
        
        if (competitors.length > 0) {
          const key = `${skill.id}`;
          categoryPairs[key] = new Set(competitors);
        }
      }

      const highOverlap = Object.entries(categoryPairs)
        .filter(([_, competitors]) => competitors.size > 5)
        .sort((a, b) => b[1].size - a[1].size);

      console.log('\n=== HIGH OVERLAP SKILLS (5+ competitors with >50% score) ===');
      highOverlap.slice(0, 15).forEach(([skillId, competitors]) => {
        console.log(`  ${skillId}: ${competitors.size} competitors`);
        console.log(`    → ${[...competitors].slice(0, 5).join(', ')}`);
      });
    });
  });

  describe('Category-Specific Trigger Precision', () => {
    it('validates bioinformatics skills are triggered by bio queries', () => {
      const bioSkills = allSkills.filter(s => s.category === 'bioinformatics');
      const bioQueries = [
        'RNA sequencing analysis',
        'genomic data processing',
        'single cell transcriptomics',
        'sequence alignment blast',
        'gene expression analysis',
        'variant calling mutation',
        'phylogenetic tree construction',
      ];

      console.log('\n=== BIOINFORMATICS TRIGGER PRECISION ===');
      console.log(`Total bioinformatics skills: ${bioSkills.length}\n`);

      for (const query of bioQueries) {
        const results = engine.search(query, 10);
        const bioResults = results.filter(r => r.skill.category === 'bioinformatics');
        const precision = results.length > 0 ? bioResults.length / Math.min(5, results.length) : 0;
        
        console.log(`"${query}"`);
        console.log(`  Precision@5: ${(precision * 100).toFixed(1)}% (${bioResults.slice(0, 5).length}/5 are bio)`);
        console.log(`  Top 3: ${results.slice(0, 3).map(r => `${r.skill.id}(${r.skill.category})`).join(', ')}`);
      }
    });

    it('validates cheminformatics skills are triggered by chemistry queries', () => {
      const chemSkills = allSkills.filter(s => s.category === 'cheminformatics');
      const chemQueries = [
        'molecular docking simulation',
        'SMILES structure generation',
        'drug compound screening',
        'chemical property prediction',
        'ligand binding affinity',
      ];

      console.log('\n=== CHEMINFORMATICS TRIGGER PRECISION ===');
      console.log(`Total cheminformatics skills: ${chemSkills.length}\n`);

      for (const query of chemQueries) {
        const results = engine.search(query, 10);
        const chemResults = results.filter(r => r.skill.category === 'cheminformatics');
        const precision = results.length > 0 ? chemResults.length / Math.min(5, results.length) : 0;
        
        console.log(`"${query}"`);
        console.log(`  Precision@5: ${(precision * 100).toFixed(1)}% (${chemResults.slice(0, 5).length}/5 are chem)`);
        console.log(`  Top 3: ${results.slice(0, 3).map(r => `${r.skill.id}(${r.skill.category})`).join(', ')}`);
      }
    });

    it('validates ML skills are triggered by ML queries', () => {
      const mlSkills = allSkills.filter(s => s.category === 'ml-ai');
      const mlQueries = [
        'train neural network model',
        'deep learning pytorch',
        'tensorflow keras training',
        'random forest classifier',
        'gradient descent optimization',
        'transformer attention mechanism',
      ];

      console.log('\n=== ML/AI TRIGGER PRECISION ===');
      console.log(`Total ML/AI skills: ${mlSkills.length}\n`);

      for (const query of mlQueries) {
        const results = engine.search(query, 10);
        const mlResults = results.filter(r => r.skill.category === 'ml-ai');
        const precision = results.length > 0 ? mlResults.length / Math.min(5, results.length) : 0;
        
        console.log(`"${query}"`);
        console.log(`  Precision@5: ${(precision * 100).toFixed(1)}% (${mlResults.slice(0, 5).length}/5 are ML)`);
        console.log(`  Top 3: ${results.slice(0, 3).map(r => `${r.skill.id}(${r.skill.category})`).join(', ')}`);
      }
    });

    it('validates frontend skills are triggered by frontend queries', () => {
      const frontendSkills = allSkills.filter(s => s.category === 'frontend');
      const frontendQueries = [
        'react component design',
        'vue.js application',
        'css styling layout',
        'responsive web design',
        'UI UX interface',
      ];

      console.log('\n=== FRONTEND TRIGGER PRECISION ===');
      console.log(`Total frontend skills: ${frontendSkills.length}\n`);

      for (const query of frontendQueries) {
        const results = engine.search(query, 10);
        const frontendResults = results.filter(r => r.skill.category === 'frontend');
        const precision = results.length > 0 ? frontendResults.length / Math.min(5, results.length) : 0;
        
        console.log(`"${query}"`);
        console.log(`  Precision@5: ${(precision * 100).toFixed(1)}% (${frontendResults.slice(0, 5).length}/5 are frontend)`);
        console.log(`  Top 3: ${results.slice(0, 3).map(r => `${r.skill.id}(${r.skill.category})`).join(', ')}`);
      }
    });
  });

  describe('False Positive Detection', () => {
    it('detects unrelated skills appearing in top results', () => {
      const testCases = [
        { query: 'protein structure prediction', unwantedCategories: ['frontend', 'devops', 'media'] },
        { query: 'react component testing', unwantedCategories: ['bioinformatics', 'cheminformatics', 'clinical'] },
        { query: 'docker kubernetes deployment', unwantedCategories: ['bioinformatics', 'cheminformatics'] },
        { query: 'drug discovery screening', unwantedCategories: ['frontend', 'devops', 'testing'] },
        { query: 'gene expression analysis', unwantedCategories: ['frontend', 'devops', 'media'] },
      ];

      console.log('\n=== FALSE POSITIVE DETECTION ===\n');

      let totalFalsePositives = 0;
      let totalTests = 0;

      for (const { query, unwantedCategories } of testCases) {
        const results = engine.search(query, 5);
        const falsePositives = results.filter(r => unwantedCategories.includes(r.skill.category));
        
        totalTests += results.length;
        totalFalsePositives += falsePositives.length;

        if (falsePositives.length > 0) {
          console.log(`"${query}"`);
          console.log(`  FALSE POSITIVES (${falsePositives.length}):`);
          falsePositives.forEach(fp => {
            console.log(`    - ${fp.skill.id} (${fp.skill.category}) - score: ${fp.score.toFixed(2)}`);
          });
        } else {
          console.log(`"${query}" - No false positives ✓`);
        }
      }

      const falsePositiveRate = totalFalsePositives / totalTests;
      console.log(`\nOverall false positive rate: ${(falsePositiveRate * 100).toFixed(1)}% (${totalFalsePositives}/${totalTests})`);
      
      expect(falsePositiveRate).toBeLessThan(0.2);
    });
  });

  describe('Score Distribution Analysis', () => {
    it('analyzes score gaps between top results', () => {
      const testQueries = [
        'single cell RNA analysis scanpy',
        'molecular docking rdkit',
        'react component design',
        'pytorch deep learning',
        'playwright browser testing',
      ];

      console.log('\n=== SCORE DISTRIBUTION ANALYSIS ===\n');

      for (const query of testQueries) {
        const results = engine.search(query, 10);
        
        if (results.length < 2) continue;

        const topScore = results[0].score;
        const scores = results.map(r => r.score);
        const scoreGaps = scores.slice(0, -1).map((s, i) => s - scores[i + 1]);
        const avgGap = scoreGaps.reduce((a, b) => a + b, 0) / scoreGaps.length;
        const firstGap = scoreGaps[0];
        const scoreRatios = scores.map(s => (s / topScore * 100).toFixed(1) + '%');

        console.log(`"${query}"`);
        console.log(`  Top score: ${topScore.toFixed(2)}`);
        console.log(`  Score ratios: ${scoreRatios.slice(0, 5).join(', ')}`);
        console.log(`  Gap after #1: ${firstGap.toFixed(2)} (${((firstGap / topScore) * 100).toFixed(1)}% of top)`);
        console.log(`  Is clear winner: ${firstGap > topScore * 0.3 ? 'YES ✓' : 'NO - ambiguous'}`);
        console.log(`  Top 3: ${results.slice(0, 3).map(r => r.skill.id).join(', ')}`);
        console.log('');
      }
    });
  });

  describe('Comprehensive Skill-by-Skill Report', () => {
    it('generates full trigger report for all skills', () => {
      const report: Array<{
        id: string;
        category: string;
        primaryTrigger: string;
        rankByTrigger: number;
        rankById: number;
        topCompetitor: string;
        competitorCategory: string;
        scoreRatio: string;
        status: 'GOOD' | 'WEAK' | 'FAILED';
      }> = [];

      for (const skill of allSkills) {
        const primaryTrigger = skill.triggers[0] || skill.id;
        
        const triggerResults = engine.search(primaryTrigger, 10);
        const triggerRank = triggerResults.findIndex(r => r.skill.id === skill.id);
        
        const idResults = engine.search(skill.id, 5);
        const idRank = idResults.findIndex(r => r.skill.id === skill.id);
        
        const topCompetitor = triggerResults.find(r => r.skill.id !== skill.id);
        const skillResult = triggerResults.find(r => r.skill.id === skill.id);
        const scoreRatio = skillResult && topCompetitor 
          ? ((skillResult.score / topCompetitor.score) * 100).toFixed(0) + '%'
          : 'N/A';

        let status: 'GOOD' | 'WEAK' | 'FAILED';
        if (triggerRank === -1) {
          status = 'FAILED';
        } else if (triggerRank > 4) {
          status = 'WEAK';
        } else {
          status = 'GOOD';
        }

        report.push({
          id: skill.id,
          category: skill.category,
          primaryTrigger,
          rankByTrigger: triggerRank === -1 ? 999 : triggerRank + 1,
          rankById: idRank === -1 ? 999 : idRank + 1,
          topCompetitor: topCompetitor?.skill.id || 'none',
          competitorCategory: topCompetitor?.skill.category || 'N/A',
          scoreRatio,
          status
        });
      }

      const good = report.filter(r => r.status === 'GOOD').length;
      const weak = report.filter(r => r.status === 'WEAK').length;
      const failed = report.filter(r => r.status === 'FAILED').length;

      console.log('\n=== COMPREHENSIVE SKILL TRIGGER REPORT ===\n');
      console.log(`Total skills: ${report.length}`);
      console.log(`GOOD (rank 1-5): ${good} (${(good / report.length * 100).toFixed(1)}%)`);
      console.log(`WEAK (rank 6+): ${weak} (${(weak / report.length * 100).toFixed(1)}%)`);
      console.log(`FAILED (not found): ${failed} (${(failed / report.length * 100).toFixed(1)}%)`);

      console.log('\n--- FAILED SKILLS ---');
      report.filter(r => r.status === 'FAILED').forEach(r => {
        console.log(`  ${r.id} [${r.category}]`);
        console.log(`    trigger: "${r.primaryTrigger}", top competitor: ${r.topCompetitor}`);
      });

      console.log('\n--- WEAK SKILLS (top 20) ---');
      report.filter(r => r.status === 'WEAK')
        .sort((a, b) => a.rankByTrigger - b.rankByTrigger)
        .slice(0, 20)
        .forEach(r => {
          console.log(`  ${r.id} [${r.category}] - rank: ${r.rankByTrigger}`);
          console.log(`    trigger: "${r.primaryTrigger}", score vs competitor: ${r.scoreRatio}`);
        });

      console.log('\n--- CATEGORY BREAKDOWN ---');
      const categoryStats: Record<string, { good: number; weak: number; failed: number }> = {};
      for (const r of report) {
        if (!categoryStats[r.category]) {
          categoryStats[r.category] = { good: 0, weak: 0, failed: 0 };
        }
        categoryStats[r.category][r.status.toLowerCase() as 'good' | 'weak' | 'failed']++;
      }
      
      Object.entries(categoryStats)
        .sort((a, b) => (b[1].good / (b[1].good + b[1].weak + b[1].failed)) - (a[1].good / (a[1].good + a[1].weak + a[1].failed)))
        .forEach(([cat, stats]) => {
          const total = stats.good + stats.weak + stats.failed;
          const successRate = ((stats.good / total) * 100).toFixed(0);
          console.log(`  ${cat}: ${successRate}% good (${stats.good}/${total}), ${stats.weak} weak, ${stats.failed} failed`);
        });

      expect(failed / report.length).toBeLessThan(0.15);
      expect((good + weak) / report.length).toBeGreaterThan(0.85);
    });
  });
});
