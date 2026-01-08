/**
 * Security Scanner for Skills Content
 * 
 * This module provides automated security scanning for skills content
 * to detect potential vulnerabilities and risky patterns before download.
 * 
 * WARNING: This is a辅助工具，不是万能解决方案。Always manually review skills
 * before importing into your environment.
 */

export interface SecurityFinding {
  type: 'high' | 'medium' | 'low' | 'info';
  category: string;
  message: string;
  lineNumber?: number;
  suggestion: string;
}

export interface SecurityReport {
  skillId: string;
  skillName: string;
  score: number; // 0-100, higher is safer
  findings: SecurityFinding[];
  checkedAt: string;
  riskLevel: 'safe' | 'moderate' | 'risky' | 'dangerous';
}

/**
 * Dangerous patterns that should be flagged
 */
const DANGEROUS_PATTERNS = [
  {
    pattern: /\b(exec|spawn|execSync|system|popen|child_process)\s*\(/gi,
    type: 'high' as const,
    category: 'Command Execution',
    message: 'Detected shell command execution pattern',
    suggestion: 'Review the command being executed. Ensure it does not use unsanitized user input.'
  },
  {
    pattern: /\b(readFileSync|writeFileSync|unlink|rmdir|mkdir|rename)\s*\(/gi,
    type: 'medium' as const,
    category: 'File System',
    message: 'Detected file system operation pattern',
    suggestion: 'Ensure file paths are sanitized and operations are scoped to safe directories.'
  },
  {
    pattern: /\b(eval|Function|setTimeout|setInterval)\s*\(\s*['"`]/gi,
    type: 'high' as const,
    category: 'Code Execution',
    message: 'Detected dynamic code execution pattern',
    suggestion: 'Avoid using eval() and similar functions. They can execute arbitrary code.'
  },
  {
    pattern: /\b(fetch|axios|XMLHttpRequest|https?\.(get|post))\s*\(/gi,
    type: 'low' as const,
    category: 'Network',
    message: 'Detected network request pattern',
    suggestion: 'Ensure the request URL is trusted and does not leak sensitive data.'
  },
  {
    pattern: /\b(process\.env|process\.cwd|process\.argv)/gi,
    type: 'low' as const,
    category: 'Environment',
    message: 'Detected environment access pattern',
    suggestion: 'Be careful with environment variables. They may contain secrets.'
  },
  {
    pattern: /\b(subprocess|spawn|runCommand|execCommand)\s*\(/gi,
    type: 'medium' as const,
    category: 'Command Execution',
    message: 'Detected subprocess spawning pattern',
    suggestion: 'Ensure command arguments are properly escaped and validated.'
  },
  {
    pattern: /\b(execute|query|rawQuery|Collection|Table)\s*\(/gi,
    type: 'medium' as const,
    category: 'Database',
    message: 'Detected database operation pattern',
    suggestion: 'Ensure queries use parameterized statements to prevent SQL injection.'
  },
  {
    pattern: /\b(docker|container|dockerfile|kubernetes|k8s)\s*[-:]/gi,
    type: 'low' as const,
    category: 'Infrastructure',
    message: 'Detected container/infrastructure operation',
    suggestion: 'Ensure operations are authorized and scoped to appropriate resources.'
  },
  {
    pattern: /(api[_-]?key|secret|token|password|auth[_-]?token)\s*[:=]\s*['"`][a-zA-Z0-9_\-]{20,}['"`]/gi,
    type: 'high' as const,
    category: 'Secrets',
    message: 'Potential hardcoded secret detected',
    suggestion: 'Remove any hardcoded secrets. Use environment variables instead.'
  },
  {
    pattern: /(\.\.\/|\.\.\\|\.\.%2[fF]|%2e%2e%2f)/gi,
    type: 'high' as const,
    category: 'Path Traversal',
    message: 'Potential path traversal pattern detected',
    suggestion: 'Validate and sanitize file paths. Use path.resolve() and verify paths stay within allowed directories.'
  },
  {
    pattern: /path\.(join|resolve)\s*\([^)]*\+|path\.(join|resolve)\s*\([^)]*\$\{/gi,
    type: 'high' as const,
    category: 'Path Traversal',
    message: 'Dynamic path construction without validation',
    suggestion: 'User-controlled input in path operations can lead to path traversal. Validate paths after construction.'
  },
  {
    pattern: /shell\s*[=:]\s*true|shell=True/gi,
    type: 'high' as const,
    category: 'Command Injection',
    message: 'Shell execution enabled - command injection risk',
    suggestion: 'Avoid shell=True/shell:true. Use argument arrays instead of shell strings.'
  },
  {
    pattern: /\b(127\.0\.0\.1|localhost|0\.0\.0\.0|169\.254\.169\.254|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/gi,
    type: 'medium' as const,
    category: 'SSRF',
    message: 'Internal/private IP address detected',
    suggestion: 'Validate URLs to prevent SSRF attacks. Block requests to internal networks.'
  },
  {
    pattern: /\b(file:\/\/|gopher:\/\/|dict:\/\/|ftp:\/\/)/gi,
    type: 'high' as const,
    category: 'SSRF',
    message: 'Potentially dangerous URL scheme detected',
    suggestion: 'Only allow https:// URLs. Block file://, gopher://, and other dangerous schemes.'
  },
  {
    pattern: /\b(pickle\.load|yaml\.load|marshal\.load|shelve\.open)\s*\(/gi,
    type: 'high' as const,
    category: 'Deserialization',
    message: 'Unsafe deserialization detected',
    suggestion: 'Use safe alternatives like yaml.safe_load(). Never deserialize untrusted data.'
  },
  {
    pattern: /\b(dangerouslySetInnerHTML|innerHTML\s*=|v-html\s*=|\[innerHTML\])/gi,
    type: 'medium' as const,
    category: 'XSS',
    message: 'Potential XSS vulnerability detected',
    suggestion: 'Sanitize HTML content before rendering. Use text content when possible.'
  }
];

/**
 * Patterns that indicate the skill is from a trusted source
 */
const TRUSTED_SOURCE_PATTERNS = [
  /official|anthropic|community|verified/i,
  /github\.com\/(anthropics|ComposioHQ|K-Dense-AI|obra|kepano)/i
];

/**
 * Scan skill content for security issues
 */
export function scanSkillContent(
  skillId: string,
  skillName: string,
  content: string
): SecurityReport {
  const findings: SecurityFinding[] = [];
  const lines = content.split('\n');

  // Check for dangerous patterns
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
        // Reset lastIndex for global patterns
        pattern.lastIndex = 0;
      }
    });
  });

  // Check frontmatter for trusted source indicators
  const isFromTrustedSource = TRUSTED_SOURCE_PATTERNS.some(p => p.test(content));

  // Calculate security score
  let score = 100;
  findings.forEach(f => {
    switch (f.type) {
      case 'high': score -= 25; break;
      case 'medium': score -= 10; break;
      case 'low': score -= 5; break;
      case 'info': score -= 2; break;
    }
  });
  // Bonus for trusted source
  if (isFromTrustedSource && score < 100) {
    score = Math.min(100, score + 10);
  }
  score = Math.max(0, score);

  // Determine risk level
  let riskLevel: SecurityReport['riskLevel'];
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

/**
 * Scan multiple skills and return aggregated report
 */
export function scanSkillsBatch(
  skills: Array<{ id: string; name: string; content: string }>
): SecurityReport[] {
  return skills.map(skill => 
    scanSkillContent(skill.id, skill.name, skill.content)
  );
}

/**
 * Generate human-readable security summary
 */
export function generateSecuritySummary(reports: SecurityReport[]): string {
  const summary = {
    total: reports.length,
    safe: 0,
    moderate: 0,
    risky: 0,
    dangerous: 0,
    highFindings: 0,
    mediumFindings: 0
  };

  reports.forEach(report => {
    summary[report.riskLevel]++;
    summary.highFindings += report.findings.filter(f => f.type === 'high').length;
    summary.mediumFindings += report.findings.filter(f => f.type === 'medium').length;
  });

  return `
## 安全扫描报告

### 概览
- 总检查技能数: ${summary.total}
- ✅ 安全 (80-100分): ${summary.safe}
- ⚠️  中等风险 (60-79分): ${summary.moderate}
- ❌ 高风险 (40-59分): ${summary.risky}
- 🚨 危险 (<40分): ${summary.dangerous}

### 发现的问题
- 🔴 高风险问题: ${summary.highFindings}
- 🟡 中风险问题: ${summary.mediumFindings}

### 建议
${summary.dangerous > 0 ? '- ⚠️  有危险的技能，请务必仔细审查后再使用\n' : ''}
${summary.risky > 0 ? '- 建议对标记为高风险的技能进行详细代码审查\n' : ''}
- 所有技能下载后都应进行人工审查
- 仅导入您信任的技能到您的 Claude Code 环境中
`;
}

/**
 * Quick check if a skill has high-risk findings
 */
export function hasHighRiskContent(content: string): boolean {
  return DANGEROUS_PATTERNS
    .filter(p => p.type === 'high')
    .some(p => p.pattern.test(content));
}

/**
 * Generate detailed security report with all findings
 */
export function generateDetailedSecurityReport(reports: SecurityReport[]): string {
  const riskySkills = reports.filter(r => r.riskLevel !== 'safe');
  
  if (riskySkills.length === 0) {
    return '# 详细安全报告\n\n所有技能均未检测到明显的安全问题。\n';
  }

  let detailedReport = `# 详细安全报告

生成时间: ${new Date().toLocaleString('zh-CN')}

---

## 高风险技能详情

`;

  riskySkills
    .filter(r => r.riskLevel === 'dangerous' || r.riskLevel === 'risky')
    .forEach(report => {
      detailedReport += `### ${report.skillName} (${report.skillId})

**安全评分**: ${report.score}/100 (${report.riskLevel})

`;

      if (report.findings.length > 0) {
        report.findings.forEach((finding, idx) => {
          detailedReport += `#### ${idx + 1}. ${finding.category} - ${finding.type.toUpperCase()} 风险
`;
          detailedReport += `**位置**: 第 ${finding.lineNumber} 行

**描述**: ${finding.message}

**建议**: ${finding.suggestion}

`;
        });
      }
    });

  // Add moderate skills
  const moderateSkills = reports.filter(r => r.riskLevel === 'moderate');
  if (moderateSkills.length > 0) {
    detailedReport += `---

## 中等风险技能

以下技能检测到一些需要注意的模式：

`;

    moderateSkills.forEach(report => {
      detailedReport += `- **${report.skillName}** (${report.skillId}) - 评分: ${report.score}
`;
    });
  }

  detailedReport += `---

## 扫描说明

本报告由 FastSkills 安全扫描器自动生成。扫描器检测以下类型的潜在安全问题：

### 高风险模式
- Shell 命令执行 (exec, spawn, system)
- 动态代码执行 (eval, Function)
- 硬编码的密钥或密码

### 中风险模式
- 文件系统操作 (readFileSync, writeFileSync)
- 子进程创建
- 数据库操作

### 低风险模式
- HTTP/HTTPS 请求
- 环境变量访问
- 容器/基础设施操作

**重要提示**: 本扫描器只能检测已知模式，不能替代人工代码审查。

---

## 建议操作

1. **仔细阅读** 每个高风险技能的 SKILL.md 文件
2. **验证** 技能中使用的命令和操作
3. **仅导入** 您信任且已审查的技能
4. **定期更新** 已安装的技能以获取最新版本

`;

  return detailedReport;
}
