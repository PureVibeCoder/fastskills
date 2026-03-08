#!/usr/bin/env node
/**
 * Skills.sh 热门技能爬虫
 * 
 * 每日定时从 skills.sh 抓取热门技能，进行安全检查后收录到 FastSkills
 * 
 * 工作流程:
 * 1. 爬取 skills.sh/hot 页面获取热门技能列表
 * 2. 从 GitHub 获取技能 SKILL.md 内容
 * 3. 进行安全检查 (security-scanner)
 * 4. 如果发现安全问题，生成报告并通知
 * 5. 如果通过检查，准备收录数据
 * 
 * 用法:
 *   node crawl-skills-sh.mjs [--limit=5] [--dry-run]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ============================================================================
// 配置常量
// ============================================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../../../..');

const CONFIG = {
  // skills.sh 配置
  SKILLS_SH_BASE: 'https://skills.sh',
  SKILLS_SH_HOT: 'https://skills.sh/hot',
  
  // GitHub raw 内容基础 URL
  GITHUB_RAW_BASE: 'https://raw.githubusercontent.com',
  
  // 默认抓取数量
  DEFAULT_LIMIT: 5,
  
  // 安全评分阈值
  SECURITY_THRESHOLD: 80,
  REJECT_THRESHOLD: 60,
  
  // 输出目录
  OUTPUT_DIR: path.join(__dirname, 'output'),
  REPORTS_DIR: path.join(__dirname, 'reports'),
  
  // 数据文件路径
  SKILLS_TS_PATH: path.join(PROJECT_ROOT, 'packages/website/src/data/skills.ts'),
  SKILL_SOURCES_PATH: path.join(PROJECT_ROOT, 'packages/website/src/data/skill-sources.ts'),
  ROUTER_SKILL_PATH: path.join(PROJECT_ROOT, 'skills/fastskills-router/SKILL.md'),
  CATEGORIES_PATH: path.join(PROJECT_ROOT, 'packages/website/src/data/categories.ts'),
};

// ============================================================================
// 类型定义
// ============================================================================

/**
 * @typedef {Object} SkillsShSkill
 * @property {string} id - 技能 ID
 * @property {string} name - 技能名称
 * @property {string} owner - GitHub 仓库所有者
 * @property {string} repo - GitHub 仓库名
 * @property {string} skillPath - 技能在仓库中的路径
 * @property {number} installs - 安装次数
 * @property {string} url - skills.sh 上的链接
 */

/**
 * @typedef {Object} SecurityFinding
 * @property {'high'|'medium'|'low'|'info'} type
 * @property {string} category
 * @property {string} message
 * @property {number} [lineNumber]
 * @property {string} suggestion
 */

/**
 * @typedef {Object} CrawlResult
 * @property {SkillsShSkill} skillInfo
 * @property {string|null} content - SKILL.md 内容
 * @property {SecurityReport|null} securityReport
 * @property {boolean} isNew - 是否为新技能
 * @property {string} status - 'accepted' | 'rejected' | 'needs_review' | 'failed'
 * @property {string[]} errors
 */

/**
 * @typedef {Object} SecurityReport
 * @property {string} skillId
 * @property {string} skillName
 * @property {number} score
 * @property {SecurityFinding[]} findings
 * @property {string} checkedAt
 * @property {'safe'|'moderate'|'risky'|'dangerous'} riskLevel
 */

// ============================================================================
// 日志工具
// ============================================================================

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const CURRENT_LOG_LEVEL = process.env.DEBUG ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

function log(level, message, ...args) {
  if (level < CURRENT_LOG_LEVEL) return;
  
  const timestamp = new Date().toISOString();
  const levelName = Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === level);
  const prefix = `[${timestamp}] [${levelName}]`;
  
  if (level === LOG_LEVELS.ERROR) {
    console.error(prefix, message, ...args);
  } else if (level === LOG_LEVELS.WARN) {
    console.warn(prefix, message, ...args);
  } else {
    console.log(prefix, message, ...args);
  }
}

const logger = {
  debug: (...args) => log(LOG_LEVELS.DEBUG, ...args),
  info: (...args) => log(LOG_LEVELS.INFO, ...args),
  warn: (...args) => log(LOG_LEVELS.WARN, ...args),
  error: (...args) => log(LOG_LEVELS.ERROR, ...args),
};

