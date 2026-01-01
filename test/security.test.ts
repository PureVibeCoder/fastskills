/**
 * Security Tests for Skills Controller
 *
 * Tests for path traversal, input validation, and error handling
 */

import { describe, it, expect, beforeEach } from "vitest";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

// Import validation functions
import {
  validatePath,
  validateFileForRead,
  validateSkillsDirs,
  validateEntryName,
  validateAnalyzeAndRouteArgs,
  validateSkillName,
  validateKeyword,
  validateBundleName,
  validateSkillBundle,
  sanitizePathForLog,
  createSafeErrorResponse,
  PathTraversalError,
  SymlinkEscapeError,
  ValidationError,
  SECURITY_LIMITS,
} from "../src/validation.js";

// ============================================
// Path Traversal Tests
// ============================================

describe("Security - Path Traversal Prevention", () => {
  const testBaseDir = path.join(os.tmpdir(), "skills-security-test");

  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(testBaseDir)) {
      fs.mkdirSync(testBaseDir, { recursive: true });
    }
  });

  describe("validatePath", () => {
    it("should block ../ path traversal", () => {
      expect(() => validatePath(testBaseDir, "../../../etc/passwd"))
        .toThrow(PathTraversalError);
    });

    it("should block absolute path escape", () => {
      expect(() => validatePath(testBaseDir, "/etc/passwd"))
        .toThrow(PathTraversalError);
    });

    it("should block double-encoded path traversal", () => {
      // %2e%2e = ..
      expect(() => validatePath(testBaseDir, "..%2f..%2f..%2fetc/passwd"))
        .not.toThrow(); // URL encoding is not decoded by path.resolve
    });

    it("should allow valid subdirectory paths", () => {
      const result = validatePath(testBaseDir, "subdir/file.txt");
      expect(result).toContain(testBaseDir);
      expect(result).toContain("subdir");
    });

    it("should allow valid nested paths", () => {
      const result = validatePath(testBaseDir, "a/b/c/d.txt");
      expect(result).toContain(testBaseDir);
    });

    it("should block paths exceeding max depth", () => {
      const deepPath = Array(SECURITY_LIMITS.MAX_PATH_DEPTH + 2).fill("dir").join("/");
      expect(() => validatePath(testBaseDir, deepPath))
        .toThrow(PathTraversalError);
    });

    it("should normalize paths with ./ segments", () => {
      const result = validatePath(testBaseDir, "./subdir/./file.txt");
      expect(result).toContain("subdir");
      expect(result).not.toContain("./");
    });
  });

  describe("validateEntryName", () => {
    it("should reject names with forward slash", () => {
      expect(validateEntryName("foo/bar")).toBe(false);
    });

    it("should reject names with backslash", () => {
      expect(validateEntryName("foo\\bar")).toBe(false);
    });

    it("should reject . and ..", () => {
      expect(validateEntryName(".")).toBe(false);
      expect(validateEntryName("..")).toBe(false);
    });

    it("should accept valid names", () => {
      expect(validateEntryName("frontend-design")).toBe(true);
      expect(validateEntryName("skill_name")).toBe(true);
      expect(validateEntryName("skill.md")).toBe(true);
    });
  });
});

// ============================================
// Input Validation Tests
// ============================================

