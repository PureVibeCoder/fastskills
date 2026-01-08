/**
 * Skill metadata interface for the router
 */
export interface SkillMeta {
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
 * Search result with score and reason
 */
export interface SearchResult {
    skill: SkillMeta;
    score: number;
    reason: string;
}
/**
 * Intent types for task classification
 */
export declare enum IntentType {
    CREATE = "create",
    RESEARCH = "research",
    DEBUG = "debug",
    REFACTOR = "refactor",
    DOCUMENT = "document",
    TEST = "test",
    DEPLOY = "deploy",
    ANALYZE = "analyze",
    CONVERT = "convert",
    DESIGN = "design",
    OPTIMIZE = "optimize",
    UNKNOWN = "unknown"
}
/**
 * Intent pattern for matching
 */
export interface IntentPattern {
    intent: IntentType;
    patterns: RegExp[];
    weight: number;
}
/**
 * Load result for a skill
 */
export interface LoadResult {
    status: 'loaded' | 'already_loaded' | 'already_exists' | 'not_found' | 'error';
    path?: string;
    message?: string;
    skillId?: string;
    error?: string;
}
/**
 * Unload result for a skill
 */
export interface UnloadResult {
    status: 'unloaded' | 'not_found' | 'not_symlink' | 'error';
    skillId: string;
    message?: string;
}
/**
 * Path validation result
 */
export interface ValidationResult {
    valid: boolean;
    error?: string;
}
//# sourceMappingURL=types.d.ts.map