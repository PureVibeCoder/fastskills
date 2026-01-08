import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { SkillSearchEngine } from './engine/search.js';
import { SkillLoader, SkillLoaderOptions } from './engine/loader.js';
import { SkillMeta } from './types.js';

import { createFindSkillsHandler, findSkillsSchema } from './tools/find-skills.js';
import { createLoadSkillsHandler, loadSkillsSchema } from './tools/load-skills.js';
import { createUnloadSkillHandler, unloadSkillSchema } from './tools/unload-skill.js';
import { createListSkillsHandler } from './tools/list-skills.js';

export interface RouterServerOptions {
  skills?: SkillMeta[];
  loaderOptions?: SkillLoaderOptions;
}

export interface RouterServer {
  server: Server;
  searchEngine: SkillSearchEngine;
  loader: SkillLoader;
}

export function createRouterServer(options: RouterServerOptions = {}): RouterServer {
  const skills = options.skills ?? [];
  
  const searchEngine = new SkillSearchEngine(skills);
  const loader = new SkillLoader(options.loaderOptions);
  
  const findSkills = createFindSkillsHandler(searchEngine);
  const loadSkills = createLoadSkillsHandler(loader, searchEngine);
  const unloadSkill = createUnloadSkillHandler(loader);
  const listSkills = createListSkillsHandler(loader, searchEngine);

  const server = new Server(
    { name: 'fastskills-router', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

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
              description: '任务描述或关键词，例如：\"我需要分析单细胞RNA数据\" 或 \"build a React component\"'
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
              description: '要加载的技能 ID 列表，例如 [\"scanpy\", \"rdkit\", \"frontend-design\"]'
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
      let result: unknown;
      
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
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      
      if (error instanceof z.ZodError) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
        );
      }
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text', text: JSON.stringify({ error: errorMessage }) }],
        isError: true
      };
    }
  });

  return { server, searchEngine, loader };
}