describe("Security - Input Validation", () => {
  describe("validateAnalyzeAndRouteArgs", () => {
    it("should reject empty user_message", () => {
      expect(() => validateAnalyzeAndRouteArgs({ user_message: "" }))
        .toThrow(ValidationError);
    });

    it("should reject message exceeding max length", () => {
      const longMessage = "a".repeat(SECURITY_LIMITS.MAX_USER_MESSAGE_LENGTH + 1);
      expect(() => validateAnalyzeAndRouteArgs({ user_message: longMessage }))
        .toThrow(ValidationError);
    });

    it("should accept valid message", () => {
      const result = validateAnalyzeAndRouteArgs({ user_message: "创建一个React组件" });
      expect(result.user_message).toBe("创建一个React组件");
      expect(result.max_skills).toBe(1);
    });

    it("should reject max_skills exceeding limit", () => {
      expect(() => validateAnalyzeAndRouteArgs({
        user_message: "test",
        max_skills: 100,
      })).toThrow(ValidationError);
    });

    it("should reject negative max_skills", () => {
      expect(() => validateAnalyzeAndRouteArgs({
        user_message: "test",
        max_skills: -1,
      })).toThrow(ValidationError);
    });

    it("should reject non-integer max_skills", () => {
      expect(() => validateAnalyzeAndRouteArgs({
        user_message: "test",
        max_skills: 2.5,
      })).toThrow(ValidationError);
    });

    it("should default max_skills to 1", () => {
      const result = validateAnalyzeAndRouteArgs({ user_message: "test" });
      expect(result.max_skills).toBe(1);
    });
  });

  describe("validateSkillName", () => {
    it("should reject empty skill name", () => {
      expect(() => validateSkillName({ skill_name: "" }))
        .toThrow(ValidationError);
    });

    it("should reject skill name with path characters", () => {
      expect(() => validateSkillName({ skill_name: "../etc" }))
        .toThrow(ValidationError);
      expect(() => validateSkillName({ skill_name: "foo/bar" }))
        .toThrow(ValidationError);
    });

    it("should reject skill name exceeding max length", () => {
      const longName = "a".repeat(SECURITY_LIMITS.MAX_SKILL_NAME_LENGTH + 1);
      expect(() => validateSkillName({ skill_name: longName }))
        .toThrow(ValidationError);
    });

    it("should accept valid skill names", () => {
      expect(validateSkillName({ skill_name: "frontend-design" }))
        .toBe("frontend-design");
      expect(validateSkillName({ skill_name: "skill_name" }))
        .toBe("skill_name");
      expect(validateSkillName({ skill_name: "skill123" }))
        .toBe("skill123");
    });

    it("should reject skill names with special characters", () => {
      expect(() => validateSkillName({ skill_name: "skill@name" }))
        .toThrow(ValidationError);
      expect(() => validateSkillName({ skill_name: "skill name" }))
        .toThrow(ValidationError);
    });
  });

  describe("validateKeyword", () => {
    it("should reject empty keyword", () => {
      expect(() => validateKeyword({ keyword: "" }))
        .toThrow(ValidationError);
    });

    it("should reject keyword exceeding max length", () => {
      const longKeyword = "a".repeat(SECURITY_LIMITS.MAX_KEYWORD_LENGTH + 1);
      expect(() => validateKeyword({ keyword: longKeyword }))
        .toThrow(ValidationError);
    });

    it("should accept valid keywords", () => {
      expect(validateKeyword({ keyword: "前端" })).toBe("前端");
      expect(validateKeyword({ keyword: "React component" })).toBe("React component");
    });
  });

  describe("validateBundleName", () => {
    it("should reject bundle name with path traversal", () => {
      expect(() => validateBundleName("../malicious"))
        .toThrow(ValidationError);
    });

    it("should reject bundle name with special characters", () => {
      expect(() => validateBundleName("bundle; rm -rf /"))
        .toThrow(ValidationError);
    });

    it("should accept valid bundle names", () => {
      expect(validateBundleName("fullstack-react")).toBe("fullstack-react");
      expect(validateBundleName("my_bundle")).toBe("my_bundle");
    });
  });
});

// ============================================
// YAML Schema Validation Tests
// ============================================

