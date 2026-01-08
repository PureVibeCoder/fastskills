/**
 * Skill Index Generator
 * 
 * Scans all SKILL.md files and generates a searchable index
 * Run with: npx tsx scripts/generate-index.ts
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Stopwords for trigger extraction - expanded to avoid ambiguous triggers
const STOPWORDS = new Set([
  // Basic English stopwords
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
  'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
  'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 's', 't', 'just', 'don', 'now',
  'and', 'but', 'if', 'or', 'because', 'until', 'while', 'this', 'that',
  'these', 'those', 'it', 'its', 'use', 'using', 'used', 'skill', 'skills',
  'when', 'which', 'who', 'whom', 'your', 'you', 'what',
  // Overly generic words that cause ambiguity
  'any', 'them', 'also', 'like', 'get', 'got', 'set', 'way', 'about',
  'make', 'made', 'new', 'first', 'one', 'two', 'see', 'him', 'her',
  'they', 'their', 'my', 'me', 'our', 'we', 'out', 'up', 'down',
  'well', 'back', 'even', 'still', 'want', 'give', 'let', 'take',
  'come', 'came', 'keep', 'every', 'good', 'great', 'best', 'much',
  'many', 'over', 'under', 'between', 'into', 'through', 'both',
  'provides', 'provide', 'includes', 'include', 'including', 'allows',
  'enables', 'supports', 'support', 'offers', 'offer', 'help', 'helps',
  'based', 'various', 'different', 'specific', 'general', 'common',
  'available', 'multiple', 'several', 'wide', 'range', 'features',
  // Generic action words
  'create', 'creating', 'build', 'building', 'implement', 'implementing',
  'guide', 'guides', 'develop', 'developing', 'easy', 'simple', 'quick',
  // Frequently overused terms causing collision
  'data', 'analysis', 'toolkit', 'database', 'access', 'research',
  'python', 'api', 'query', 'comprehensive', 'search', 'files',
  'working', 'models', 'learning', 'framework', 'platform',
]);

// Source directory mapping
const SOURCE_DIRS: Record<string, string> = {
  'anthropic-skills': 'anthropic',
  'claudekit-skills': 'claudekit',
  'scientific-skills': 'scientific',
  'awesome-claude-skills': 'community',
  'composio-skills': 'composio',
  'obsidian-skills': 'obsidian',
  'voltagent-skills': 'voltagent',
  'superpowers': 'superpowers',
};

// Category inference from path
const CATEGORY_PATTERNS: Record<string, string[]> = {
  'frontend': ['frontend', 'ui', 'css', 'react', 'vue', 'design', 'styling'],
  'backend': ['backend', 'api', 'database', 'server', 'auth'],
  'testing': ['test', 'testing', 'qa', 'e2e', 'unit'],
  'devops': ['devops', 'deploy', 'docker', 'ci', 'cd', 'kubernetes'],
  'scientific': ['scientific', 'science', 'research'],
  'bioinformatics': ['bio', 'gene', 'protein', 'cell', 'dna', 'rna', 'seq'],
  'cheminformatics': ['chem', 'drug', 'molecule', 'rdkit', 'compound'],
  'clinical': ['clinical', 'health', 'medical', 'patient', 'disease'],
  'ml-ai': ['ml', 'ai', 'machine', 'learning', 'deep', 'neural', 'model'],
  'physics-materials': ['physics', 'quantum', 'material', 'astro'],
  'data-viz': ['viz', 'visual', 'plot', 'chart', 'graph', 'matplotlib'],
  'sci-databases': ['database', 'pubmed', 'uniprot', 'pdb', 'kegg'],
  'sci-communication': ['writing', 'paper', 'publication', 'latex', 'poster'],
  'lab-automation': ['lab', 'automation', 'robot', 'liquid', 'plate'],
  'document': ['doc', 'pdf', 'word', 'excel', 'ppt', 'document'],
  'knowledge': ['obsidian', 'note', 'knowledge', 'markdown', 'canvas'],
  'media': ['image', 'video', 'audio', 'media', 'gif'],
  'thinking': ['thinking', 'problem', 'debug', 'solving', 'analysis'],
  'tools': ['tool', 'browser', 'automation', 'mcp', 'utility'],
  'skill-dev': ['skill', 'creator', 'builder', 'plugin'],
};

interface SkillMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  source: string;
  triggers: string[];
  path: string;
  fullDescription?: string;
}

/**
 * Extract triggers from description text
 * Prioritizes: skill ID parts > unique domain terms > frequent words
 */