// ============================================================================
// HTTP 请求工具
// ============================================================================

/**
 * 带重试的 HTTP GET 请求
 */
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      logger.debug(`Fetching: ${url} (attempt ${i + 1}/${maxRetries})`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'FastSkills-Crawler/1.0 (github.com/PureVibeCoder/fastskills)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      logger.warn(`Fetch attempt ${i + 1} failed: ${error.message}`);
      
      if (i < maxRetries - 1) {
        const waitTime = Math.pow(2, i) * 1000; // 指数退避
        logger.debug(`Retrying in ${waitTime}ms...`);
        await delay(waitTime);
      } else {
        throw error;
      }
    }
  }
}

// ============================================================================
// HTML 解析工具
// ============================================================================

/**
 * 简单的 HTML 解析，提取热门技能列表
 * 注意：由于 skills.sh 是服务端渲染，我们解析其 HTML 结构
 */
function parseSkillsHtml(html) {
  const skills = [];
  
  // 尝试多种可能的 HTML 模式
  // 模式 1: 新的 React/Vue 组件结构
  const skillRegex = /<a[^>]*href="\/([^\/]+)\/([^\/]+)\/([^"]+)"[^>]*>[\s\S]*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>[\s\S]*?(\d+\.?\d*\s*[KM]?)\s*installs?/gi;
  
  let match = skillRegex.exec(html);
  while (match !== null) {
    const [, owner, repo, skillPath, name, installs] = match;
    
    // 解析安装数
    const installCount = parseInstallCount(installs);
    
    skills.push({
      id: `${owner}-${skillPath}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      name: name.trim(),
      owner: owner.trim(),
      repo: repo.trim(),
      skillPath: skillPath.trim(),
      installs: installCount,
      url: `https://skills.sh/${owner}/${repo}/${skillPath}`,
    });
    
    match = skillRegex.exec(html);
  }
  
  // 模式 2: 表格行结构 (备用)
  if (skills.length === 0) {
    const rowRegex = /<tr[^>]*>[\s\S]*?<td[^>]*>\s*(\d+)\s*<\/td>[\s\S]*?<a[^>]*href="\/([^"]+)"[^>]*>([^<]+)<\/a>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([\d.,]+\s*[KM]?)<\/td>/gi;
    
    let rowMatch = rowRegex.exec(html);
    while (rowMatch !== null) {
      const [, rank, path, name, author, installs] = rowMatch;
      const [owner, repo, ...skillParts] = path.split('/');
      const skillPath = skillParts.join('/');
      
      skills.push({
        id: `${owner}-${skillPath}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: name.trim(),
        owner: owner.trim(),
        repo: repo.trim(),
        skillPath: skillPath.trim(),
        installs: parseInstallCount(installs),
        url: `https://skills.sh/${path}`,
      });
      
      rowMatch = rowRegex.exec(html);
    }
  }
  
  // 去重
  const seen = new Set();
  return skills.filter(skill => {
    if (seen.has(skill.id)) return false;
    seen.add(skill.id);
    return true;
  });
}

/**
 * 解析安装数量字符串
 */
function parseInstallCount(countStr) {
  if (!countStr) return 0;
  
  const clean = countStr.trim().toUpperCase().replace(/,/g, '');
  
  if (clean.endsWith('K')) {
    return parseFloat(clean.slice(0, -1)) * 1000;
  } else if (clean.endsWith('M')) {
    return parseFloat(clean.slice(0, -1)) * 1000000;
  }
  
  return parseInt(clean, 10) || 0;
}

// ============================================================================
// 技能内容获取
// ============================================================================

/**
 * 从 GitHub 获取技能 SKILL.md 内容
 */
