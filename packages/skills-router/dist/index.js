import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { SkillSearchEngine } from './engine/search.js';
import { SkillLoader } from './engine/loader.js';
import { createFindSkillsHandler, findSkillsSchema } from './tools/find-skills.js';
import { createLoadSkillsHandler, loadSkillsSchema } from './tools/load-skills.js';
import { createUnloadSkillHandler, unloadSkillSchema } from './tools/unload-skill.js';
import { createListSkillsHandler } from './tools/list-skills.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function loadSkillsIndex() {
    const indexPath = path.join(__dirname, 'data', 'skills.json');
    try {
        const content = await fs.readFile(indexPath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        console.error(`Warning: Could not load skills index from ${indexPath}`);
        console.error('Run "npm run generate-index" to create the index.');
        return [];
    }
}
async function main() {
    const skills = await loadSkillsIndex();
    const searchEngine = new SkillSearchEngine(skills);
    const loader = new SkillLoader();
    const findSkills = createFindSkillsHandler(searchEngine);
    const loadSkills = createLoadSkillsHandler(loader, searchEngine);
    const unloadSkill = createUnloadSkillHandler(loader);
    const listSkills = createListSkillsHandler(loader, searchEngine);
    const server = new Server({ name: 'fastskills-router', version: '1.0.0' }, { capabilities: { tools: {} } });
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [
            {
                name: 'find_skills',
                description: '根据任务描述智能推荐技能。当用户描述一个任务但你不确定需要什么专业技能时使用。支持中英文查询。',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: '任务描述或关键词，例如："我需要分析单细胞RNA数据" 或 "build a React component"'
                        },
                        limit: {
                            type: 'number',
                            default: 5,
                            description: '返回结果数量，默认5个'
                        },
                        category: {
                            type: 'string',
                            description: '可选：限定搜索分类，如 bioinformatics, frontend, backend 等'
                        }
                    },
                    required: ['query']
                }
            },
            {
                name: 'load_skills',
                description: '动态加载技能到当前会话。加载后 Claude Code 会自动检测并启用这些技能。',
                inputSchema: {
                    type: 'object',
                    properties: {
                        skills: {
                            type: 'array',
                            items: { type: 'string' },
                            description: '要加载的技能 ID 列表，例如 ["scanpy", "rdkit", "frontend-design"]'
                        }
                    },
                    required: ['skills']
                }
            },
            {
                name: 'unload_skill',
                description: '卸载不再需要的技能，释放 context window 空间。',
                inputSchema: {
                    type: 'object',
                    properties: {
                        skill_id: {
                            type: 'string',
                            description: '要卸载的技能 ID'
                        }
                    },
                    required: ['skill_id']
                }
            },
            {
                name: 'list_active_skills',
                description: '列出当前已加载的所有技能及其状态。',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            }
        ]
    }));
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        try {
            let result;
            switch (name) {
                case 'find_skills':
                    result = await findSkills(findSkillsSchema.parse(args));
                    break;
                case 'load_skills':
                    result = await loadSkills(loadSkillsSchema.parse(args));
                    break;
                case 'unload_skill':
                    result = await unloadSkill(unloadSkillSchema.parse(args));
                    break;
                case 'list_active_skills':
                    result = await listSkills();
                    break;
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: 'text', text: JSON.stringify({ error: errorMessage }) }],
                isError: true
            };
        }
    });
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`FastSkills Router MCP Server started (${skills.length} skills indexed)`);
}
main().catch(console.error);
//# sourceMappingURL=index.js.map