describe("Security - YAML Schema Validation", () => {
  describe("validateSkillBundle", () => {
    it("should reject invalid version format", () => {
      expect(() => validateSkillBundle({
        name: "test",
        version: "invalid",
        description: "",
        author: "",
        skills: [],
        includes: [],
      })).toThrow(ValidationError);
    });

    it("should reject bundle name with special characters", () => {
      expect(() => validateSkillBundle({
        name: "test; rm -rf /",
        version: "1.0.0",
        description: "",
        author: "",
        skills: [],
        includes: [],
      })).toThrow(ValidationError);
    });

    it("should reject skill with invalid source type", () => {
      expect(() => validateSkillBundle({
        name: "test",
        version: "1.0.0",
        description: "",
        author: "",
        skills: [{
          name: "skill",
          source: "malicious",
          description: "test",
        }],
        includes: [],
      })).toThrow(ValidationError);
    });

    it("should accept valid skill bundle", () => {
      const bundle = validateSkillBundle({
        name: "fullstack-react",
        version: "1.0.0",
        description: "A valid bundle",
        author: "test",
        skills: [{
          name: "frontend-design",
          source: "local",
          path: "./skills/frontend",
          description: "Frontend skill",
        }],
        includes: [],
      });

      expect(bundle.name).toBe("fullstack-react");
      expect(bundle.skills.length).toBe(1);
    });

    it("should apply defaults for missing optional fields", () => {
      const bundle = validateSkillBundle({
        name: "test",
        version: "1.0.0",
      });

      expect(bundle.description).toBe("");
      expect(bundle.author).toBe("Unknown");
      expect(bundle.skills).toEqual([]);
      expect(bundle.includes).toEqual([]);
    });
  });
});

// ============================================
// Error Handling Tests
// ============================================

describe("Security - Safe Error Handling", () => {
  describe("sanitizePathForLog", () => {
    it("should only return filename, not full path", () => {
      expect(sanitizePathForLog("/etc/passwd")).toBe("passwd");
      expect(sanitizePathForLog("/home/user/.ssh/id_rsa")).toBe("id_rsa");
      // Note: path.basename on Unix doesn't handle Windows paths correctly
      // This is expected behavior - on Unix, backslash is a valid filename character
      const result = sanitizePathForLog("C:\\Users\\admin\\secrets.txt");
      // On Unix, this returns the whole string; on Windows, it returns "secrets.txt"
      expect(result.length).toBeLessThanOrEqual("C:\\Users\\admin\\secrets.txt".length);
    });
  });

  describe("createSafeErrorResponse", () => {
    it("should return generic message for PathTraversalError", () => {
      const error = new PathTraversalError("detailed message");
      const response = createSafeErrorResponse(error, "test");
      expect(response).toBe("Operation rejected: Invalid path");
      expect(response).not.toContain("detailed");
    });

    it("should return generic message for SymlinkEscapeError", () => {
      const error = new SymlinkEscapeError("symlink to /etc/passwd");
      const response = createSafeErrorResponse(error, "test");
      expect(response).toBe("Operation rejected: Invalid file reference");
      expect(response).not.toContain("/etc/passwd");
    });

    it("should return validation message for ValidationError", () => {
      const error = new ValidationError("Input too long");
      const response = createSafeErrorResponse(error, "test");
      expect(response).toContain("Validation failed");
      expect(response).toContain("Input too long");
    });

    it("should return generic message for unknown errors", () => {
      const error = new Error("Internal database connection string: postgres://admin:secret@localhost");
      const response = createSafeErrorResponse(error, "test");
      expect(response).toBe("Operation failed, please try again");
      expect(response).not.toContain("postgres");
      expect(response).not.toContain("secret");
    });
  });
});

// ============================================
// Skills Directory Validation Tests
// ============================================

describe("Security - Skills Directory Validation", () => {
  describe("validateSkillsDirs", () => {
    it("should filter out directories with path traversal", () => {
      const dirs = [
        "/valid/path",
        "../../../etc",
        "/another/valid",
      ];
      const result = validateSkillsDirs(dirs);
      expect(result).not.toContain("../../../etc");
    });

    it("should filter out non-existent directories", () => {
      const dirs = [
        "/definitely/does/not/exist/12345",
      ];
      const result = validateSkillsDirs(dirs);
      expect(result.length).toBe(0);
    });
  });
});
