#!/usr/bin/env npx tsx
/**
 * FastSkills Router V2 - Deterministic Routing Engine
 * 
 * This module provides programmatic routing based on keyword and pattern matching.
 * It removes the "LLM matching" responsibility, making routing reliable and testable.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types
interface RouteMatch {
  keywords: string[];
  patterns?: string[];
}

interface Route {
  id: string;
  priority: number;
  match: RouteMatch;
  load: string[];
  description: string;
}

interface RoutesConfig {
  version: string;
  routes: Route[];
}

interface RouterResult {
  matched: boolean;
  skills: string[];
  routes: string[];
  confidence: number;
  reason: string;
  debug?: {
    normalizedInput: string;
    matchedKeywords: string[];
    matchedPatterns: string[];
  };
}

// Load routes configuration
function loadRoutes(): RoutesConfig {
  const routesPath = path.join(__dirname, 'routes.json');
  const content = fs.readFileSync(routesPath, 'utf-8');
  return JSON.parse(content);
}

// Normalize input for matching
function normalizeInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff]/g, ' ') // Keep alphanumeric, spaces, and Chinese chars
    .replace(/\s+/g, ' ')
    .trim();
}

// Check if input matches a route
function matchRoute(input: string, route: Route): { matched: boolean; keywords: string[]; patterns: string[] } {
  const normalizedInput = normalizeInput(input);
  const matchedKeywords: string[] = [];
  const matchedPatterns: string[] = [];

  // Keyword matching (case-insensitive substring)
  for (const keyword of route.match.keywords) {
    const normalizedKeyword = keyword.toLowerCase();
    if (normalizedInput.includes(normalizedKeyword)) {
      matchedKeywords.push(keyword);
    }
  }

  // Pattern matching (regex)
  if (route.match.patterns) {
    for (const pattern of route.match.patterns) {
      try {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(input)) {
          matchedPatterns.push(pattern);
        }
      } catch {
        // Invalid regex, skip
      }
    }
  }

  return {
    matched: matchedKeywords.length > 0 || matchedPatterns.length > 0,
    keywords: matchedKeywords,
    patterns: matchedPatterns,
  };
}

// Main routing function
export function routeIntent(userInput: string, debug = false): RouterResult {
  const config = loadRoutes();
  const normalizedInput = normalizeInput(userInput);
  
  const matchedRoutes: Array<{ route: Route; keywords: string[]; patterns: string[] }> = [];

  // Check each route
  for (const route of config.routes) {
    const result = matchRoute(userInput, route);
    if (result.matched) {
      matchedRoutes.push({
        route,
        keywords: result.keywords,
        patterns: result.patterns,
      });
    }
  }

  // Sort by priority (descending)
  matchedRoutes.sort((a, b) => b.route.priority - a.route.priority);

  // Merge skills (dedupe while preserving order)
  const skillsSet = new Set<string>();
  const skills: string[] = [];
  for (const match of matchedRoutes) {
    for (const skill of match.route.load) {
      if (!skillsSet.has(skill)) {
        skillsSet.add(skill);
        skills.push(skill);
      }
    }
  }

  // Calculate confidence
  const topPriority = matchedRoutes[0]?.route.priority ?? 0;
  const confidence = matchedRoutes.length > 0
    ? Math.min(1, topPriority / 100 + matchedRoutes.length * 0.1)
    : 0;

  // Build result
  const result: RouterResult = {
    matched: skills.length > 0,
    skills,
    routes: matchedRoutes.map(m => m.route.id),
    confidence: Math.round(confidence * 100) / 100,
    reason: matchedRoutes.length > 0
      ? `Matched: ${matchedRoutes.map(m => m.route.id).join(', ')}`
      : 'No matching routes',
  };

  if (debug) {
    result.debug = {
      normalizedInput,
      matchedKeywords: matchedRoutes.flatMap(m => m.keywords),
      matchedPatterns: matchedRoutes.flatMap(m => m.patterns),
    };
  }

  return result;
}

// Format result for Claude output
export function formatRouterOutput(result: RouterResult, format: 'emoji' | 'json' | 'comment' = 'emoji'): string {
  const skillsStr = result.matched ? result.skills.join(', ') : '(none)';

  switch (format) {
    case 'json':
      return JSON.stringify({
        _fastskills: {
          skills: result.skills,
          routes: result.routes,
          confidence: result.confidence,
        }
      });
    
    case 'comment':
      return `// FastSkills: ${skillsStr}`;
    
    case 'emoji':
    default:
      return `📦 已加载技能: ${skillsStr}`;
  }
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npx tsx router.ts <user-input> [--debug] [--format=emoji|json|comment]');
    console.log('\nExamples:');
    console.log('  npx tsx router.ts "帮我写一个React组件"');
    console.log('  npx tsx router.ts "生成市场研究报告" --debug');
    console.log('  npx tsx router.ts "create API endpoint" --format=json');
    process.exit(1);
  }

  const userInput = args[0];
  const debug = args.includes('--debug');
  const formatArg = args.find(a => a.startsWith('--format='));
  const format = (formatArg?.split('=')[1] as 'emoji' | 'json' | 'comment') || 'emoji';

  const result = routeIntent(userInput, debug);
  
  if (debug) {
    console.log('\n=== Debug Info ===');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n=== Output ===');
  }

  console.log(formatRouterOutput(result, format));
}

// Run if executed directly
if (process.argv[1]?.endsWith('router.ts')) {
  main().catch(console.error);
}
