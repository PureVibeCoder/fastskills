/**
 * Security Validation Module
 *
 * Provides input validation, path security, and safe error handling
 * to protect against path traversal, injection, and information leakage.
 */

import { z } from "zod";
import * as path from "path";
import * as fs from "fs";

// ============================================
// Security Constants
// ============================================

export const SECURITY_LIMITS = {
  MAX_USER_MESSAGE_LENGTH: 10000,
  MAX_SKILL_NAME_LENGTH: 100,
  MAX_KEYWORD_LENGTH: 200,
  MAX_SKILLS_ACTIVATION: 5,
  MAX_PATH_DEPTH: 10,
  MAX_BUNDLE_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_PATH_LENGTH: 500,
} as const;

// ============================================
// Custom Error Classes
// ============================================

export class PathTraversalError extends Error {
  constructor(message: string = "Path traversal attack blocked") {
    super(message);
    this.name = "PathTraversalError";
  }
}

export class SymlinkEscapeError extends Error {
  constructor(message: string = "Symlink escape blocked") {
    super(message);
    this.name = "SymlinkEscapeError";
  }
}

export class ValidationError extends Error {
  constructor(message: string, public details?: z.ZodError) {
    super(message);
    this.name = "ValidationError";
  }
}

// ============================================
// Zod Schemas
// ============================================

// Skill name validation - alphanumeric, underscore, hyphen only
export const SkillNameSchema = z
  .string()
  .min(1, "Skill name cannot be empty")
  .max(SECURITY_LIMITS.MAX_SKILL_NAME_LENGTH, "Skill name too long")
  .regex(/^[a-zA-Z0-9_\-]+$/, "Skill name can only contain letters, numbers, underscores and hyphens");

// User message validation
export const UserMessageSchema = z
  .string()
  .min(1, "Message cannot be empty")
  .max(SECURITY_LIMITS.MAX_USER_MESSAGE_LENGTH, "Message too long");

// Search keyword validation
export const KeywordSchema = z
  .string()
  .min(1, "Keyword cannot be empty")
  .max(SECURITY_LIMITS.MAX_KEYWORD_LENGTH, "Keyword too long");

// Max skills parameter validation
export const MaxSkillsSchema = z
  .number()
  .int("Must be an integer")
  .min(1, "Must be at least 1")
  .max(SECURITY_LIMITS.MAX_SKILLS_ACTIVATION, `Cannot exceed ${SECURITY_LIMITS.MAX_SKILLS_ACTIVATION}`)
  .default(1);

// analyze_and_route arguments schema
export const AnalyzeAndRouteArgsSchema = z.object({
  user_message: UserMessageSchema,
  max_skills: MaxSkillsSchema.optional(),
});

// load_skill arguments schema
export const LoadSkillArgsSchema = z.object({
  skill_name: SkillNameSchema,
});

// deactivate_skill arguments schema
export const DeactivateSkillArgsSchema = z.object({
  skill_name: SkillNameSchema,
});

// search_skills arguments schema
export const SearchSkillsArgsSchema = z.object({
  keyword: KeywordSchema,
});

// Bundle name validation for CLI
export const BundleNameSchema = z
  .string()
  .min(1, "Bundle name cannot be empty")
  .max(SECURITY_LIMITS.MAX_BUNDLE_NAME_LENGTH, "Bundle name too long")
  .regex(/^[a-zA-Z0-9_\-]+$/, "Bundle name can only contain letters, numbers, underscores and hyphens");

// Skill bundle YAML schema
export const SkillBundleSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_\-]+$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must be in x.y.z format"),
  description: z.string().max(SECURITY_LIMITS.MAX_DESCRIPTION_LENGTH).default(""),
  author: z.string().max(100).default("Unknown"),
  skills: z.array(z.object({
    name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_\-]+$/),
    source: z.enum(["local", "plugin"]),
    path: z.string().max(SECURITY_LIMITS.MAX_PATH_LENGTH).optional(),
    plugin_id: z.string().max(200).optional(),
    description: z.string().max(500),
    triggers: z.array(z.string().max(50)).max(50).optional(),
    always_active: z.boolean().optional(),
  })).default([]),
  includes: z.array(z.object({
    source: z.string().max(SECURITY_LIMITS.MAX_PATH_LENGTH),
    target: z.string().max(SECURITY_LIMITS.MAX_PATH_LENGTH),
    merge: z.boolean().optional(),
    overwrite: z.boolean().optional(),
  })).default([]),
});

// ============================================
// Path Security Functions
// ============================================

/**
 * Validates that a path stays within a base directory (prevents path traversal)
 * @param basePath The allowed base directory
 * @param targetPath The path to validate (can be relative or absolute)
 * @returns The normalized absolute path if valid
 * @throws PathTraversalError if path escapes base directory
 */
export function validatePath(basePath: string, targetPath: string): string {
  // Resolve to absolute paths
  const resolvedBase = path.resolve(basePath);
  const resolvedTarget = path.resolve(basePath, targetPath);

  // Normalize paths (removes /../ etc)
  const normalizedBase = path.normalize(resolvedBase);
  const normalizedTarget = path.normalize(resolvedTarget);

  // Check if target is within base directory
  if (!normalizedTarget.startsWith(normalizedBase + path.sep) &&
      normalizedTarget !== normalizedBase) {
    throw new PathTraversalError("Path escapes allowed directory");
  }

  // Check path depth
  const relativePath = path.relative(normalizedBase, normalizedTarget);
  const depth = relativePath.split(path.sep).filter(p => p.length > 0).length;
  if (depth > SECURITY_LIMITS.MAX_PATH_DEPTH) {
    throw new PathTraversalError("Path depth exceeds limit");
  }

  return normalizedTarget;
}

