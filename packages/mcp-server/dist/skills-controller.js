/**
 * Skills Controller MCP Server
 *
 * 智能技能编排控制器 - 根据上下文动态激活/停用技能
 * 自动扫描并加载技能库中的所有技能
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { validateSkillsDirs, validatePath, validateFileForRead, validateEntryName, validateAnalyzeAndRouteArgs, validateSkillName, validateKeyword, sanitizePathForLog, createSafeErrorResponse, PathTraversalError, } from "./validation.js";
import { detectLanguage } from "./i18n.js";
// ============================================
// 类型定义（必须在使用前声明）
// ============================================
/**
 * 用户意图类型枚举
 */
var IntentType;
(function (IntentType) {
    IntentType["CREATE"] = "create";
    IntentType["RESEARCH"] = "research";
    IntentType["DEBUG"] = "debug";
    IntentType["REFACTOR"] = "refactor";
    IntentType["DOCUMENT"] = "document";
    IntentType["TEST"] = "test";
    IntentType["TEST_WRITE_UNIT"] = "test_write_unit";
    IntentType["TEST_WRITE_INTEGRATION"] = "test_write_integration";
    IntentType["TEST_WRITE_E2E"] = "test_write_e2e";
    IntentType["TEST_RUN"] = "test_run";
    IntentType["DEPLOY"] = "deploy";
    IntentType["ANALYZE"] = "analyze";
    IntentType["CONVERT"] = "convert";
    IntentType["CHAT"] = "chat";
    IntentType["UNKNOWN"] = "unknown";
})(IntentType || (IntentType = {}));
// ============================================
// 配置
// ============================================
// 技能库目录（支持多个目录，用逗号分隔）
// 优先级：用户本地 > Anthropic 官方 > ClaudeKit > 社区
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// In compiled code: __dirname = packages/mcp-server/dist
// packageRoot should point to project root (../../..)
const packageRoot = path.resolve(__dirname, "..", "..", "..");
const DEFAULT_SKILLS_DIRS = [
    path.join(process.env.HOME || "", ".claude", "skills"), // 用户本地技能(最高优先级)
    path.join(packageRoot, "superpowers", "skills"), // Superpowers 核心技能库 (⭐13k)
    path.join(packageRoot, "claudekit-skills", ".claude", "skills"), // ClaudeKit 技能 (⭐1.1k)
    path.join(packageRoot, "deep-research-skills", ".claude", "skills"), // Deep Research 技能 (⭐55)
];
// Validate and filter skills directories
const rawSkillsDirs = process.env.SKILLS_DIR
    ? process.env.SKILLS_DIR.split(",").map(d => d.trim()).filter(d => d.length > 0)
    : DEFAULT_SKILLS_DIRS;
