/**
 * Security Validation Module
 *
 * Provides input validation, path security, and safe error handling
 * to protect against path traversal, injection, and information leakage.
 */
import { z } from "zod";
export declare const SECURITY_LIMITS: {
    readonly MAX_USER_MESSAGE_LENGTH: 10000;
    readonly MAX_SKILL_NAME_LENGTH: 100;
    readonly MAX_KEYWORD_LENGTH: 200;
    readonly MAX_SKILLS_ACTIVATION: 5;
    readonly MAX_PATH_DEPTH: 10;
    readonly MAX_BUNDLE_NAME_LENGTH: 100;
    readonly MAX_DESCRIPTION_LENGTH: 1000;
    readonly MAX_PATH_LENGTH: 500;
};
export declare class PathTraversalError extends Error {
    constructor(message?: string);
}
export declare class SymlinkEscapeError extends Error {
    constructor(message?: string);
}
export declare class ValidationError extends Error {
    details?: z.ZodError | undefined;
    constructor(message: string, details?: z.ZodError | undefined);
}
export declare const SkillNameSchema: z.ZodString;
export declare const UserMessageSchema: z.ZodString;
export declare const KeywordSchema: z.ZodString;
export declare const MaxSkillsSchema: z.ZodDefault<z.ZodNumber>;
export declare const AnalyzeAndRouteArgsSchema: z.ZodObject<{
    user_message: z.ZodString;
    max_skills: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
export declare const LoadSkillArgsSchema: z.ZodObject<{
    skill_name: z.ZodString;
}, z.core.$strip>;
export declare const DeactivateSkillArgsSchema: z.ZodObject<{
    skill_name: z.ZodString;
}, z.core.$strip>;
export declare const SearchSkillsArgsSchema: z.ZodObject<{
    keyword: z.ZodString;
}, z.core.$strip>;
export declare const BundleNameSchema: z.ZodString;
export declare const SkillBundleSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
    author: z.ZodDefault<z.ZodString>;
    skills: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        source: z.ZodEnum<{
            local: "local";
            plugin: "plugin";
        }>;
        path: z.ZodOptional<z.ZodString>;
        plugin_id: z.ZodOptional<z.ZodString>;
        description: z.ZodString;
        triggers: z.ZodOptional<z.ZodArray<z.ZodString>>;
        always_active: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    includes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        source: z.ZodString;
        target: z.ZodString;
        merge: z.ZodOptional<z.ZodBoolean>;
        overwrite: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/**
 * Validates that a path stays within a base directory (prevents path traversal)
 * @param basePath The allowed base directory
 * @param targetPath The path to validate (can be relative or absolute)
 * @returns The normalized absolute path if valid
 * @throws PathTraversalError if path escapes base directory
 */
export declare function validatePath(basePath: string, targetPath: string): string;
/**
 * Validates a file path for reading, including symlink detection
 * @param basePath The allowed base directory
 * @param filePath The file path to validate
 * @returns The validated absolute path
 * @throws PathTraversalError or SymlinkEscapeError
 */
export declare function validateFileForRead(basePath: string, filePath: string): string;
/**
 * Validates a single skills directory path
 */
export declare function validateSkillsDir(dir: string): boolean;
/**
 * Filters and validates a list of skills directories
 */
export declare function validateSkillsDirs(dirs: string[]): string[];
/**
 * Validates a directory entry name (no path separators or special chars)
 */
export declare function validateEntryName(name: string): boolean;
/**
 * Sanitizes a path for logging (only shows filename, hides full path)
 */
export declare function sanitizePathForLog(filePath: string): string;
/**
 * Creates a safe error response that doesn't leak sensitive information
 */
export declare function createSafeErrorResponse(error: unknown, context: string): string;
/**
 * Validates and parses analyze_and_route arguments
 */
export declare function validateAnalyzeAndRouteArgs(args: unknown): {
    user_message: string;
    max_skills: number;
};
/**
 * Validates and parses skill_name argument
 */
export declare function validateSkillName(args: unknown): string;
/**
 * Validates and parses keyword argument
 */
export declare function validateKeyword(args: unknown): string;
/**
 * Validates and parses bundle name
 */
export declare function validateBundleName(name: string): string;
/**
 * Validates YAML skill bundle content
 */
export declare function validateSkillBundle(data: unknown): z.infer<typeof SkillBundleSchema>;
