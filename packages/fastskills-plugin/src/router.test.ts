#!/usr/bin/env npx tsx
/**
 * FastSkills Router V2 - Test Suite
 * 
 * Run with: npx tsx router.test.ts
 */

import { routeIntent, formatRouterOutput } from './router.js';

interface TestCase {
  input: string;
  expectedSkills: string[];
  expectedRoutes: string[];
  description: string;
}

const testCases: TestCase[] = [
  // Market Research
  {
    input: '生成一份市场研究报告',
    expectedSkills: ['market-research-reports', 'research-executor'],
    expectedRoutes: ['market-research'],
    description: 'Market research report (Chinese)',
  },
  {
    input: 'Create a competitive analysis report',
    expectedSkills: ['market-research-reports', 'research-executor'],
    expectedRoutes: ['market-research'],
    description: 'Competitive analysis (English)',
  },

  // React Components
  {
    input: '帮我写一个React登录组件',
    expectedSkills: ['react-components', 'frontend-designer'],
    expectedRoutes: ['react-components'],
    description: 'React component (Chinese)',
  },
  {
    input: 'Create a React form with useState hooks',
    expectedSkills: ['react-components', 'frontend-designer'],
    expectedRoutes: ['react-components'],
    description: 'React with hooks (English)',
  },

  // Debugging
  {
    input: '这段代码有bug，帮我调试一下',
    expectedSkills: ['systematic-debugging', 'root-cause-tracing'],
    expectedRoutes: ['debugging'],
    description: 'Debug code (Chinese)',
  },
  {
    input: 'Fix this error in my code',
    expectedSkills: ['systematic-debugging', 'root-cause-tracing'],
    expectedRoutes: ['debugging'],
    description: 'Fix error (English)',
  },

  // Single Cell Analysis
  {
    input: '用Scanpy分析单细胞RNA-seq数据',
    expectedSkills: ['scanpy', 'biopython'],
    expectedRoutes: ['single-cell'],
    description: 'Single cell analysis (Chinese)',
  },

  // Backend
  {
    input: 'Design a REST API for user management',
    expectedSkills: ['backend-development', 'databases'],
    expectedRoutes: ['backend'],
    description: 'REST API design (English)',
  },
  {
    input: '帮我设计一个PostgreSQL数据库',
    expectedSkills: ['backend-development', 'databases'],
    expectedRoutes: ['backend'],
    description: 'Database design (Chinese)',
  },

  // Testing
  {
    input: '用TDD方式写单元测试',
    expectedSkills: ['test-driven-development', 'verification-before-completion'],
    expectedRoutes: ['testing'],
    description: 'TDD testing (Chinese)',
  },

  // Multi-route matching
  {
    input: '写一个React组件用于数据可视化',
    expectedSkills: ['react-components', 'frontend-designer', 'matplotlib', 'plotly', 'scientific-visualization'],
    expectedRoutes: ['react-components', 'visualization'],
    description: 'React + Visualization (multi-match)',
  },

  // No match
  {
    input: '今天天气怎么样',
    expectedSkills: [],
    expectedRoutes: [],
    description: 'No match (weather question)',
  },
  {
    input: 'Hello, how are you?',
    expectedSkills: [],
    expectedRoutes: [],
    description: 'No match (greeting)',
  },
];

function runTests(): { passed: number; failed: number; results: string[] } {
  let passed = 0;
  let failed = 0;
  const results: string[] = [];

  for (const testCase of testCases) {
    const result = routeIntent(testCase.input);
    
    // Check skills match
    const skillsMatch = 
      testCase.expectedSkills.length === 0 
        ? result.skills.length === 0
        : testCase.expectedSkills.every(s => result.skills.includes(s));
    
    // Check routes match
    const routesMatch = 
      testCase.expectedRoutes.length === 0
        ? result.routes.length === 0
        : testCase.expectedRoutes.every(r => result.routes.includes(r));

    const success = skillsMatch && routesMatch;

    if (success) {
      passed++;
      results.push(`✅ ${testCase.description}`);
    } else {
      failed++;
      results.push(`❌ ${testCase.description}`);
      results.push(`   Input: "${testCase.input}"`);
      results.push(`   Expected skills: [${testCase.expectedSkills.join(', ')}]`);
      results.push(`   Got skills: [${result.skills.join(', ')}]`);
      results.push(`   Expected routes: [${testCase.expectedRoutes.join(', ')}]`);
      results.push(`   Got routes: [${result.routes.join(', ')}]`);
    }
  }

  return { passed, failed, results };
}

function testFormatOutput() {
  console.log('\n=== Format Output Tests ===\n');
  
  const result = routeIntent('帮我写一个React组件');
  
  console.log('Emoji format:');
  console.log(formatRouterOutput(result, 'emoji'));
  
  console.log('\nJSON format:');
  console.log(formatRouterOutput(result, 'json'));
  
  console.log('\nComment format:');
  console.log(formatRouterOutput(result, 'comment'));
  
  console.log('\nNo match format:');
  const noMatch = routeIntent('今天天气怎么样');
  console.log(formatRouterOutput(noMatch, 'emoji'));
}

// Main
console.log('🧪 FastSkills Router V2 - Test Suite\n');
console.log('='.repeat(50));

const { passed, failed, results } = runTests();

console.log('\n=== Test Results ===\n');
for (const r of results) {
  console.log(r);
}

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Summary: ${passed} passed, ${failed} failed, ${testCases.length} total`);

if (failed > 0) {
  console.log('\n⚠️  Some tests failed!');
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed!');
}

testFormatOutput();