const SKILLS_DIRS = validateSkillsDirs(rawSkillsDirs);
// 额外的触发词映射（用于增强匹配）- 支持中英文
const EXTRA_TRIGGERS = {
    // === Anthropic 官方技能 ===
    "algorithmic-art": {
        zh: ["算法艺术", "生成艺术", "艺术", "算法绘画"],
        en: ["algorithmic art", "generative art", "art", "procedural", "generative"],
    },
    "doc-coauthoring": {
        zh: ["协作", "共同编辑", "文档协作", "协同写作"],
        en: ["coauthor", "collaboration", "document collaboration", "co-authoring"],
    },
    "docx": {
        zh: ["Word", "文档", "办公文档"],
        en: ["docx", "doc", "word", "microsoft word", "office document"],
    },
    "pdf": {
        zh: ["PDF", "pdf文件", "导出PDF", "PDF生成", "便携文档"],
        en: ["pdf", "pdf file", "export pdf", "pdf generation"],
    },
    "pptx": {
        zh: ["PPT", "演示文稿", "PowerPoint", "幻灯片"],
        en: ["pptx", "ppt", "powerpoint", "slides", "presentation"],
    },
    "xlsx": {
        zh: ["Excel", "电子表格", "表格", "数据分析"],
        en: ["xlsx", "excel", "spreadsheet", "data analysis"],
    },
    "web-artifacts-builder": {
        zh: ["网页工件", "HTML生成", "网页构建"],
        en: ["web artifacts", "html generation", "web builder"],
    },
    "frontend-design": {
        zh: ["设计", "UI", "样式", "组件", "页面", "布局", "CSS", "React", "Vue", "前端", "界面", "交互"],
        en: ["design", "ui", "styling", "component", "page", "layout", "css", "react", "vue", "frontend", "interface", "interaction"],
    },
    // === 用户本地技能（最高优先级）===
    "modern-frontend-design": {
        zh: ["现代前端", "前端设计", "UI设计", "界面设计", "设计系统", "美学", "视觉", "React设计", "Vue设计", "组件设计"],
        en: ["modern frontend", "frontend design", "ui design", "interface design", "design system", "aesthetic", "visual", "react design", "vue design", "component design", "neo-brutalist", "glassmorphism", "art deco"],
    },
    "open-source-librarian": {
        zh: ["开源", "开源库", "库实现", "源码", "GitHub", "源代码", "代码引用", "查源码", "看源码", "读源码", "开源项目", "原理", "实现原理", "怎么实现", "如何工作", "工作机制", "底层", "内部实现", "响应式原理", "虚拟DOM原理", "组件原理", "底层原理", "核心原理"],
        en: ["open source", "library", "implementation", "source code", "github", "permalink", "code reference", "check source", "view source", "read source", "principle", "implementation principle", "how to implement", "how it works", "mechanism", "underlying", "internal", "reactivity", "virtual dom", "component"],
    },
    "browser": {
        zh: ["浏览器", "Chrome", "CDP", "DevTools", "自动化", "抓取", "截图"],
        en: ["browser", "chrome", "cdp", "devtools", "automation", "scraping", "screenshot", "puppeteer"],
    },
    // === ClaudeKit 独有技能 ===
    "aesthetic": {
        zh: ["美学", "审美", "视觉风格", "设计感"],
        en: ["aesthetic", "visual style", "design sense"],
    },
    "ai-multimodal": {
        zh: ["多模态", "图像理解", "视觉AI"],
        en: ["multimodal", "vision", "image understanding", "visual ai"],
    },
    "backend-development": {
        zh: ["后端", "服务端", "API开发"],
        en: ["backend", "server", "api development", "backend development"],
    },
    "better-auth": {
        zh: ["认证", "授权", "登录"],
        en: ["auth", "authentication", "authorization", "login", "jwt"],
    },
    "chrome-devtools": {
        zh: ["Chrome", "DevTools", "浏览器调试", "开发者工具"],
        en: ["chrome", "devtools", "browser debugging", "developer tools"],
    },
    "claude-code": {
        zh: ["Claude Code", "CLI", "命令行"],
        en: ["claude code", "cli", "command line"],
    },
    "collision-zone-thinking": {
        zh: ["碰撞思维", "问题分析", "矛盾分析"],
        en: ["collision zone", "problem analysis", "contradiction"],
    },
    "context-engineering": {
        zh: ["上下文工程", "prompt工程", "提示词"],
        en: ["context engineering", "prompt engineering", "prompt"],
    },
    "databases": {
        zh: ["数据库", "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis"],
        en: ["database", "sql", "mysql", "postgresql", "mongodb", "redis"],
    },
    "defense-in-depth": {
        zh: ["深度防御", "安全策略", "多层防护"],
        en: ["defense in depth", "security strategy", "layered defense"],
    },
    "devops": {
        zh: ["DevOps", "CI/CD", "部署", "运维", "Docker", "K8s"],
        en: ["devops", "ci/cd", "deployment", "operations", "docker", "kubernetes"],
    },
    "docs-seeker": {
        zh: ["文档搜索", "API文档", "查文档"],
        en: ["docs search", "api documentation", "documentation"],
    },
    "frontend-development": {
        zh: ["前端开发", "JavaScript", "TypeScript", "框架"],
        en: ["frontend development", "javascript", "typescript", "framework"],
    },
    "google-adk-python": {
        zh: ["Google ADK", "Python", "Google API"],
        en: ["google adk", "python", "google api"],
    },
    "inversion-exercise": {
        zh: ["逆向思维", "反向推理"],
        en: ["inversion", "reverse thinking"],
    },
    "mcp-management": {
        zh: ["MCP管理", "服务器管理"],
        en: ["mcp management", "server management"],
    },
    "media-processing": {
        zh: ["媒体处理", "音视频", "转码", "剪辑"],
        en: ["media processing", "audio video", "transcoding", "editing"],
    },
    "mermaidjs-v11": {
        zh: ["Mermaid", "流程图", "时序图", "图表绘制"],
        en: ["mermaid", "flowchart", "sequence diagram", "chart"],
    },
    "meta-pattern-recognition": {
        zh: ["模式识别", "元认知", "规律发现"],
        en: ["pattern recognition", "metacognition", "pattern discovery"],
    },
    "repomix": {
        zh: ["代码库", "仓库分析", "代码统计"],
        en: ["codebase", "repository analysis", "code stats"],
    },
    "root-cause-tracing": {
        zh: ["根因分析", "问题追踪", "故障排查"],
        en: ["root cause", "problem tracing", "troubleshooting"],
    },
    "scale-game": {
        zh: ["规模化", "扩展性", "性能优化"],
        en: ["scale", "scalability", "performance optimization"],
    },
    "sequential-thinking": {
        zh: ["顺序思考", "逐步推理"],
        en: ["sequential thinking", "step by step", "reasoning"],
    },
    "shopify": {
        zh: ["Shopify", "电商", "在线商店"],
        en: ["shopify", "ecommerce", "online store"],
    },
    "simplification-cascades": {
        zh: ["简化", "降复杂度", "重构"],
        en: ["simplification", "reduce complexity", "refactor"],
    },
    "systematic-debugging": {
        zh: ["系统调试", "debug", "排错"],
        en: ["systematic debugging", "debug", "troubleshoot"],
    },
    "ui-styling": {
        zh: ["UI样式", "CSS", "样式设计"],
        en: ["ui styling", "css", "styling"],
    },
    "verification-before-completion": {
        zh: ["验证", "检查", "确认完成"],
        en: ["verification", "check", "confirm completion"],
    },
    "web-frameworks": {
        zh: ["Web框架", "Express", "Fastify", "Koa", "Next.js"],
        en: ["web framework", "express", "fastify", "koa", "next.js"],
    },
    "when-stuck": {
        zh: ["卡住", "困难", "求助"],
        en: ["stuck", "difficulty", "help"],
    },
    // === 社区技能 ===
    "webapp-testing": {
        zh: ["E2E", "e2e", "端到端测试", "playwright", "浏览器测试", "web测试", "前端测试", "自动化测试", "UI测试", "网页测试"],
        en: ["e2e", "end to end test", "playwright", "browser test", "web test", "frontend test", "automation test", "ui test"],
    },
    "code-review": {
        zh: ["审查", "review", "PR", "代码质量", "bug", "安全"],
        en: ["review", "code review", "pr", "pull request", "code quality", "bug", "security"],
    },
    "mcp-builder": {
        zh: ["MCP", "服务器", "集成", "工具开发", "API"],
        en: ["mcp", "server", "integration", "tool development", "api"],
    },
    "skill-creator": {
        zh: ["创建技能", "新技能", "技能开发"],
        en: ["create skill", "new skill", "skill development"],
    },
    "document-skills": {
        zh: ["文档", "Markdown", "PDF", "Word", "文件"],
        en: ["documentation", "markdown", "pdf", "word", "file"],
    },
    "canvas-design": {
        zh: ["画布", "图表", "可视化", "Canvas", "图形"],
        en: ["canvas", "chart", "visualization", "graphics"],
    },
    "artifacts-builder": {
        zh: ["artifacts", "构建", "生成器"],
        en: ["artifacts", "builder", "generator"],
    },
    "brand-guidelines": {
        zh: ["品牌", "指南", "风格"],
        en: ["brand", "guidelines", "style"],
    },
    "content-research-writer": {
        zh: ["研究", "调研", "内容", "写作"],
        en: ["research", "content", "writing"],
    },
    "changelog-generator": {
        zh: ["changelog", "更新日志", "版本"],
        en: ["changelog", "update log", "version"],
    },
    "image-enhancer": {
        zh: ["图片", "图像", "增强"],
        en: ["image", "picture", "enhance"],
    },
    "file-organizer": {
        zh: ["文件", "整理", "组织"],
        en: ["file", "organize", "organization"],
    },
    "invoice-organizer": {
        zh: ["发票", "账单"],
        en: ["invoice", "bill"],
    },
    "meeting-insights-analyzer": {
        zh: ["会议", "分析"],
        en: ["meeting", "analysis"],
    },
    "lead-research-assistant": {
        zh: ["线索", "调研"],
        en: ["lead", "research"],
    },
    "domain-name-brainstormer": {
        zh: ["域名", "命名"],
        en: ["domain", "naming"],
    },
    "developer-growth-analysis": {
        zh: ["开发者", "成长", "分析"],
        en: ["developer", "growth", "analysis"],
    },
    "internal-comms": {
        zh: ["内部沟通", "通讯"],
        en: ["internal communication", "communication"],
    },
    "slack-gif-creator": {
        zh: ["slack", "gif", "动图"],
        en: ["slack", "gif", "animated"],
    },
    "video-downloader": {
        zh: ["视频", "下载"],
        en: ["video", "download"],
    },
    "theme-factory": {
        zh: ["主题", "皮肤"],
        en: ["theme", "skin"],
    },
    "raffle-winner-picker": {
        zh: ["抽奖", "随机"],
        en: ["raffle", "random", "winner"],
    },
    "competitive-ads-extractor": {
        zh: ["广告", "竞品"],
        en: ["ads", "advertisement", "competitor"],
    },
    // === Deep Research 技能 ===
    "question-refiner": {
        zh: ["问题精炼", "精炼问题", "澄清研究", "研究问题", "提炼问题"],
        en: ["question refiner", "refine question", "clarify research", "research question", "question clarification"],
    },
    "research-executor": {
        zh: ["深度研究", "研究执行", "多智能体研究", "并行研究", "研究报告", "学术研究"],
        en: ["deep research", "research executor", "multi-agent research", "parallel research", "research report", "academic research"],
    },
    "got-controller": {
        zh: ["思维图", "Graph of Thoughts", "研究优化", "GoT", "图操作"],
        en: ["graph of thoughts", "got", "thought graph", "research optimization", "graph operations"],
    },
    "citation-validator": {
        zh: ["引用验证", "来源质量", "引用完整性", "文献验证", "引用检查"],
        en: ["citation validator", "source quality", "citation integrity", "reference validation", "citation check"],
    },
    "synthesizer": {
        zh: ["研究综合", "报告生成", "发现总结", "综合报告", "研究汇总"],
        en: ["research synthesizer", "report generation", "findings summary", "synthesis report", "research compilation"],
    },
};
// ============================================
// 意图识别模式 - 支持中英文
// ============================================
const INTENT_PATTERNS = [
    {
        intent: IntentType.CREATE,
        patterns: [
            // Chinese patterns
            /创建|新建|生成|开发|实现|构建|搭建|设计|制作|编写|写一个|做一个|想一个|想出/,
            /帮我.*(页面|组件|界面|功能|网站|应用)/,
            // English patterns
            /create|build|implement|develop|make|design|generate|write|think of/i,
            /add\s+(a|new)|implement\s+new/i,
        ],
        weight: 10,
    },
    {
        intent: IntentType.RESEARCH,
        patterns: [
            // Chinese patterns
            /查看|查阅|研究|阅读|看看|学习/,
            /源码|源代码|实现原理|怎么实现|如何工作|底层|内部/,
            /原理|工作机制|内部实现|底层原理|核心原理/,
            // English patterns
            /look\s+at|examine|study|research|read/i,
            /implementation|source\s*code|how\s+.*\s+works|internals/i,
        ],
        weight: 10,
    },
    // 原理研究高优先级模式
    {
        intent: IntentType.RESEARCH,
        patterns: [
            // Chinese patterns
            /了解.*原理|理解.*原理|学习.*原理|研究.*原理/,
            /.*响应式原理|.*虚拟DOM原理|.*组件原理|.*框架原理/,
            // English patterns
            /how.*works|understand.*implementation|explain.*internals/i,
        ],
        weight: 12,
    },
    {
        intent: IntentType.DEBUG,
        patterns: [
            // Chinese patterns
            /修复|修bug|调试|排错|解决.*问题|为什么.*不工作|报错|错误|异常|失败/,
            // English patterns
            /fix|debug|troubleshoot|solve|error|bug|issue|problem/i,
            /why\s+.*\s+not\s+working|doesn't\s+work/i,
        ],
        weight: 8,
    },
    {
        intent: IntentType.REFACTOR,
        patterns: [
            // Chinese patterns
            /重构|优化|改进|简化|整理|清理|提升性能/,
            // English patterns
            /refactor|optimize|improve|simplify|clean\s*up|performance/i,
        ],
        weight: 7,
    },
    {
        intent: IntentType.DOCUMENT,
        patterns: [
            // Chinese patterns
            /文档|说明|注释|写文档|添加注释|编写说明|生成文档/,
            // English patterns
            /document|comment|annotation|readme|changelog|api\s*doc/i,
        ],
        weight: 6,
    },
    {
        intent: IntentType.TEST,
        patterns: [
            /测试|test|单元测试|集成测试|e2e|端到端/i,
        ],
        weight: 6,
    },
    // 运行测试
    {
        intent: IntentType.TEST_RUN,
        patterns: [
            // Chinese patterns
            /运行.*测试|执行测试|跑测试/,
            // English patterns
            /run.*test|execute.*test|test.*run/i,
            /npm\s+test|npm\s+test:run|vitest|jest|playwright\s+test/i,
        ],
        weight: 8,
    },
    // 编写单元测试
    {
        intent: IntentType.TEST_WRITE_UNIT,
        patterns: [
            // Chinese patterns
            /写单元测试|编写单元测试|添加单元测试|创建单元测试/,
            // English patterns
            /write.*unit.*test|create.*unit.*test|add.*unit.*test/i,
        ],
        weight: 7,
    },
    // 编写集成测试
    {
        intent: IntentType.TEST_WRITE_INTEGRATION,
        patterns: [
            // Chinese patterns
            /写集成测试|编写集成测试|添加集成测试|创建集成测试/,
            // English patterns
            /write.*integration.*test|create.*integration.*test/i,
        ],
        weight: 7,
    },
    // 编写E2E测试
    {
        intent: IntentType.TEST_WRITE_E2E,
        patterns: [
            // Chinese patterns
            /写E2E测试|编写端到端测试|添加E2E测试|创建E2E测试/,
            /写e2e|e2e测试|端到端/,
            // English patterns
            /write.*e2e.*test|create.*e2e.*test|end.*to.*end.*test/i,
        ],
        weight: 7,
    },
    {
        intent: IntentType.ANALYZE,
        patterns: [
            // Chinese patterns
            /审查|分析|检查|评估|诊断|代码审查/,
            // English patterns
            /analyze|inspect|evaluate|assess/i,
            /code\s*review|pr|pull\s*request/i,
        ],
        weight: 7,
    },
    {
        intent: IntentType.CONVERT,
        patterns: [
            // Chinese patterns
            /转换|转成|导出|转为|格式化|生成.*文件|导出.*格式/,
            // English patterns
            /convert|export|transform\s+to|format\s+as/i,
        ],
        weight: 5,
    },
    {
        intent: IntentType.DEPLOY,
        patterns: [
            // Chinese patterns
            /部署|发布|上线|打包|构建发布/,
            // English patterns
            /deploy|release|publish|ship|launch/i,
        ],
        weight: 5,
    },
    {
        intent: IntentType.CHAT,
        patterns: [
            // Chinese patterns
            /你好|嗨|谢谢|是什么|什么是|解释|介绍/,
            // English patterns
            /hello|hi|thanks|what\s+is|explain|tell\s+me\s+about/i,
        ],
        weight: 3,
    },
];
// ============================================
// 增强的技能配置（意图感知）- 支持中英文触发词
// ============================================
const SKILL_CONFIGS = {
    // === 前端设计类：需要 CREATE/REFACTOR 意图，排除 RESEARCH ===
    "frontend-design": {
        triggers: [
            { word: "设计", weight: 3 },
            { word: "UI", weight: 4 },
            { word: "界面", weight: 4 },
            { word: "组件", weight: 3 },
            { word: "页面", weight: 3 },
            { word: "布局", weight: 4 },
            { word: "CSS", weight: 3 },
            { word: "React", weight: 2 },
            { word: "Vue", weight: 2 },
            { word: "前端", weight: 2 },
            // English
            { word: "design", weight: 3 },
            { word: "interface", weight: 4 },
            { word: "component", weight: 3 },
            { word: "page", weight: 3 },
            { word: "layout", weight: 4 },
            { word: "frontend", weight: 2 },
        ],
        excludes: [
            // Chinese
            "源码", "源代码",
            "实现原理", "怎么实现", "如何工作",
            "工作机制", "内部实现", "底层原理", "核心原理",
            // English
            "source code", "implementation", "internals", "how it works",
        ],
        requiredIntents: [IntentType.CREATE, IntentType.REFACTOR],
        excludedIntents: [IntentType.RESEARCH, IntentType.ANALYZE],
        priority: 6,
    },
    "modern-frontend-design": {
        triggers: [
            { word: "现代前端", weight: 5 },
            { word: "设计系统", weight: 5 },
            { word: "美学", weight: 4 },
            { word: "视觉", weight: 3 },
            { word: "neo-brutalist", weight: 6 },
            { word: "glassmorphism", weight: 6 },
            // English
            { word: "design system", weight: 5 },
            { word: "aesthetic", weight: 4 },
            { word: "visual", weight: 3 },
        ],
        excludes: ["源码", "源代码", "source code"],
        requiredIntents: [IntentType.CREATE],
        excludedIntents: [IntentType.RESEARCH],
        priority: 7,
    },
    "aesthetic": {
        excludes: ["源码", "实现", "source code", "implementation"],
        requiredIntents: [IntentType.CREATE],
        excludedIntents: [IntentType.RESEARCH],
        priority: 5,
    },
    "ui-styling": {
        excludes: ["源码", "实现原理", "source code", "implementation"],
        requiredIntents: [IntentType.CREATE, IntentType.REFACTOR],
        excludedIntents: [IntentType.RESEARCH],
        priority: 5,
    },
    "web-artifacts-builder": {
        requiredIntents: [IntentType.CREATE],
        excludedIntents: [IntentType.RESEARCH],
        priority: 5,
    },
    "artifacts-builder": {
        requiredIntents: [IntentType.CREATE],
        excludedIntents: [IntentType.RESEARCH],
        priority: 5,
    },
    "canvas-design": {
        requiredIntents: [IntentType.CREATE],
        excludedIntents: [IntentType.RESEARCH],
        priority: 5,
    },
    "theme-factory": {
        requiredIntents: [IntentType.CREATE],
        excludedIntents: [IntentType.RESEARCH],
        priority: 5,
    },
    // === 后端开发类：需要 CREATE/DEBUG 意图 ===
    "backend-development": {
        excludes: ["源码", "实现原理", "source code", "implementation"],
        requiredIntents: [IntentType.CREATE, IntentType.DEBUG, IntentType.REFACTOR],
        excludedIntents: [IntentType.RESEARCH],
        priority: 6,
    },
    "frontend-development": {
        excludes: ["源码", "实现原理", "source code", "implementation"],
        requiredIntents: [IntentType.CREATE, IntentType.DEBUG, IntentType.REFACTOR],
        excludedIntents: [IntentType.RESEARCH],
        priority: 6,
    },
    "web-frameworks": {
        excludes: ["源码", "源代码", "实现", "source code", "implementation"],
        requiredIntents: [IntentType.CREATE, IntentType.DEBUG],
        excludedIntents: [IntentType.RESEARCH],
        priority: 5,
    },
    // === 数据库类：需要 CREATE/DEBUG 意图 ===
    "databases": {
        excludes: ["源码", "实现原理", "source code", "implementation"],
        requiredIntents: [IntentType.CREATE, IntentType.DEBUG, IntentType.REFACTOR],
        excludedIntents: [IntentType.RESEARCH],
        priority: 6,
    },
    // === 测试类：E2E Web 应用测试 ===
    "webapp-testing": {
        triggers: [
            { word: "E2E", weight: 6 },
            { word: "e2e", weight: 6 },
            { word: "端到端测试", weight: 6 },
            { word: "playwright", weight: 7 },
            { word: "浏览器测试", weight: 5 },
            { word: "web测试", weight: 5 },
            // English
            { word: "end to end test", weight: 6 },
            { word: "browser test", weight: 5 },
            { word: "web test", weight: 5 },
        ],
        requiredIntents: [
            IntentType.TEST_RUN, // 运行E2E测试
            IntentType.TEST_WRITE_E2E, // 编写E2E测试
        ],
        excludedIntents: [
            IntentType.TEST_WRITE_UNIT, // 排除编写单元测试
            IntentType.TEST_WRITE_INTEGRATION, // 排除编写集成测试
        ],
        priority: 6,
    },
    // === 代码分析类：需要 ANALYZE/RESEARCH 意图 ===
    "code-review": {
        triggers: [
            { word: "审查", weight: 5 },
            { word: "代码质量", weight: 4 },
            // English
            { word: "review", weight: 5 },
            { word: "code review", weight: 5 },
            { word: "pr", weight: 4 },
        ],
        requiredIntents: [IntentType.ANALYZE],
        priority: 7,
    },
    "open-source-librarian": {
        triggers: [
            { word: "源码", weight: 6 },
            { word: "源代码", weight: 6 },
            { word: "开源", weight: 4 },
            { word: "原理", weight: 6 },
            { word: "响应式原理", weight: 8 },
            { word: "虚拟DOM原理", weight: 8 },
            { word: "组件原理", weight: 8 },
            { word: "实现原理", weight: 7 },
            { word: "怎么实现", weight: 5 },
            { word: "如何工作", weight: 6 },
            { word: "工作机制", weight: 6 },
            { word: "底层", weight: 5 },
            { word: "内部实现", weight: 6 },
            { word: "底层原理", weight: 7 },
            { word: "核心原理", weight: 7 },
            { word: "查源码", weight: 7 },
            { word: "看源码", weight: 7 },
            { word: "读源码", weight: 7 },
            // English
            { word: "source code", weight: 6 },
            { word: "open source", weight: 4 },
            { word: "implementation", weight: 5 },
            { word: "principle", weight: 6 },
            { word: "reactivity", weight: 8 },
            { word: "virtual dom", weight: 8 },
            { word: "how it works", weight: 6 },
            { word: "underlying", weight: 5 },
            { word: "internal", weight: 6 },
        ],
        requiredIntents: [IntentType.RESEARCH, IntentType.ANALYZE],
        priority: 8,
    },
    "repomix": {
        requiredIntents: [IntentType.ANALYZE, IntentType.RESEARCH],
        priority: 5,
    },
    "root-cause-tracing": {
        requiredIntents: [IntentType.DEBUG, IntentType.ANALYZE],
        priority: 6,
    },
    "systematic-debugging": {
        requiredIntents: [IntentType.DEBUG],
        priority: 7,
    },
    "when-stuck": {
        requiredIntents: [IntentType.DEBUG],
        priority: 5,
    },
    // === 文档类：需要 DOCUMENT/CREATE 意图 ===
    "doc-coauthoring": {
        requiredIntents: [IntentType.DOCUMENT, IntentType.CREATE],
        priority: 6,
    },
    "document-skills": {
        requiredIntents: [IntentType.DOCUMENT, IntentType.CREATE],
        priority: 5,
    },
    "docs-seeker": {
        requiredIntents: [IntentType.RESEARCH, IntentType.DOCUMENT],
        priority: 5,
    },
    "changelog-generator": {
        requiredIntents: [IntentType.DOCUMENT, IntentType.CREATE],
        priority: 5,
    },
    "content-research-writer": {
        requiredIntents: [IntentType.DOCUMENT, IntentType.RESEARCH, IntentType.CREATE],
        priority: 5,
    },
    // === 格式转换类：需要 CONVERT 意图 ===
    "pdf": {
        triggers: [
            { word: "PDF", weight: 5 },
            { word: "pdf文件", weight: 5 },
            { word: "导出PDF", weight: 6 },
        ],
        requiredIntents: [IntentType.CONVERT, IntentType.CREATE],
        priority: 6,
    },
    "docx": {
        triggers: [
            { word: "Word", weight: 5 },
            { word: "文档", weight: 3 },
        ],
        requiredIntents: [IntentType.CONVERT, IntentType.CREATE],
        priority: 6,
    },
    "pptx": {
        triggers: [
            { word: "PPT", weight: 5 },
            { word: "PowerPoint", weight: 5 },
            { word: "幻灯片", weight: 5 },
        ],
        requiredIntents: [IntentType.CONVERT, IntentType.CREATE],
        priority: 6,
    },
    "xlsx": {
        triggers: [
            { word: "Excel", weight: 5 },
            { word: "电子表格", weight: 5 },
        ],
        requiredIntents: [IntentType.CONVERT, IntentType.CREATE],
        priority: 6,
    },
    // === DevOps 类：需要 DEPLOY/CREATE 意图 ===
    "devops": {
        requiredIntents: [IntentType.DEPLOY, IntentType.CREATE],
        priority: 6,
    },
    // === 浏览器自动化类 ===
    "browser": {
        triggers: [
            { word: "浏览器", weight: 4 },
            { word: "Chrome", weight: 4 },
            { word: "CDP", weight: 5 },
            { word: "自动化", weight: 3 },
            { word: "截图", weight: 4 },
        ],
        requiredIntents: [IntentType.CREATE, IntentType.TEST],
        priority: 5,
    },
    "chrome-devtools": {
        requiredIntents: [IntentType.DEBUG, IntentType.ANALYZE],
        priority: 5,
    },
    // === 认证授权类 ===
    "better-auth": {
        excludes: ["源码", "实现原理", "source code", "implementation"],
        requiredIntents: [IntentType.CREATE, IntentType.DEBUG],
        excludedIntents: [IntentType.RESEARCH],
        priority: 6,
    },
    // === AI/多模态类 ===
    "ai-multimodal": {
        requiredIntents: [IntentType.CREATE, IntentType.ANALYZE],
        priority: 5,
    },
    // === MCP/工具类 ===
    "mcp-builder": {
        requiredIntents: [IntentType.CREATE],
        priority: 6,
    },
    "mcp-management": {
        requiredIntents: [IntentType.CREATE, IntentType.DEBUG],
        priority: 5,
    },
    "skill-creator": {
        requiredIntents: [IntentType.CREATE],
        priority: 6,
    },
    // === 媒体处理类 ===
    "media-processing": {
        requiredIntents: [IntentType.CONVERT, IntentType.CREATE],
        priority: 5,
    },
    "image-enhancer": {
        requiredIntents: [IntentType.CREATE, IntentType.REFACTOR],
        priority: 5,
    },
    "video-downloader": {
        requiredIntents: [IntentType.CREATE],
        priority: 4,
    },
    "slack-gif-creator": {
        requiredIntents: [IntentType.CREATE],
        priority: 4,
    },
    // === 图表/可视化类 ===
    "mermaidjs-v11": {
        requiredIntents: [IntentType.CREATE, IntentType.DOCUMENT],
        priority: 5,
    },
    "algorithmic-art": {
        requiredIntents: [IntentType.CREATE],
        priority: 5,
    },
    // === 思维/方法论类：允许更多意图 ===
    "collision-zone-thinking": {
        priority: 4,
    },
    "context-engineering": {
        priority: 4,
    },
    "defense-in-depth": {
        priority: 4,
    },
    "inversion-exercise": {
        priority: 4,
    },
    "meta-pattern-recognition": {
        priority: 4,
    },
    "scale-game": {
        priority: 4,
    },
    "sequential-thinking": {
        priority: 4,
    },
    "simplification-cascades": {
        requiredIntents: [IntentType.REFACTOR],
        priority: 5,
    },
    "verification-before-completion": {
        requiredIntents: [IntentType.TEST, IntentType.ANALYZE],
        priority: 5,
    },
    // === 业务/垂直领域类 ===
    "shopify": {
        requiredIntents: [IntentType.CREATE, IntentType.DEBUG],
        priority: 5,
    },
    "google-adk-python": {
        requiredIntents: [IntentType.CREATE],
        priority: 5,
    },
    "brand-guidelines": {
        requiredIntents: [IntentType.CREATE, IntentType.DOCUMENT],
        priority: 5,
    },
    "invoice-organizer": {
        requiredIntents: [IntentType.CREATE, IntentType.ANALYZE],
        priority: 4,
    },
    "meeting-insights-analyzer": {
        requiredIntents: [IntentType.ANALYZE],
        priority: 4,
    },
    "lead-research-assistant": {
        requiredIntents: [IntentType.RESEARCH],
        priority: 4,
    },
    "domain-name-brainstormer": {
        requiredIntents: [IntentType.CREATE],
        priority: 4,
    },
    "developer-growth-analysis": {
        requiredIntents: [IntentType.ANALYZE],
        priority: 4,
    },
    "internal-comms": {
        requiredIntents: [IntentType.CREATE, IntentType.DOCUMENT],
        priority: 4,
    },
    "file-organizer": {
        requiredIntents: [IntentType.CREATE, IntentType.REFACTOR],
        priority: 4,
    },
    "raffle-winner-picker": {
        requiredIntents: [IntentType.CREATE],
        priority: 3,
    },
    "competitive-ads-extractor": {
        requiredIntents: [IntentType.ANALYZE, IntentType.RESEARCH],
        priority: 4,
    },
    "claude-code": {
        priority: 4,
    },
    // === Deep Research 技能配置 ===
    "question-refiner": {
        triggers: [
            { word: "问题精炼", weight: 5 },
            { word: "精炼问题", weight: 5 },
            { word: "研究问题", weight: 4 },
            { word: "question refiner", weight: 5 },
            { word: "refine question", weight: 5 },
            { word: "clarify research", weight: 4 },
        ],
        requiredIntents: [IntentType.RESEARCH, IntentType.CREATE],
        priority: 7,
    },
    "research-executor": {
        triggers: [
            { word: "深度研究", weight: 6 },
            { word: "研究执行", weight: 5 },
            { word: "多智能体研究", weight: 6 },
            { word: "研究报告", weight: 4 },
            { word: "deep research", weight: 6 },
            { word: "research executor", weight: 5 },
            { word: "multi-agent research", weight: 6 },
        ],
        requiredIntents: [IntentType.RESEARCH],
        priority: 8,
    },
    "got-controller": {
        triggers: [
            { word: "思维图", weight: 6 },
            { word: "Graph of Thoughts", weight: 6 },
            { word: "GoT", weight: 5 },
            { word: "graph of thoughts", weight: 6 },
            { word: "thought graph", weight: 5 },
        ],
        requiredIntents: [IntentType.RESEARCH, IntentType.ANALYZE],
        priority: 7,
    },
    "citation-validator": {
        triggers: [
            { word: "引用验证", weight: 6 },
            { word: "来源质量", weight: 5 },
            { word: "文献验证", weight: 5 },
            { word: "citation validator", weight: 6 },
            { word: "source quality", weight: 5 },
            { word: "reference validation", weight: 5 },
        ],
        requiredIntents: [IntentType.DOCUMENT, IntentType.ANALYZE],
        priority: 7,
    },
    "synthesizer": {
        triggers: [
            { word: "研究综合", weight: 6 },
            { word: "报告生成", weight: 5 },
            { word: "综合报告", weight: 5 },
            { word: "research synthesizer", weight: 6 },
            { word: "report generation", weight: 5 },
            { word: "synthesis report", weight: 5 },
        ],
        requiredIntents: [IntentType.DOCUMENT, IntentType.CREATE, IntentType.RESEARCH],
        priority: 7,
    },
};
// ============================================
// 全局状态
// ============================================
let SKILL_REGISTRY = [];
const sessionStates = new Map();
function getSessionId(request) {
    const req = request;
    const meta = req.params?._meta || req.params?.meta || req._meta;
    return meta?.sessionId || meta?.clientId || "default";
}
function getSessionState(sessionId) {
    const existing = sessionStates.get(sessionId);
    if (existing)
        return existing;
    const created = {
        activeSkills: new Set(),
        context: "",
        lastAnalysis: new Date(),
        skillContentCache: new Map(),
    };
    sessionStates.set(sessionId, created);
    return created;
}
// ============================================
// 技能扫描和加载
// ============================================
/**
 * 解析 SKILL.md 的 YAML frontmatter
 */
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match)
        return null;
    const frontmatter = match[1];
    const nameMatch = frontmatter.match(/name:\s*(.+)/);
    const descMatch = frontmatter.match(/description:\s*[|>]?\s*([\s\S]*?)(?=\n\w+:|$)/);
    if (!nameMatch)
        return null;
    return {
        name: nameMatch[1].trim(),
        description: descMatch ? descMatch[1].trim().split("\n")[0] : "",
    };
}
/**
 * 推断技能分类
 */