async function fetchSkillContent(owner, repo, skillPath) {
  // 尝试多种可能的路径
  const possiblePaths = [
    `${CONFIG.GITHUB_RAW_BASE}/${owner}/${repo}/main/${skillPath}/SKILL.md`,
    `${CONFIG.GITHUB_RAW_BASE}/${owner}/${repo}/master/${skillPath}/SKILL.md`,
    `${CONFIG.GITHUB_RAW_BASE}/${owner}/${repo}/main/SKILL.md`,
    `${CONFIG.GITHUB_RAW_BASE}/${owner}/${repo}/master/SKILL.md`,
    `${CONFIG.GITHUB_RAW_BASE}/${owner}/${repo}/main/${skillPath}.md`,
  ];
  
  for (const url of possiblePaths) {
    try {
      logger.debug(`Trying: ${url}`);
      const response = await fetchWithRetry(url);
      const content = await response.text();
      
      if (content && content.length > 100) {
        logger.debug(`Found content at: ${url} (${content.length} bytes)`);
        return content;
      }
    } catch (error) {
      logger.debug(`Not found: ${url}`);
      continue;
    }
  }
  
  return null;
}

// ============================================================================
// 安全检查 (内联实现，避免依赖问题)
// ============================================================================

const DANGEROUS_PATTERNS = [
  {
    pattern: /\b(exec|spawn|execSync|system|popen|child_process)\s*\(/gi,
    type: 'high',
    category: 'Command Execution',
    message: 'Detected shell command execution pattern',
    suggestion: 'Review the command being executed. Ensure it does not use unsanitized user input.'
  },
  {
    pattern: /\b(eval|Function|setTimeout|setInterval)\s*\(\s*['"`]/gi,
    type: 'high',
    category: 'Code Execution',
    message: 'Detected dynamic code execution pattern',
    suggestion: 'Avoid using eval() and similar functions. They can execute arbitrary code.'
  },
  {
    pattern: /(api[_-]?key|secret|token|password|auth[_-]?token)\s*[:=]\s*['"`][a-zA-Z0-9_-]{20,}['"`]/gi,
    type: 'high',
    category: 'Secrets',
    message: 'Potential hardcoded secret detected',
    suggestion: 'Remove any hardcoded secrets. Use environment variables instead.'
  },
  {
    pattern: /(\.\.\/|\.\.\\|\.\.%2[fF]|%2e%2e%2f)/gi,
    type: 'high',
    category: 'Path Traversal',
    message: 'Potential path traversal pattern detected',
    suggestion: 'Validate and sanitize file paths. Use path.resolve() and verify paths stay within allowed directories.'
  },
  {
    pattern: /shell\s*[=:]\s*true|shell=True/gi,
    type: 'high',
    category: 'Command Injection',
    message: 'Shell execution enabled - command injection risk',
    suggestion: 'Avoid shell=True/shell:true. Use argument arrays instead of shell strings.'
  },
  {
    pattern: /\b(file:\/\/|gopher:\/\/|dict:\/\/|ftp:\/\/)/gi,
    type: 'high',
    category: 'SSRF',
    message: 'Potentially dangerous URL scheme detected',
    suggestion: 'Only allow https:// URLs. Block file://, gopher://, and other dangerous schemes.'
  },
  {
    pattern: /\b(pickle\.load|yaml\.load|marshal\.load|shelve\.open)\s*\(/gi,
    type: 'high',
    category: 'Deserialization',
    message: 'Unsafe deserialization detected',
    suggestion: 'Use safe alternatives like yaml.safe_load(). Never deserialize untrusted data.'
  },
  {
    pattern: /\b(readFileSync|writeFileSync|unlink|rmdir)\s*\(/gi,
    type: 'medium',
    category: 'File System',
    message: 'Detected file system operation pattern',
    suggestion: 'Ensure file paths are sanitized and operations are scoped to safe directories.'
  },
  {
    pattern: /\b(dangerouslySetInnerHTML|innerHTML\s*=|v-html\s*=)/gi,
    type: 'medium',
    category: 'XSS',
    message: 'Potential XSS vulnerability detected',
    suggestion: 'Sanitize HTML content before rendering. Use text content when possible.'
  },
  {
    pattern: /\b(127\.0\.0\.1|localhost|0\.0\.0\.0|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/gi,
    type: 'medium',
    category: 'SSRF',
    message: 'Internal/private IP address detected',
    suggestion: 'Validate URLs to prevent SSRF attacks. Block requests to internal networks.'
  },
];

/**
 * 扫描技能内容的安全问题
 */
function scanSkillContent(skillId, skillName, content) {
  const findings = [];
  const lines = content.split('\n');
  
  // 检查危险模式
  DANGEROUS_PATTERNS.forEach(({ pattern, type, category, message, suggestion }) => {
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        findings.push({
          type,
          category,
          message,
          lineNumber: index + 1,
          suggestion
        });
        pattern.lastIndex = 0;
      }
    });
  });
  
  // 计算安全评分
  let score = 100;
  findings.forEach(f => {
    switch (f.type) {
      case 'high': score -= 25; break;
      case 'medium': score -= 10; break;
      case 'low': score -= 5; break;
      case 'info': score -= 2; break;
    }
  });
  score = Math.max(0, score);
  
  // 确定风险等级
  let riskLevel;
  if (score >= 80) {
    riskLevel = 'safe';
  } else if (score >= 60) {
    riskLevel = 'moderate';
  } else if (score >= 40) {
    riskLevel = 'risky';
  } else {
    riskLevel = 'dangerous';
  }
  
  return {
    skillId,
    skillName,
    score,
    findings,
    checkedAt: new Date().toISOString(),
    riskLevel
  };
}

// ============================================================================
// 本地数据操作
// ============================================================================

/**
 * 检查技能是否已存在于本地
 */
async function isSkillExists(skillId) {
  try {
    const content = await fs.readFile(CONFIG.SKILLS_TS_PATH, 'utf-8');
    return content.includes(`id: '${skillId}'`);
  } catch (error) {
    logger.error('Failed to read skills.ts:', error.message);
    return false;
  }
}

/**
 * 获取下一个可用的优先级
 */
async function getNextPriority() {
  try {
    const content = await fs.readFile(CONFIG.SKILLS_TS_PATH, 'utf-8');
    const priorityMatches = content.match(/priority:\s*(\d+)/g);
    
    if (!priorityMatches) return 1;
    
    const priorities = priorityMatches
      .map(m => parseInt(m.match(/\d+/)[0], 10))
      .filter(n => !isNaN(n));
    
    return Math.max(...priorities) + 1;
  } catch (error) {
    return 1;
  }
}

/**
 * 从 categories.ts 获取分类列表
 */
async function getCategories() {
  try {
    const content = await fs.readFile(CONFIG.CATEGORIES_PATH, 'utf-8');
    const categories = [];
    
    // 简单解析分类 ID
    const idRegex = /id:\s*'([^']+)'/g;
    let match = idRegex.exec(content);
    while (match !== null) {
      categories.push(match[1]);
    }
    
    return categories;
  } catch (error) {
    return ['tools'];
  }
}

// ============================================================================
// 报告生成
// ============================================================================

/**
 * 生成安全报告
 */
function generateSecurityReport(results) {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      total: results.length,
      accepted: results.filter(r => r.status === 'accepted').length,
      rejected: results.filter(r => r.status === 'rejected').length,
      needsReview: results.filter(r => r.status === 'needs_review').length,
      failed: results.filter(r => r.status === 'failed').length,
    },
    rejected: results.filter(r => r.status === 'rejected'),
    needsReview: results.filter(r => r.status === 'needs_review'),
    accepted: results.filter(r => r.status === 'accepted'),
  };
  
  return report;
}

