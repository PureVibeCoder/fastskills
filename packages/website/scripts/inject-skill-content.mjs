#!/usr/bin/env node
/**
 * 注入完整的 SKILL.md 内容到 skills.ts
 * 解决生产环境无法读取 git submodule 文件的问题
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../..');
const skillsPath = path.join(__dirname, '../src/data/skills.ts');

// 源目录映射（与 skill-sources.ts 和 api/skill-content.ts 保持一致）
const SOURCE_BASE_PATHS = {
  'anthropic': path.join(projectRoot, 'anthropic-skills/skills'),
  'claudekit': path.join(projectRoot, 'claudekit-skills/.claude/skills'),
  'scientific': path.join(projectRoot, 'scientific-skills/scientific-skills'),
  'community': path.join(projectRoot, 'awesome-claude-skills'),
  'composio': path.join(projectRoot, 'composio-skills/skills'),
  'voltagent': path.join(projectRoot, 'voltagent-skills/skills'),
  'obsidian': path.join(projectRoot, 'obsidian-skills/skills'),
  'planning': path.join(projectRoot, 'planning-with-files'),
  'deep-research': path.join(projectRoot, 'deep-research-skills/.claude/skills'),
  'superpowers': path.join(projectRoot, 'superpowers/skills'),
  'skill-from-masters': path.join(projectRoot, 'skill-from-masters/skill-from-masters'),
};

// 从 skill-sources.ts 导入映射
const SKILL_TO_SOURCE = {
  // anthropic skills
  'algorithmic-art': { source: 'anthropic', path: 'algorithmic-art' },
  'brand-guidelines': { source: 'anthropic', path: 'brand-guidelines' },
  'canvas-design': { source: 'anthropic', path: 'canvas-design' },
  'doc-coauthoring': { source: 'anthropic', path: 'doc-coauthoring' },
  'docx': { source: 'anthropic', path: 'docx' },
  'frontend-design': { source: 'anthropic', path: 'frontend-design' },
  'internal-comms': { source: 'anthropic', path: 'internal-comms' },
  'mcp-builder': { source: 'anthropic', path: 'mcp-builder' },
  'modern-frontend-design': { source: 'anthropic', path: 'modern-frontend-design' },
  'pdf': { source: 'anthropic', path: 'pdf' },
  'pptx': { source: 'anthropic', path: 'pptx' },
  'skill-creator': { source: 'anthropic', path: 'skill-creator' },
  'slack-gif-creator': { source: 'anthropic', path: 'slack-gif-creator' },
  'theme-factory': { source: 'anthropic', path: 'theme-factory' },
  'web-artifacts-builder': { source: 'anthropic', path: 'web-artifacts-builder' },
  'webapp-testing': { source: 'anthropic', path: 'webapp-testing' },
  'xlsx': { source: 'anthropic', path: 'xlsx' },
  // claudekit skills
  'aesthetic': { source: 'claudekit', path: 'aesthetic' },
  'ai-multimodal': { source: 'claudekit', path: 'ai-multimodal' },
  'backend-development': { source: 'claudekit', path: 'backend-development' },
  'better-auth': { source: 'claudekit', path: 'better-auth' },
  'chrome-devtools': { source: 'claudekit', path: 'chrome-devtools' },
  'claude-code': { source: 'claudekit', path: 'claude-code' },
  'code-review': { source: 'claudekit', path: 'code-review' },
  'collision-zone-thinking': { source: 'claudekit', path: 'problem-solving/collision-zone-thinking' },
  'context-engineering': { source: 'claudekit', path: 'context-engineering' },
  'database-design': { source: 'claudekit', path: 'databases' },
  'databases': { source: 'claudekit', path: 'databases' },
  'defense-in-depth': { source: 'claudekit', path: 'debugging/defense-in-depth' },
  'devops': { source: 'claudekit', path: 'devops' },
  'docs-seeker': { source: 'claudekit', path: 'docs-seeker' },
  'frontend-development': { source: 'claudekit', path: 'frontend-development' },
  'google-adk-python': { source: 'claudekit', path: 'google-adk-python' },
  'inversion-exercise': { source: 'claudekit', path: 'problem-solving/inversion-exercise' },
  'mcp-management': { source: 'claudekit', path: 'mcp-management' },
  'media-processing': { source: 'claudekit', path: 'media-processing' },
  'mermaidjs-v11': { source: 'claudekit', path: 'mermaidjs-v11' },
  'meta-pattern-recognition': { source: 'claudekit', path: 'problem-solving/meta-pattern-recognition' },
  'repomix': { source: 'claudekit', path: 'repomix' },
  'root-cause-tracing': { source: 'claudekit', path: 'debugging/root-cause-tracing' },
  'scale-game': { source: 'claudekit', path: 'problem-solving/scale-game' },
  'sequential-thinking': { source: 'claudekit', path: 'sequential-thinking' },
  'shopify': { source: 'claudekit', path: 'shopify' },
  'simplification-cascades': { source: 'claudekit', path: 'problem-solving/simplification-cascades' },
  'systematic-debugging': { source: 'claudekit', path: 'debugging/systematic-debugging' },
  'ui-styling': { source: 'claudekit', path: 'ui-styling' },
  'verification-before-completion': { source: 'claudekit', path: 'debugging/verification-before-completion' },
  'web-frameworks': { source: 'claudekit', path: 'web-frameworks' },
  'when-stuck': { source: 'claudekit', path: 'problem-solving/when-stuck' },
  // community skills
  'artifacts-builder': { source: 'community', path: 'artifacts-builder' },
  'browser-automation': { source: 'community', path: 'browser-automation' },
  'changelog-generator': { source: 'community', path: 'changelog-generator' },
  'competitive-ads-extractor': { source: 'community', path: 'competitive-ads-extractor' },
  'content-research-writer': { source: 'community', path: 'content-research-writer' },
  'developer-growth-analysis': { source: 'community', path: 'developer-growth-analysis' },
  'docker': { source: 'community', path: 'docker' },
  'domain-name-brainstormer': { source: 'community', path: 'domain-name-brainstormer' },
  'file-organizer': { source: 'community', path: 'file-organizer' },
  'image-enhancer': { source: 'community', path: 'image-enhancer' },
  'invoice-organizer': { source: 'community', path: 'invoice-organizer' },
  'lead-research-assistant': { source: 'community', path: 'lead-research-assistant' },
  'meeting-insights-analyzer': { source: 'community', path: 'meeting-insights-analyzer' },
  'raffle-winner-picker': { source: 'community', path: 'raffle-winner-picker' },
  'react-components': { source: 'community', path: 'react-components' },
  'skill-share': { source: 'community', path: 'skill-share' },
  'video-downloader': { source: 'community', path: 'video-downloader' },
  // scientific skills
  'adaptyv': { source: 'scientific', path: 'adaptyv' },
  'aeon': { source: 'scientific', path: 'aeon' },
  'alphafold-database': { source: 'scientific', path: 'alphafold-database' },
  'anndata': { source: 'scientific', path: 'anndata' },
  'arboreto': { source: 'scientific', path: 'arboreto' },
  'astropy': { source: 'scientific', path: 'astropy' },
  'benchling-integration': { source: 'scientific', path: 'benchling-integration' },
  'biomni': { source: 'scientific', path: 'biomni' },
  'biopython': { source: 'scientific', path: 'biopython' },
  'biorxiv-database': { source: 'scientific', path: 'biorxiv-database' },
  'bioservices': { source: 'scientific', path: 'bioservices' },
  'brenda-database': { source: 'scientific', path: 'brenda-database' },
  'cellxgene-census': { source: 'scientific', path: 'cellxgene-census' },
  'chembl-database': { source: 'scientific', path: 'chembl-database' },
  'cirq': { source: 'scientific', path: 'cirq' },
  'citation-management': { source: 'scientific', path: 'citation-management' },
  'clinical-decision-support': { source: 'scientific', path: 'clinical-decision-support' },
  'clinical-reports': { source: 'scientific', path: 'clinical-reports' },
  'clinicaltrials-database': { source: 'scientific', path: 'clinicaltrials-database' },
  'clinpgx-database': { source: 'scientific', path: 'clinpgx-database' },
  'clinvar-database': { source: 'scientific', path: 'clinvar-database' },
  'cobrapy': { source: 'scientific', path: 'cobrapy' },
  'cosmic-database': { source: 'scientific', path: 'cosmic-database' },
  'dask': { source: 'scientific', path: 'dask' },
  'datacommons-client': { source: 'scientific', path: 'datacommons-client' },
  'datamol': { source: 'scientific', path: 'datamol' },
  'deepchem': { source: 'scientific', path: 'deepchem' },
  'deeptools': { source: 'scientific', path: 'deeptools' },
  'denario': { source: 'scientific', path: 'denario' },
  'diffdock': { source: 'scientific', path: 'diffdock' },
  'dnanexus-integration': { source: 'scientific', path: 'dnanexus-integration' },
  'drugbank-database': { source: 'scientific', path: 'drugbank-database' },
  'ena-database': { source: 'scientific', path: 'ena-database' },
  'ensembl-database': { source: 'scientific', path: 'ensembl-database' },
  'esm': { source: 'scientific', path: 'esm' },
  'etetoolkit': { source: 'scientific', path: 'etetoolkit' },
  'exploratory-data-analysis': { source: 'scientific', path: 'exploratory-data-analysis' },
  'fda-database': { source: 'scientific', path: 'fda-database' },
  'flowio': { source: 'scientific', path: 'flowio' },
  'fluidsim': { source: 'scientific', path: 'fluidsim' },
  'gene-database': { source: 'scientific', path: 'gene-database' },
  'ncbi-gene-database': { source: 'scientific', path: 'gene-database' },
  'generate-image': { source: 'scientific', path: 'generate-image' },
  'geniml': { source: 'scientific', path: 'geniml' },
  'geo-database': { source: 'scientific', path: 'geo-database' },
  'geopandas': { source: 'scientific', path: 'geopandas' },
  'get-available-resources': { source: 'scientific', path: 'get-available-resources' },
  'gget': { source: 'scientific', path: 'gget' },
  'gtars': { source: 'scientific', path: 'gtars' },
  'gwas-database': { source: 'scientific', path: 'gwas-database' },
  'histolab': { source: 'scientific', path: 'histolab' },
  'hmdb-database': { source: 'scientific', path: 'hmdb-database' },
  'hypogenic': { source: 'scientific', path: 'hypogenic' },
  'hypothesis-generation': { source: 'scientific', path: 'hypothesis-generation' },
  'iso-13485-certification': { source: 'scientific', path: 'iso-13485-certification' },
  'kegg-database': { source: 'scientific', path: 'kegg-database' },
  'labarchive-integration': { source: 'scientific', path: 'labarchive-integration' },
  'lamindb': { source: 'scientific', path: 'lamindb' },
  'latchbio-integration': { source: 'scientific', path: 'latchbio-integration' },
  'latex-posters': { source: 'scientific', path: 'latex-posters' },
  'literature-review': { source: 'scientific', path: 'literature-review' },
  'market-research-reports': { source: 'scientific', path: 'market-research-reports' },
  'markitdown': { source: 'scientific', path: 'markitdown' },
  'matchms': { source: 'scientific', path: 'matchms' },
  'matplotlib': { source: 'scientific', path: 'matplotlib' },
  'medchem': { source: 'scientific', path: 'medchem' },
  'metabolomics-workbench-database': { source: 'scientific', path: 'metabolomics-workbench-database' },
  'modal': { source: 'scientific', path: 'modal' },
  'molfeat': { source: 'scientific', path: 'molfeat' },
  'networkx': { source: 'scientific', path: 'networkx' },
  'neurokit2': { source: 'scientific', path: 'neurokit2' },
  'neuropixels-analysis': { source: 'scientific', path: 'neuropixels-analysis' },
  'omero-integration': { source: 'scientific', path: 'omero-integration' },
  'openalex-database': { source: 'scientific', path: 'openalex-database' },
  'opentargets-database': { source: 'scientific', path: 'opentargets-database' },
  'opentrons-integration': { source: 'scientific', path: 'opentrons-integration' },
  'paper-2-web': { source: 'scientific', path: 'paper-2-web' },
  'pathml': { source: 'scientific', path: 'pathml' },
  'pdb-database': { source: 'scientific', path: 'pdb-database' },
  'peer-review': { source: 'scientific', path: 'peer-review' },
  'pennylane': { source: 'scientific', path: 'pennylane' },
  'perplexity-search': { source: 'scientific', path: 'perplexity-search' },
  'plotly': { source: 'scientific', path: 'plotly' },
  'polars': { source: 'scientific', path: 'polars' },
  'pptx-posters': { source: 'scientific', path: 'pptx-posters' },
  'protocolsio-integration': { source: 'scientific', path: 'protocolsio-integration' },
  'pubchem-database': { source: 'scientific', path: 'pubchem-database' },
  'pubmed-database': { source: 'scientific', path: 'pubmed-database' },
  'pufferlib': { source: 'scientific', path: 'pufferlib' },
  'pydeseq2': { source: 'scientific', path: 'pydeseq2' },
  'pydicom': { source: 'scientific', path: 'pydicom' },
  'pyhealth': { source: 'scientific', path: 'pyhealth' },
  'pylabrobot': { source: 'scientific', path: 'pylabrobot' },
  'pymatgen': { source: 'scientific', path: 'pymatgen' },
  'pymc': { source: 'scientific', path: 'pymc' },
  'pymoo': { source: 'scientific', path: 'pymoo' },
  'pyopenms': { source: 'scientific', path: 'pyopenms' },
  'pysam': { source: 'scientific', path: 'pysam' },
  'pytdc': { source: 'scientific', path: 'pytdc' },
  'pytorch-lightning': { source: 'scientific', path: 'pytorch-lightning' },
  'qiskit': { source: 'scientific', path: 'qiskit' },
  'qutip': { source: 'scientific', path: 'qutip' },
  'rdkit': { source: 'scientific', path: 'rdkit' },
  'reactome-database': { source: 'scientific', path: 'reactome-database' },
  'research-grants': { source: 'scientific', path: 'research-grants' },
  'research-lookup': { source: 'scientific', path: 'research-lookup' },
  'scanpy': { source: 'scientific', path: 'scanpy' },
  'scholar-evaluation': { source: 'scientific', path: 'scholar-evaluation' },
  'scientific-brainstorming': { source: 'scientific', path: 'scientific-brainstorming' },
  'scientific-critical-thinking': { source: 'scientific', path: 'scientific-critical-thinking' },
  'scientific-schematics': { source: 'scientific', path: 'scientific-schematics' },
  'scientific-slides': { source: 'scientific', path: 'scientific-slides' },
  'scientific-visualization': { source: 'scientific', path: 'scientific-visualization' },
  'scientific-writing': { source: 'scientific', path: 'scientific-writing' },
  'scikit-bio': { source: 'scientific', path: 'scikit-bio' },
  'scikit-learn': { source: 'scientific', path: 'scikit-learn' },
  'scikit-survival': { source: 'scientific', path: 'scikit-survival' },
  'scvi-tools': { source: 'scientific', path: 'scvi-tools' },
  'seaborn': { source: 'scientific', path: 'seaborn' },
  'shap': { source: 'scientific', path: 'shap' },
  'simpy': { source: 'scientific', path: 'simpy' },
  'stable-baselines3': { source: 'scientific', path: 'stable-baselines3' },
  'statistical-analysis': { source: 'scientific', path: 'statistical-analysis' },
  'statsmodels': { source: 'scientific', path: 'statsmodels' },
  'string-database': { source: 'scientific', path: 'string-database' },
  'sympy': { source: 'scientific', path: 'sympy' },
  'torch_geometric': { source: 'scientific', path: 'torch_geometric' },
  'torchdrug': { source: 'scientific', path: 'torchdrug' },
  'transformers': { source: 'scientific', path: 'transformers' },
  'treatment-plans': { source: 'scientific', path: 'treatment-plans' },
  'umap-learn': { source: 'scientific', path: 'umap-learn' },
  'uniprot-database': { source: 'scientific', path: 'uniprot-database' },
  'uspto-database': { source: 'scientific', path: 'uspto-database' },
  'vaex': { source: 'scientific', path: 'vaex' },
  'venue-templates': { source: 'scientific', path: 'venue-templates' },
  'zarr-python': { source: 'scientific', path: 'zarr-python' },
  'zinc-database': { source: 'scientific', path: 'zinc-database' },
  // obsidian skills
  'json-canvas': { source: 'obsidian', path: 'json-canvas' },
  'obsidian-bases': { source: 'obsidian', path: 'obsidian-bases' },
  'obsidian-markdown': { source: 'obsidian', path: 'obsidian-markdown' },
  // planning skills
  'planning-with-files': { source: 'planning', path: 'planning-with-files' },
  // superpowers skills
  'brainstorming': { source: 'superpowers', path: 'brainstorming' },
  'dispatching-parallel-agents': { source: 'superpowers', path: 'dispatching-parallel-agents' },
  'executing-plans': { source: 'superpowers', path: 'executing-plans' },
  'finishing-a-development-branch': { source: 'superpowers', path: 'finishing-a-development-branch' },
  'receiving-code-review': { source: 'superpowers', path: 'receiving-code-review' },
  'requesting-code-review': { source: 'superpowers', path: 'requesting-code-review' },
  'subagent-driven-development': { source: 'superpowers', path: 'subagent-driven-development' },
  'test-driven-development': { source: 'superpowers', path: 'test-driven-development' },
  'using-git-worktrees': { source: 'superpowers', path: 'using-git-worktrees' },
  'using-superpowers': { source: 'superpowers', path: 'using-superpowers' },
  'writing-plans': { source: 'superpowers', path: 'writing-plans' },
  'writing-skills': { source: 'superpowers', path: 'writing-skills' },
  // deep-research skills
  'citation-validator': { source: 'deep-research', path: 'citation-validator' },
  'got-controller': { source: 'deep-research', path: 'got-controller' },
  'question-refiner': { source: 'deep-research', path: 'question-refiner' },
  'research-executor': { source: 'deep-research', path: 'research-executor' },
  'synthesizer': { source: 'deep-research', path: 'synthesizer' },
  // skill-from-masters skills
  'skill-from-masters': { source: 'skill-from-masters', path: '' },
};

/**
 * 读取 SKILL.md 文件内容
 */