function inferCategory(name, description) {
    const text = `${name} ${description}`.toLowerCase();
    if (text.includes("frontend") || text.includes("ui") || text.includes("design") || text.includes("css")) {
        return "frontend";
    }
    if (text.includes("test") || text.includes("验证")) {
        return "testing";
    }
    if (text.includes("review") || text.includes("quality") || text.includes("审查")) {
        return "quality";
    }
    if (text.includes("mcp") || text.includes("tool") || text.includes("build")) {
        return "tooling";
    }
    if (text.includes("document") || text.includes("文档") || text.includes("content")) {
        return "content";
    }
    if (text.includes("image") || text.includes("video") || text.includes("media")) {
        return "media";
    }
    return "general";
}
/**
 * 扫描技能目录，加载所有技能的元数据（支持嵌套目录）
 */
async function scanSkillsDirectory(baseDir, maxDepth = 2) {
    const skills = [];
    const resolvedBase = path.resolve(baseDir);
    // Validate base directory exists and is not a symlink
    try {
        if (!fs.existsSync(resolvedBase)) {
            console.error(`[Skills Controller] 技能目录不存在: ${sanitizePathForLog(baseDir)}`);
            return skills;
        }
        const stats = fs.lstatSync(resolvedBase);
        if (stats.isSymbolicLink()) {
            console.error(`[Skills Controller] 跳过符号链接目录: ${sanitizePathForLog(baseDir)}`);
            return skills;
        }
    }
    catch (error) {
        console.error(`[Skills Controller] 无法访问目录: ${sanitizePathForLog(baseDir)}`);
        return skills;
    }
    // 递归扫描函数
    function scanDir(dir, depth) {
        if (depth > maxDepth)
            return;
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                // Skip non-directories and non-symlinks
                if (!entry.isDirectory() && !entry.isSymbolicLink())
                    continue;
                if (entry.name.startsWith("."))
                    continue;
                if (entry.name === "common" || entry.name === "references" || entry.name === "scripts")
                    continue;
                // Validate entry name doesn't contain path separators or special chars
                if (!validateEntryName(entry.name)) {
                    console.error(`[Skills Controller] 跳过无效目录名: ${sanitizePathForLog(entry.name)}`);
                    continue;
                }
                try {
                    // Validate path stays within base directory
                    const skillDir = validatePath(resolvedBase, path.relative(resolvedBase, path.join(dir, entry.name)));
                    // Check for symlink - resolve and validate target
                    const dirStats = fs.lstatSync(skillDir);
                    let finalSkillDir = skillDir;
                    if (dirStats.isSymbolicLink()) {
                        try {
                            // Resolve symlink to real path
                            const realPath = fs.realpathSync(skillDir);
                            // Verify symlink target exists and is a directory
                            const realStats = fs.statSync(realPath);
                            if (!realStats.isDirectory()) {
                                console.error(`[Skills Controller] 跳过符号链接(目标非目录): ${sanitizePathForLog(entry.name)}`);
                                continue;
                            }
                            // Use the real path for further processing
                            finalSkillDir = realPath;
                        }
                        catch (error) {
                            console.error(`[Skills Controller] 跳过无效符号链接: ${sanitizePathForLog(entry.name)}`);
                            continue;
                        }
                    }
                    const skillFile = path.join(finalSkillDir, "SKILL.md");
                    if (fs.existsSync(skillFile)) {
                        // 找到技能，处理它
                        processSkill(entry.name, skillFile);
                    }
                    else {
                        // 没有 SKILL.md，尝试递归扫描子目录
                        scanDir(finalSkillDir, depth + 1);
                    }
                }
                catch (error) {
                    if (error instanceof PathTraversalError) {
                        console.error(`[Skills Controller] 跳过可疑路径: ${sanitizePathForLog(entry.name)}`);
                    }
                    // Continue with other entries
                }
            }
        }
        catch (error) {
            console.error(`[Skills Controller] 扫描目录失败: ${sanitizePathForLog(dir)}`);
        }
    }
    function processSkill(name, skillFile) {
        try {
            // Validate skill file path
            const validatedPath = validateFileForRead(path.dirname(skillFile), path.basename(skillFile));
            const content = fs.readFileSync(validatedPath, "utf-8");
            const meta = parseFrontmatter(content);
            if (!meta)
                return;
            // Get triggers for both languages
            const triggerConfig = EXTRA_TRIGGERS[name];
            const triggers = [];
            if (triggerConfig) {
                if (triggerConfig.zh)
                    triggers.push(...triggerConfig.zh);
                if (triggerConfig.en)
                    triggers.push(...triggerConfig.en);
            }
            // Extract extra keywords from description
            const descWords = meta.description
                .split(/[\s,，、]+/)
                .filter(w => w.length > 1 && w.length < 10);
            const allTriggers = [...new Set([...triggers, ...descWords, name])];
            skills.push({
                name: name,
                description: meta.description || `${name} 技能`,
                triggers: allTriggers,
                category: inferCategory(name, meta.description),
                priority: 5,
                path: validatedPath,
                loaded: false,
            });
            console.error(`[Skills Controller] Found skill: ${name}`);
        }
        catch (error) {
            console.error(`[Skills Controller] Failed to load skill: ${sanitizePathForLog(name)}`);
        }
    }
    // 开始扫描
    scanDir(resolvedBase, 0);
    return skills;
}
/**
 * 加载技能的完整内容
 */