/**
 * 生成 Markdown 格式的安全报告
 */
function generateMarkdownReport(report) {
  let md = `# Skills.sh 抓取安全报告

生成时间: ${new Date().toLocaleString('zh-CN')}

## 摘要

- 总共处理: ${report.summary.total} 个技能
- ✅ 通过 (安全): ${report.summary.accepted} 个
- ❌ 拒绝 (危险): ${report.summary.rejected} 个
- ⚠️ 需审查 (中等风险): ${report.summary.needsReview} 个
- 💥 获取失败: ${report.summary.failed} 个

`;

  // 拒绝的技能 (需要报告给 skills.sh)
  if (report.rejected.length > 0) {
    md += `## ❌ 被拒绝的技能 (需要报告给 skills.sh)

以下技能存在严重安全问题，建议 skills.sh 进行审查：

`;
    report.rejected.forEach(item => {
      md += `### ${item.skillInfo.name}

- **ID**: ${item.skillInfo.id}
- **来源**: ${item.skillInfo.owner}/${item.skillInfo.repo}
- **Skills.sh 链接**: ${item.skillInfo.url}
- **安全评分**: ${item.securityReport?.score}/100
- **风险等级**: ${item.securityReport?.riskLevel}

**发现的问题**:

`;
      item.securityReport?.findings?.forEach(f => {
        md += `- [${f.type.toUpperCase()}] ${f.category}: ${f.message}\n`;
        if (f.lineNumber) {
          md += `  - 位置: 第 ${f.lineNumber} 行\n`;
        }
        md += `  - 建议: ${f.suggestion}\n\n`;
      });
      
      md += `---\n\n`;
    });
  }

  // 需审查的技能
  if (report.needsReview.length > 0) {
    md += `## ⚠️ 需要审查的技能

以下技能存在一些需要注意的模式，建议人工审查：

`;
    report.needsReview.forEach(item => {
      md += `- **${item.skillInfo.name}** (${item.skillInfo.id}) - 评分: ${item.securityReport?.score}/100\n`;
      md += `  - 来源: ${item.skillInfo.owner}/${item.skillInfo.repo}\n`;
      md += `  - 链接: ${item.skillInfo.url}\n\n`;
    });
    md += '\n';
  }

  // 通过的技能
  if (report.accepted.length > 0) {
    md += `## ✅ 通过安全检查的技能

以下技能已通过安全检查，可以收录到 FastSkills：

| 技能名称 | ID | 来源 | 评分 |
|---------|-----|------|------|
`;
    report.accepted.forEach(item => {
      md += `| ${item.skillInfo.name} | ${item.skillInfo.id} | ${item.skillInfo.owner}/${item.skillInfo.repo} | ${item.securityReport?.score}/100 |\n`;
    });
    md += '\n';
  }

  md += `## 建议操作

1. **对于被拒绝的技能**: 向 skills.sh 提交安全问题报告
2. **对于需审查的技能**: 人工审查后决定是否收录
3. **对于通过的技能**: 运行收录脚本添加到 FastSkills

---

*本报告由 FastSkills 自动爬虫生成*
`;

  return md;
}

