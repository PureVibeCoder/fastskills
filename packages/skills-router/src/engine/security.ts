import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { ValidationResult } from '../types.js';

// 明确的允许目录列表（移除 process.cwd() 避免过宽）
const ALLOWED_PREFIXES = [
  path.join(os.homedir(), '.claude'),
  path.join(os.homedir(), 'GitHub'),
  path.join(os.homedir(), 'Projects'),
  path.join(os.homedir(), 'Developer'),
  path.join(os.homedir(), 'code'),
  '/tmp',
  '/private/tmp',
  '/var/folders',
  '/private/var/folders',
];

const BLOCKED_PATHS = [
  '/etc',
  '/usr',
  '/bin',
  '/sbin',
  '/root',
  // macOS symlinks: /etc -> /private/etc, etc.
  '/private/etc',
  path.join(os.homedir(), '.ssh'),
  path.join(os.homedir(), '.gnupg'),
  path.join(os.homedir(), '.aws'),
  path.join(os.homedir(), '.config'),
];

/**
 * 检查路径是否以指定前缀开始（使用 path.sep 避免前缀碰撞）
 * 例如: /Users/foo/GitHub 不应匹配 /Users/foo/GitHubX
 */
function startsWithPrefix(targetPath: string, prefix: string): boolean {
  return targetPath === prefix || targetPath.startsWith(prefix + path.sep);
}

export function validateSkillPath(sourcePath: string): ValidationResult {
  const absolutePath = path.resolve(sourcePath);

  // 检查路径遍历攻击
  const normalizedPath = path.normalize(absolutePath);
  if (normalizedPath !== absolutePath || sourcePath.includes('..')) {
    return { valid: false, error: '路径包含非法字符或 ..' };
  }

  // 解析 symlink 获取真实路径（防止 symlink 绕过）
  let realPath: string;
  try {
    realPath = fs.realpathSync(absolutePath);
  } catch {
    // 路径不存在时使用原路径进行验证
    realPath = absolutePath;
  }

  // 检查是否在受保护目录中
  for (const blocked of BLOCKED_PATHS) {
    if (startsWithPrefix(realPath, blocked)) {
      return { valid: false, error: `路径包含受保护目录: ${blocked}` };
    }
  }

  // 检查是否在允许的目录中（使用精确前缀匹配）
  const isAllowed = ALLOWED_PREFIXES.some(prefix =>
    startsWithPrefix(realPath, prefix)
  );

  if (!isAllowed) {
    return {
      valid: false,
      error: `路径不在允许范围内。允许的目录: ${ALLOWED_PREFIXES.slice(0, 3).join(', ')}...`
    };
  }

  return { valid: true };
}

export function sanitizeSkillId(id: string): string {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}