async function loadSkillContent(skillName, state) {
    // 检查缓存
    if (state.skillContentCache.has(skillName)) {
        return state.skillContentCache.get(skillName);
    }
    const skill = SKILL_REGISTRY.find(s => s.name === skillName);
    if (!skill) {
        // Don't expose skill name in error - could be user input
        return "[Error: 技能未注册]";
    }
    try {
        // Validate skill path for security (double-check even though scanned paths should be safe)
        const skillDir = path.dirname(skill.path);
        const skillFile = path.basename(skill.path);
        const validatedPath = validateFileForRead(skillDir, skillFile);
        const content = fs.readFileSync(validatedPath, "utf-8");
        state.skillContentCache.set(skillName, content);
        skill.loaded = true;
        return content;
    }
    catch (error) {
        // Safe error logging - don't expose full path
        console.error(`[Skills Controller] 读取技能失败: ${sanitizePathForLog(skill.path)}`);
        return "[Error: 无法读取技能文件]";
    }
}
// ============================================
// 意图分析
// ============================================
/**
 * 识别用户消息的意图
 * @returns 识别出的意图列表，按置信度排序
 */
function detectIntents(userMessage) {
    const results = [];
    const messageLower = userMessage.toLowerCase();
    for (const pattern of INTENT_PATTERNS) {
        let matchCount = 0;
        let totalWeight = 0;
        for (const regex of pattern.patterns) {
            if (regex.test(userMessage) || regex.test(messageLower)) {
                matchCount++;
                totalWeight += pattern.weight;
            }
        }
        if (matchCount > 0) {
            // 置信度计算：匹配权重和 / 模式数量
            const confidence = totalWeight / pattern.patterns.length;
            results.push({ intent: pattern.intent, confidence });
        }
    }
    // 按置信度排序
    results.sort((a, b) => b.confidence - a.confidence);
    // 如果没有匹配，返回 UNKNOWN
    if (results.length === 0) {
        results.push({ intent: IntentType.UNKNOWN, confidence: 0 });
    }
    return results;
}
/**
 * 检查消息是否包含排除词
 */