/**
 * Validates a file path for reading, including symlink detection
 * @param basePath The allowed base directory
 * @param filePath The file path to validate
 * @returns The validated absolute path
 * @throws PathTraversalError or SymlinkEscapeError
 */
export function validateFileForRead(basePath: string, filePath: string): string {
  const validatedPath = validatePath(basePath, filePath);

  // Check for symlink escape
  try {
    const stats = fs.lstatSync(validatedPath);
    if (stats.isSymbolicLink()) {
      const realPath = fs.realpathSync(validatedPath);
      const normalizedBase = path.normalize(path.resolve(basePath));

      // Ensure symlink target is also within allowed directory
      if (!realPath.startsWith(normalizedBase + path.sep) &&
          realPath !== normalizedBase) {
        throw new SymlinkEscapeError("Symlink points outside allowed directory");
      }
    }
  } catch (err) {
    if (err instanceof SymlinkEscapeError || err instanceof PathTraversalError) {
      throw err;
    }
    // File doesn't exist yet - that's OK for validation
  }

  return validatedPath;
}

/**
 * Validates a single skills directory path
 */
export function validateSkillsDir(dir: string): boolean {
  // Reject paths with ..
  if (dir.includes("..")) {
    return false;
  }

  // Must be absolute path
  if (!path.isAbsolute(dir)) {
    // Allow relative paths from cwd
    const resolved = path.resolve(dir);
    if (!resolved || resolved.length === 0) {
      return false;
    }
  }

  // Check if directory exists
  try {
    const stats = fs.statSync(dir);
    return stats.isDirectory();
  } catch {
    // Directory doesn't exist - skip it
    return false;
  }
}

/**
 * Filters and validates a list of skills directories
 */
export function validateSkillsDirs(dirs: string[]): string[] {
  return dirs.filter(dir => {
    try {
      if (!validateSkillsDir(dir)) {
        console.error(`[Security] Skipping invalid skills directory: ${sanitizePathForLog(dir)}`);
        return false;
      }
      return true;
    } catch (err) {
      console.error(`[Security] Skills directory validation failed: ${sanitizePathForLog(dir)}`);
      return false;
    }
  });
}

/**
 * Validates a directory entry name (no path separators or special chars)
 */
export function validateEntryName(name: string): boolean {
  // Must not contain path separators
  if (name.includes("/") || name.includes("\\")) {
    return false;
  }
  // Must not be . or ..
  if (name === "." || name === "..") {
    return false;
  }
  // Must match safe pattern
  return /^[a-zA-Z0-9_\-\.]+$/.test(name);
}

// ============================================
// Safe Error Handling
// ============================================

/**
 * Sanitizes a path for logging (only shows filename, hides full path)
 */
export function sanitizePathForLog(filePath: string): string {
  return path.basename(filePath);
}

/**
 * Creates a safe error response that doesn't leak sensitive information
 */
export function createSafeErrorResponse(error: unknown, context: string): string {
  // Log detailed error internally
  console.error(`[Error] ${context}:`, error);

  // Return generic error message to user
  if (error instanceof PathTraversalError) {
    return "Operation rejected: Invalid path";
  }
  if (error instanceof SymlinkEscapeError) {
    return "Operation rejected: Invalid file reference";
  }
  if (error instanceof ValidationError) {
    return `Validation failed: ${error.message}`;
  }
  if (error instanceof z.ZodError) {
    const issues = error.issues.map(i => i.message).join("; ");
    return `Validation failed: ${issues}`;
  }

  // Generic error
  return "Operation failed, please try again";
}

// ============================================
// Input Validation Helper Functions
// ============================================

/**
 * Validates and parses analyze_and_route arguments
 */
export function validateAnalyzeAndRouteArgs(args: unknown): {
  user_message: string;
  max_skills: number;
} {
  const result = AnalyzeAndRouteArgsSchema.safeParse(args);
  if (!result.success) {
    throw new ValidationError("Parameter validation failed", result.error);
  }
  return {
    user_message: result.data.user_message,
    max_skills: result.data.max_skills ?? 1,
  };
}

/**
 * Validates and parses skill_name argument
 */
export function validateSkillName(args: unknown): string {
  const result = LoadSkillArgsSchema.safeParse(args);
  if (!result.success) {
    throw new ValidationError("Skill name validation failed", result.error);
  }
  return result.data.skill_name;
}

/**
 * Validates and parses keyword argument
 */
export function validateKeyword(args: unknown): string {
  const result = SearchSkillsArgsSchema.safeParse(args);
  if (!result.success) {
    throw new ValidationError("Keyword validation failed", result.error);
  }
  return result.data.keyword;
}

/**
 * Validates and parses bundle name
 */
export function validateBundleName(name: string): string {
  const result = BundleNameSchema.safeParse(name);
  if (!result.success) {
    throw new ValidationError("Bundle name validation failed", result.error);
  }
  return result.data;
}

/**
 * Validates YAML skill bundle content
 */
export function validateSkillBundle(data: unknown): z.infer<typeof SkillBundleSchema> {
  const result = SkillBundleSchema.safeParse(data);
  if (!result.success) {
    throw new ValidationError("Invalid skill bundle format", result.error);
  }
  return result.data;
}