// ============================================================================
// 主流程
// ============================================================================

/**
 * 爬取单个技能
 */
async function crawlSkill(skillInfo, options = {}) {
  const result = {
    skillInfo,
    content: null,
    securityReport: null,
    isNew: false,
    status: 'failed',
    errors: [],
  };
  
  logger.info(`Processing: ${skillInfo.name} (${skillInfo.id})`);
  
  try {
    // 1. 检查是否已存在
    const exists = await isSkillExists(skillInfo.id);
    if (exists && !options.force) {
      logger.info(`  Skill already exists: ${skillInfo.id}`);
      result.status = 'exists';
      return result;
    }
    result.isNew = !exists;
    
    // 2. 获取技能内容
    logger.info(`  Fetching content from GitHub...`);
    const content = await fetchSkillContent(skillInfo.owner, skillInfo.repo, skillInfo.skillPath);
    
    if (!content) {
      result.errors.push('Failed to fetch SKILL.md from GitHub');
      result.status = 'failed';
      return result;
    }
    
    result.content = content;
    logger.info(`  Content fetched: ${content.length} bytes`);
    
    // 3. 安全检查
    logger.info(`  Running security scan...`);
    const securityReport = scanSkillContent(skillInfo.id, skillInfo.name, content);
    result.securityReport = securityReport;
    
    logger.info(`  Security score: ${securityReport.score}/100 (${securityReport.riskLevel})`);
    
    // 4. 根据评分决定状态
    if (securityReport.score < CONFIG.REJECT_THRESHOLD) {
      result.status = 'rejected';
      logger.warn(`  ❌ REJECTED: Score below ${CONFIG.REJECT_THRESHOLD}`);
    } else if (securityReport.score < CONFIG.SECURITY_THRESHOLD) {
      result.status = 'needs_review';
      logger.warn(`  ⚠️  NEEDS REVIEW: Score below ${CONFIG.SECURITY_THRESHOLD}`);
    } else {
      result.status = 'accepted';
      logger.info(`  ✅ ACCEPTED`);
    }
    
  } catch (error) {
    result.errors.push(error.message);
    result.status = 'failed';
    logger.error(`  Error: ${error.message}`);
  }
  
  return result;
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const options = {
    limit: CONFIG.DEFAULT_LIMIT,
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
    outputDir: CONFIG.OUTPUT_DIR,
  };
  
  // 解析参数
  const limitArg = args.find(a => a.startsWith('--limit='));
  if (limitArg) {
    options.limit = parseInt(limitArg.split('=')[1], 10) || CONFIG.DEFAULT_LIMIT;
  }
  
  logger.info('='.repeat(60));
  logger.info('FastSkills.sh Crawler');
  logger.info('='.repeat(60));
  logger.info(`Configuration:`);
  logger.info(`  Target: ${CONFIG.SKILLS_SH_HOT}`);
  logger.info(`  Limit: ${options.limit} skills`);
  logger.info(`  Dry run: ${options.dryRun}`);
  logger.info(`  Force: ${options.force}`);
  logger.info('='.repeat(60));
  
  try {
    // 1. 爬取 skills.sh 热门页面
    logger.info('\n[1/4] Fetching skills.sh hot page...');
    const response = await fetchWithRetry(CONFIG.SKILLS_SH_HOT);
    const html = await response.text();
    logger.info(`  Fetched ${html.length} bytes`);
    
    // 2. 解析技能列表
    logger.info('\n[2/4] Parsing skill list...');
    const allSkills = parseSkillsHtml(html);
    logger.info(`  Found ${allSkills.length} skills total`);
    
    // 3. 选择前 N 个
    const skillsToProcess = allSkills.slice(0, options.limit);
    logger.info(`  Processing top ${skillsToProcess.length} skills`);
    
    // 4. 处理每个技能
    logger.info('\n[3/4] Processing skills...');
    const results = [];
    
    for (const skillInfo of skillsToProcess) {
      const result = await crawlSkill(skillInfo, options);
      results.push(result);
      
      // 延迟避免请求过快
      if (!options.dryRun) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    
    // 5. 生成报告
    logger.info('\n[4/4] Generating reports...');
    const report = generateSecurityReport(results);
    
    // 确保输出目录存在
    await fs.mkdir(CONFIG.REPORTS_DIR, { recursive: true });
    await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
    
    // 保存 JSON 报告
    const jsonReportPath = path.join(CONFIG.REPORTS_DIR, `report-${Date.now()}.json`);
    await fs.writeFile(jsonReportPath, JSON.stringify(report, null, 2));
    logger.info(`  JSON report: ${jsonReportPath}`);
    
    // 保存 Markdown 报告
    const mdReport = generateMarkdownReport(report);
    const mdReportPath = path.join(CONFIG.REPORTS_DIR, `report-${Date.now()}.md`);
    await fs.writeFile(mdReportPath, mdReport);
    logger.info(`  Markdown report: ${mdReportPath}`);
    
    // 保存通过的技能数据（用于后续收录）
    const acceptedSkills = results.filter(r => r.status === 'accepted');
    if (acceptedSkills.length > 0) {
      const acceptedPath = path.join(CONFIG.OUTPUT_DIR, 'accepted-skills.json');
      await fs.writeFile(acceptedPath, JSON.stringify(acceptedSkills, null, 2));
      logger.info(`  Accepted skills: ${acceptedPath}`);
    }
    
    // 6. 输出摘要
    logger.info('\n' + '='.repeat(60));
    logger.info('SUMMARY');
    logger.info('='.repeat(60));
    logger.info(`Total processed: ${report.summary.total}`);
    logger.info(`✅ Accepted: ${report.summary.accepted}`);
    logger.info(`❌ Rejected: ${report.summary.rejected}`);
    logger.info(`⚠️  Needs review: ${report.summary.needsReview}`);
    logger.info(`💥 Failed: ${report.summary.failed}`);
    logger.info('='.peat(60));
    
    // 如果有拒绝的技能，提示需要报告
    if (report.summary.rejected > 0) {
      logger.warn('\n⚠️  ATTENTION: Found rejected skills with security issues!');
      logger.warn('   Please review the report and consider notifying skills.sh');
    }
    
    return report;
    
  } catch (error) {
    logger.error('Crawler failed:', error.message);
    logger.error(error.stack);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(report => {
    // 如果有任何错误，以非零状态退出
    const hasErrors = report.summary.rejected > 0 || report.summary.failed > 0;
    process.exit(hasErrors ? 1 : 0);
  }).catch(error => {
    logger.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { crawlSkill, parseSkillsHtml, scanSkillContent };