function containsExcludeWords(message, excludes) {
    const messageLower = message.toLowerCase();
    return excludes.some(exclude => messageLower.includes(exclude.toLowerCase()));
}
/**
 * 增强版上下文分析 - 支持意图识别和排除机制（多语言）
 */
function analyzeContext(userMessage) {
    const messageLower = userMessage.toLowerCase();
    // Detect language of user message
    const detectedLocale = detectLanguage(userMessage);
    // Ensure locale is "en" or "zh" (not "auto")
    const locale = detectedLocale === "auto" ? "en" : detectedLocale;
    // 1. 识别用户意图
    const detectedIntents = detectIntents(userMessage);
    const primaryIntent = detectedIntents[0]?.intent || IntentType.UNKNOWN;
    // 特殊处理：编写单元测试时不激活特定技能
    if (primaryIntent === IntentType.TEST_WRITE_UNIT) {
        console.error(`[Skills Controller] Unit test writing scenario, using general programming capabilities`);
        return {
            matches: [],
            primaryIntent,
            locale,
        };
    }
    // 特殊处理：编写集成测试时不激活特定技能
    if (primaryIntent === IntentType.TEST_WRITE_INTEGRATION) {
        console.error(`[Skills Controller] Integration test writing scenario, using general programming capabilities`);
        return {
            matches: [],
            primaryIntent,
            locale,
        };
    }
    // 2. 获取次要意图
    const secondaryIntents = detectedIntents.slice(1, 3).map(d => d.intent);
    const allIntents = [primaryIntent, ...secondaryIntents];
    console.error(`[Skills Controller] Detected intent: ${primaryIntent} (secondary: ${secondaryIntents.join(", ") || "none"})`);
    const matchedSkills = [];
    for (const skill of SKILL_REGISTRY) {
        const config = SKILL_CONFIGS[skill.name];
        // 2. 检查意图过滤
        if (config) {
            // 检查排除意图
            if (config.excludedIntents?.includes(primaryIntent)) {
                console.error(`[Skills Controller] ${skill.name} excluded by intent: ${primaryIntent}`);
                continue;
            }
            // 检查必需意图（如果定义了 requiredIntents）
            if (config.requiredIntents && config.requiredIntents.length > 0) {
                const hasRequiredIntent = config.requiredIntents.some(ri => allIntents.includes(ri));
                if (!hasRequiredIntent) {
                    console.error(`[Skills Controller] ${skill.name} 缺少必需意图 (需要: ${config.requiredIntents.join("/")})`);
                    continue;
                }
            }
            // 检查排除词
            if (config.excludes && containsExcludeWords(userMessage, config.excludes)) {
                console.error(`[Skills Controller] ${skill.name} filtered by exclusion words`);
                continue;
            }
        }
        // 3. 计算匹配分数
        let score = 0;
        const matchedTriggers = [];
        // 优先使用 SKILL_CONFIGS 中的加权触发词
        if (config?.triggers && config.triggers.length > 0) {
            for (const trigger of config.triggers) {
                if (messageLower.includes(trigger.word.toLowerCase())) {
                    score += trigger.weight;
                    matchedTriggers.push(trigger.word);
                }
            }
        }
        // 也检查 EXTRA_TRIGGERS 和默认触发词
        for (const trigger of skill.triggers) {
            if (messageLower.includes(trigger.toLowerCase())) {
                // 避免重复计分
                if (!matchedTriggers.includes(trigger)) {
                    score += trigger.length > 3 ? 2 : 1;
                    matchedTriggers.push(trigger);
                }
            }
        }
        // 4. 应用技能优先级
        const priority = config?.priority || skill.priority;
        if (score > 0) {
            matchedSkills.push({
                skill: { ...skill, priority },
                score: score + priority,
                matchedTriggers,
            });
        }
    }
    // 按分数排序
    matchedSkills.sort((a, b) => b.score - a.score);
    // 记录匹配结果
    if (matchedSkills.length > 0) {
        console.error(`[Skills Controller] Match results: ${matchedSkills.slice(0, 5).map(m => `${m.skill.name}(${m.score})`).join(", ")}`);
    }
    else {
        console.error(`[Skills Controller] No matching skills`);
    }
    return {
        matches: matchedSkills,
        primaryIntent,
        locale,
    };
}
// ============================================
// MCP 服务器
// ============================================
function createServer() {
    const server = new Server({
        name: "skills-controller",
        version: "1.0.0",
    }, {
        capabilities: {
            tools: {},
        },
    });
    // 注册工具列表
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        const skillsList = SKILL_REGISTRY.map(s => `• ${s.name}: ${s.description}`).join("\n");
        return {
            tools: [
                {
                    name: "analyze_and_route",
                    description: `**IMPORTANT: Call this tool first before handling any non-simple conversational task**

This is the skill routing core - automatically matches the most appropriate expert skills for each task.

${SKILL_REGISTRY.length} skills registered, covering: frontend, backend, databases, DevOps, design, documentation, testing, AI/ML, etc.

**Call Rules**:
- ✅ **MUST call**: Any programming, design, documentation, or technical task
- ✅ **MUST call**: Research framework/library **principles** (e.g., "Vue reactivity", "React virtual DOM")
- ✅ **MUST call**: View source code, implementation mechanisms, internal workings
- ✅ **MUST call**: User requests to create, build, develop, or process anything
- ❌ **NO need to call**: Social conversation ("hello", "thanks"), casual chat, **basic concept explanation** (e.g., "what is HTTP?")

Use this tool to let Claude automatically gain expert-level capabilities without users needing to know about the skills.`,
                    inputSchema: {
                        type: "object",
                        properties: {
                            user_message: {
                                type: "string",
                                description: "User's original message or task description",
                            },
                            max_skills: {
                                type: "number",
                                description: "Maximum number of skills to activate (default: 1)",
                                default: 1,
                            },
                        },
                        required: ["user_message"],
                    },
                },
                {
                    name: "list_active_skills",
                    description: "List currently active skills",
                    inputSchema: {
                        type: "object",
                        properties: {},
                    },
                },
                {
                    name: "deactivate_skill",
                    description: "Deactivate a specific skill to release context space",
                    inputSchema: {
                        type: "object",
                        properties: {
                            skill_name: {
                                type: "string",
                                description: "Name of the skill to deactivate",
                            },
                        },
                        required: ["skill_name"],
                    },
                },
                {
                    name: "deactivate_all_skills",
                    description: "Deactivate all active skills to release context space",
                    inputSchema: {
                        type: "object",
                        properties: {},
                    },
                },
                {
                    name: "get_skill_index",
                    description: "Get complete index of all available skills",
                    inputSchema: {
                        type: "object",
                        properties: {},
                    },
                },
                {
                    name: "load_skill",
                    description: "Load the full content of a specific skill",
                    inputSchema: {
                        type: "object",
                        properties: {
                            skill_name: {
                                type: "string",
                                description: "Name of the skill to load",
                            },
                        },
                        required: ["skill_name"],
                    },
                },
                {
                    name: "search_skills",
                    description: "Search for skills containing specific keywords",
                    inputSchema: {
                        type: "object",
                        properties: {
                            keyword: {
                                type: "string",
                                description: "Search keyword",
                            },
                        },
                        required: ["keyword"],
                    },
                },
            ],
        };
    });
    // 处理工具调用
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        const sessionId = getSessionId(request);
        const state = getSessionState(sessionId);
        try {
            switch (name) {
                case "analyze_and_route": {
                    // Validate input with Zod schema
                    const { user_message, max_skills } = validateAnalyzeAndRouteArgs(args);
                    // 使用增强的意图感知分析（多语言）
                    const { matches, primaryIntent, locale } = analyzeContext(user_message);
                    const skillsToActivate = matches.slice(0, max_skills);
                    if (skillsToActivate.length === 0) {
                        const noMatchMsg = locale === "zh"
                            ? "未匹配到相关技能，使用通用模式处理"
                            : "No matching skills found, using general mode";
                        const suggestionMsg = locale === "zh"
                            ? "可以使用 search_skills 或 get_skill_index 查看可用技能"
                            : "Use search_skills or get_skill_index to see available skills";
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: JSON.stringify({
                                        status: "no_match",
                                        detected_intent: primaryIntent,
                                        locale: locale,
                                        message: noMatchMsg,
                                        suggestion: suggestionMsg,
                                        total_skills: SKILL_REGISTRY.length,
                                    }),
                                },
                            ],
                        };
                    }
                    // 加载技能内容
                    const activatedContents = [];
                    for (const match of skillsToActivate) {
                        const content = await loadSkillContent(match.skill.name, state);
                        activatedContents.push({ name: match.skill.name, content });
                        state.activeSkills.add(match.skill.name);
                    }
                    state.context = user_message;
                    state.lastAnalysis = new Date();
                    // Generate localized instructions
                    const activatedMsg = locale === "zh"
                        ? `✅ **已激活技能**：${skillsToActivate.map(match => `${match.skill.name}（${match.skill.category}）`).join("、")}`
                        : `✅ **Activated skills**: ${skillsToActivate.map(match => `${match.skill.name} (${match.skill.category})`).join(", ")}`;
                    const processMsg = locale === "zh"
                        ? "请根据以上激活的技能内容来处理用户请求。任务完成后，请务必调用 deactivate_all_skills 工具来停用技能并释放上下文空间。"
                        : "Please process the user's request based on the activated skill content above. After completing the task, be sure to call deactivate_all_skills to release context space.";
                    const instructions = `${activatedMsg}\n\n${processMsg}`;
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    status: "activated",
                                    detected_intent: primaryIntent,
                                    locale: locale,
                                    activated_skills: skillsToActivate.map(match => ({
                                        name: match.skill.name,
                                        category: match.skill.category,
                                        match_reason: match.matchedTriggers,
                                    })),
                                    skill_contents: activatedContents,
                                    instructions: instructions,
                                }),
                            },
                        ],
                    };
                }
                case "list_active_skills": {
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    active_skills: Array.from(state.activeSkills),
                                    last_analysis: state.lastAnalysis.toISOString(),
                                    context_summary: state.context.slice(0, 100) + (state.context.length > 100 ? "..." : ""),
                                }),
                            },
                        ],
                    };
                }
                case "deactivate_skill": {
                    // Validate skill_name input
                    const skill_name = validateSkillName(args);
                    if (state.activeSkills.has(skill_name)) {
                        state.activeSkills.delete(skill_name);
                        state.skillContentCache.delete(skill_name);
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: JSON.stringify({
                                        status: "deactivated",
                                        skill: skill_name,
                                        remaining_active: Array.from(state.activeSkills),
                                        message: "技能使用完毕，已释放。",
                                    }),
                                },
                            ],
                        };
                    }
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    status: "not_found",
                                    message: "技能未处于激活状态",
                                }),
                            },
                        ],
                    };
                }
                case "deactivate_all_skills": {
                    const deactivatedSkills = Array.from(state.activeSkills);
                    const count = deactivatedSkills.length;
                    state.activeSkills.clear();
                    state.skillContentCache.clear();
                    // 生成友好的提示信息
                    const skillNames = deactivatedSkills.length > 0
                        ? deactivatedSkills.join("、")
                        : "无";
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    status: "all_deactivated",
                                    count: count,
                                    deactivated_skills: deactivatedSkills,
                                    message: count > 0
                                        ? `【${skillNames}】技能使用完毕，已释放。`
                                        : "当前没有激活的技能。",
                                }),
                            },
                        ],
                    };
                }
                case "get_skill_index": {
                    // 按分类分组
                    const byCategory = {};
                    for (const skill of SKILL_REGISTRY) {
                        if (!byCategory[skill.category]) {
                            byCategory[skill.category] = [];
                        }
                        byCategory[skill.category].push(skill);
                    }
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    total: SKILL_REGISTRY.length,
                                    by_category: Object.entries(byCategory).map(([cat, skills]) => ({
                                        category: cat,
                                        count: skills.length,
                                        skills: skills.map(s => ({
                                            name: s.name,
                                            description: s.description,
                                            triggers: s.triggers.slice(0, 5),
                                        })),
                                    })),
                                }),
                            },
                        ],
                    };
                }
                case "load_skill": {
                    // Validate skill_name input
                    const skill_name = validateSkillName(args);
                    const skill = SKILL_REGISTRY.find(s => s.name === skill_name);
                    if (!skill) {
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: JSON.stringify({
                                        status: "error",
                                        message: "技能不存在",
                                        // Don't leak full skill list - suggest using search instead
                                        suggestion: "使用 search_skills 或 get_skill_index 查看可用技能",
                                    }),
                                },
                            ],
                        };
                    }
                    const content = await loadSkillContent(skill_name, state);
                    state.activeSkills.add(skill_name);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    status: "loaded",
                                    skill: {
                                        name: skill.name,
                                        category: skill.category,
                                        description: skill.description,
                                    },
                                    content: content,
                                }),
                            },
                        ],
                    };
                }
                case "search_skills": {
                    // Validate keyword input
                    const keyword = validateKeyword(args);
                    const keywordLower = keyword.toLowerCase();
                    const matches = SKILL_REGISTRY.filter(skill => skill.name.toLowerCase().includes(keywordLower) ||
                        skill.description.toLowerCase().includes(keywordLower) ||
                        skill.triggers.some(t => t.toLowerCase().includes(keywordLower)));
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    keyword,
                                    matches: matches.length,
                                    skills: matches.map(s => ({
                                        name: s.name,
                                        description: s.description,
                                        category: s.category,
                                    })),
                                }),
                            },
                        ],
                    };
                }
                default:
                    // Safe error - don't expose tool name details
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    status: "error",
                                    message: "未知操作",
                                }),
                            },
                        ],
                    };
            }
        }
        catch (error) {
            // Unified error handling - don't leak sensitive info
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            status: "error",
                            message: createSafeErrorResponse(error, name),
                        }),
                    },
                ],
            };
        }
    });
    return server;
}
// ============================================
// 主函数
// ============================================
async function main() {
    console.error("[Skills Controller] Starting...");
    console.error(`[Skills Controller] Skills directories: ${SKILLS_DIRS.join(", ")}`);
    // 扫描所有技能目录（先扫描的优先）
    const seenSkills = new Set();
    const allSkills = [];
    for (const dir of SKILLS_DIRS) {
        console.error(`[Skills Controller] Scanning directory: ${dir}`);
        const skills = await scanSkillsDirectory(dir);
        for (const skill of skills) {
            if (!seenSkills.has(skill.name)) {
                seenSkills.add(skill.name);
                allSkills.push(skill);
            }
            else {
                console.error(`[Skills Controller] Skipping duplicate skill: ${skill.name}`);
            }
        }
    }
    SKILL_REGISTRY = allSkills;
    console.error(`[Skills Controller] Loaded ${SKILL_REGISTRY.length} skills (after deduplication)`);
    // 启动服务器
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[Skills Controller] MCP Server started");
}
main().catch(console.error);
//# sourceMappingURL=skills-controller.js.map