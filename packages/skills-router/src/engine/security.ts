import * as path from 'path';
import * as os from 'os';
import { ValidationResult } from '../types.js';

const ALLOWED_PREFIXES = [
  process.cwd(),
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
  path.join(os.homedir(), '.ssh'),
  path.join(os.homedir(), '.gnupg'),
  path.join(os.homedir(), '.aws'),
  path.join(os.homedir(), '.config'),
];

export function validateSkillPath(sourcePath: string): ValidationResult {
  const absolutePath = path.resolve(sourcePath);
  
  const normalizedPath = path.normalize(absolutePath);
  if (normalizedPath !== absolutePath || sourcePath.includes('..')) {
    return { valid: false, error: '路径包含非法字符或 ..' };
  }
  
  for (const blocked of BLOCKED_PATHS) {
    if (absolutePath.startsWith(blocked)) {
      return { valid: false, error: `路径包含受保护目录: ${blocked}` };
    }
  }
  
  const isAllowed = ALLOWED_PREFIXES.some(prefix => 
    absolutePath.startsWith(prefix)
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