function extractTriggers(text: string, skillId: string): string[] {
  const idParts = skillId.toLowerCase()
    .split(/[-_]/)
    .filter(p => p.length > 2 && !STOPWORDS.has(p));
  
  const words = text.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .filter(w => !STOPWORDS.has(w));
  
  const wordCount = new Map<string, number>();
  for (const word of words) {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  }
  
  const sortedWords = [...wordCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
  
  const uniqueTriggers = [...new Set([...idParts, ...sortedWords])];
  
  return uniqueTriggers.slice(0, 10);
}

/**
 * Infer source from file path
 */
function inferSource(filePath: string): string {
  for (const [dir, source] of Object.entries(SOURCE_DIRS)) {
    if (filePath.includes(dir)) {
      return source;
    }
  }
  return 'unknown';
}

/**
 * Infer category from file path and description
 */
function inferCategory(filePath: string, description: string): string {
  const searchText = (filePath + ' ' + description).toLowerCase();
  
  const priorityOrder = [
    'bioinformatics',
    'cheminformatics', 
    'clinical',
    'ml-ai',
    'physics-materials',
    'data-viz',
    'sci-databases',
    'sci-communication',
    'lab-automation',
    'scientific',
    'frontend',
    'backend',
    'testing',
    'devops',
    'document',
    'knowledge',
    'media',
    'thinking',
    'tools',
    'skill-dev',
  ];
  
  for (const category of priorityOrder) {
    const patterns = CATEGORY_PATTERNS[category];
    if (!patterns) continue;
    for (const pattern of patterns) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      if (regex.test(searchText)) {
        return category;
      }
    }
  }
  
  return 'tools';
}

/**
 * Generate the skill index
 */
async function generateIndex(): Promise<void> {
  const projectRoot = path.resolve(__dirname, '../../..');
  const skills: SkillMeta[] = [];
  
  console.log('🔍 Scanning for SKILL.md files...');
  
  // Find all SKILL.md files (including hidden directories like .claude/)
  const skillFiles = await glob('**/SKILL.md', {
    cwd: projectRoot,
    ignore: [
      'node_modules/**',
      '.git/**',
      '**/.*/**/.git/**', // Ignore .git inside hidden dirs
      'packages/skills-router/**',
      'packages/website/**',
      'dist/**',
    ],
    absolute: true,
    dot: true, // Include hidden directories like .claude/
  });
  
  console.log(`📁 Found ${skillFiles.length} skill files`);
  
  for (const filePath of skillFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: body } = matter(content);
      
      // Extract name from frontmatter or directory name
      const dirName = path.basename(path.dirname(filePath));
      const name = data.name || dirName;
      const id = name.toLowerCase().replace(/\s+/g, '-');
      
      // Get description from frontmatter or first paragraph
      let description = data.description || '';
      if (!description) {
        // Extract first meaningful paragraph
        const lines = body.split('\n').filter(l => l.trim() && !l.startsWith('#'));
        description = lines.slice(0, 3).join(' ').slice(0, 500);
      }
      
      // Build skill metadata
      const skill: SkillMeta = {
        id,
        name,
        description: description.slice(0, 300),
        category: inferCategory(filePath, description),
        source: inferSource(filePath),
        triggers: extractTriggers(description + ' ' + name, id),
        path: path.dirname(filePath),
        fullDescription: body.slice(0, 2000),
      };
      
      skills.push(skill);
    } catch (error) {
      console.warn(`⚠️ Failed to parse ${filePath}:`, error);
    }
  }
  
  // Deduplicate by ID (keep first occurrence)
  const uniqueSkills = new Map<string, SkillMeta>();
  for (const skill of skills) {
    if (!uniqueSkills.has(skill.id)) {
      uniqueSkills.set(skill.id, skill);
    }
  }
  
  const finalSkills = [...uniqueSkills.values()];
  
  // Write output
  const outputPath = path.resolve(__dirname, '../src/data/skills.json');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(finalSkills, null, 2));
  
  console.log(`✅ Generated index with ${finalSkills.length} skills`);
  console.log(`📄 Output: ${outputPath}`);
  
  // Print category distribution
  const categoryCount = new Map<string, number>();
  for (const skill of finalSkills) {
    categoryCount.set(skill.category, (categoryCount.get(skill.category) || 0) + 1);
  }
  
  console.log('\n📊 Category distribution:');
  for (const [category, count] of [...categoryCount.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`   ${category}: ${count}`);
  }
}

// Run the generator
generateIndex().catch(console.error);