function readSkillContent(skillId) {
  const sourceInfo = SKILL_TO_SOURCE[skillId];
  if (!sourceInfo) {
    return null;
  }

  const basePath = SOURCE_BASE_PATHS[sourceInfo.source];
  if (!basePath || !fs.existsSync(basePath)) {
    return null;
  }

  const skillPath = path.join(basePath, sourceInfo.path, 'SKILL.md');

  try {
    if (fs.existsSync(skillPath)) {
      return fs.readFileSync(skillPath, 'utf-8');
    }
  } catch (error) {
    console.warn(`  Warning: Failed to read ${skillPath}:`, error.message);
  }

  return null;
}

/**
 * 转义模板字符串中的特殊字符
 */
function escapeForTemplateLiteral(str) {
  return str
    .replace(/\\/g, '\\\\')  // 转义反斜杠
    .replace(/`/g, '\\`')    // 转义反引号
    .replace(/\$\{/g, '\\${'); // 转义模板表达式
}

/**
 * 注入内容到 skills.ts
 */
function injectContent() {
  console.log('='.repeat(60));
  console.log('Skills Content Injector');
  console.log('='.repeat(60) + '\n');

  console.log('Reading skills.ts...');
  let content = fs.readFileSync(skillsPath, 'utf-8');

  let injectedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;
  const updates = [];

  // 匹配每个 skill 的 id 和对应的 content
  const idPattern = /id:\s*'([^']+)'/g;
  let idMatch;

  while ((idMatch = idPattern.exec(content)) !== null) {
    const skillId = idMatch[1];

    // 在这个 id 后面找到对应的 content: ''
    const searchStart = idMatch.index;
    const searchEnd = Math.min(searchStart + 2000, content.length);
    const searchArea = content.slice(searchStart, searchEnd);

    // 匹配 content: '' 或 content: ``
    const contentMatch = searchArea.match(/content:\s*(['`])(['`])/);
    if (!contentMatch) {
      skippedCount++;
      continue;
    }

    // 读取实际的 SKILL.md 内容
    const skillContent = readSkillContent(skillId);
    if (!skillContent) {
      notFoundCount++;
      continue;
    }

    // 转义内容
    const escapedContent = escapeForTemplateLiteral(skillContent);

    const contentStart = searchStart + contentMatch.index;
    updates.push({
      start: contentStart,
      oldText: contentMatch[0],
      newText: `content: \`${escapedContent}\``,
      skillId,
    });
    injectedCount++;
  }

  console.log(`\nProcessing ${updates.length} skills...`);

  // 从后向前替换，保持位置正确
  updates.sort((a, b) => b.start - a.start);

  for (const update of updates) {
    content = content.slice(0, update.start) + update.newText + content.slice(update.start + update.oldText.length);
  }

  // 写入更新后的文件
  console.log('Writing updated skills.ts...');
  fs.writeFileSync(skillsPath, content);

  const originalSize = fs.statSync(skillsPath).size;

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`  - Skills with content injected: ${injectedCount}`);
  console.log(`  - Skills skipped (already has content): ${skippedCount}`);
  console.log(`  - Skills not found in submodules: ${notFoundCount}`);
  console.log(`  - New file size: ${(originalSize / 1024).toFixed(1)} KB`);
  console.log('='.repeat(60));
}

injectContent();
