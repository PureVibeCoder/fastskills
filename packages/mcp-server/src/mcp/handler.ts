import { searchSkills, listSkills, getSkillContent } from '../services/skills';

interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: unknown;
  error?: { code: number; message: string };
}

const TOOLS = [
  {
    name: 'find_skills',
    description: `【重要：每次收到用户任务时自动调用】搜索 FastSkills 技能库（225+ 专业技能），匹配当前任务可用的专业技能。

触发时机：
- 用户提出任何编程、设计、研究、分析类任务时立即调用
- 开始处理新请求前，主动检查是否有可增强工作效率的技能
- 遇到专业领域（如前端、生物信息学、DevOps、数据可视化）时调用

技能库覆盖：前端开发、科学计算、机器学习、DevOps、测试、文档、数据可视化等 20+ 分类。支持中英文语义搜索。

示例查询：
- "React 组件开发" → 返回 react-component, frontend-designer 等技能
- "单细胞RNA分析" → 返回 scanpy, bioinformatics 相关技能
- "API 测试" → 返回 testing, playwright 相关技能`,
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: '用户任务的核心描述。直接使用用户原话或提取关键技术词。'
        },
        limit: {
          type: 'number',
          default: 5,
          description: '返回结果数量，默认5个。复杂任务可增至10个。'
        },
        category: {
          type: 'string',
          description: '限定分类（如 frontend、scientific、devops）。不确定时留空。'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_skill_content',
    description: `加载技能的完整指导内容到当前会话。

使用时机：
- find_skills 返回高匹配度技能后，加载其完整内容以获得专业指导
- 用户明确要求使用某个技能时

加载后：技能内容将作为当前任务的专业指导，包含最佳实践、代码模板、工作流程等。

注意：技能内容可能较大（1-50KB），仅加载确实需要的技能。`,
    inputSchema: {
      type: 'object',
      properties: {
        skill_id: {
          type: 'string',
          description: '技能 ID（由 find_skills 返回）。例如：frontend-designer, scanpy-analysis, playwright-testing'
        }
      },
      required: ['skill_id']
    }
  },
  {
    name: 'list_skills',
    description: `浏览 FastSkills 技能库的完整目录。

使用时机：
- 用户询问"有哪些技能可用"或"能做什么"时
- 需要按分类探索特定领域的所有技能时
- find_skills 未返回满意结果，需要手动浏览时

返回：技能列表（ID、名称、简介、分类）。不返回完整内容，需要详情请用 get_skill_content。

可用分类：frontend、backend、scientific、bioinformatics、devops、testing、document、ml-ai、data-viz`,
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: '分类名称，留空返回所有技能'
        }
      }
    }
  }
];

export async function handleMCPMessage(
  request: MCPRequest,
  indexUrl: string
): Promise<MCPResponse> {
  const { id, method, params } = request;

  try {
    switch (method) {
      case 'initialize':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: { name: 'fastskills', version: '1.0.0' },
            capabilities: { tools: {} }
          }
        };

      case 'tools/list':
        return { jsonrpc: '2.0', id, result: { tools: TOOLS } };

      case 'tools/call': {
        const { name, arguments: args } = params as {
          name: string;
          arguments: Record<string, unknown>;
        };
        const result = await executeToolCall(name, args, indexUrl);
        return {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
        };
      }

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` }
        };
    }
  } catch (error) {
    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32000, message: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

async function executeToolCall(name: string, args: Record<string, unknown>, indexUrl: string) {
  switch (name) {
    case 'find_skills': {
      const results = await searchSkills(
        indexUrl,
        args.query as string,
        (args.limit as number) || 5,
        args.category as string | undefined
      );
      let message: string;
      let suggestion: string | null = null;
      if (results.length > 0) {
        const topSkills = results.slice(0, 3).map(r =>
          `• ${r.skill.name} (${(r.score * 100).toFixed(0)}%): ${r.skill.description.slice(0, 60)}...`
        ).join('\n');
        message = `✅ 找到 ${results.length} 个相关技能：\n\n${topSkills}`;
        suggestion = '使用 get_skill_content 加载推荐技能以获得专业指导';
      } else {
        message = `❌ 未找到匹配 "${args.query}" 的技能。\n\n建议：\n1. 尝试使用不同关键词\n2. 用 list_skills 浏览完整技能目录`;
      }
      return { message, skills: results, suggestion };
    }

    case 'get_skill_content': {
      const skillId = args.skill_id as string;
      const content = await getSkillContent(indexUrl, skillId);
      if (content) {
        const sizeKB = (content.length / 1024).toFixed(1);
        return {
          message: `✅ 已加载技能 "${skillId}" 的完整内容（${sizeKB}KB）`,
          skillId,
          content
        };
      }
      return {
        message: `❌ 技能 "${skillId}" 不存在`,
        error: 'Skill not found'
      };
    }

    case 'list_skills': {
      const category = args.category as string | undefined;
      const skills = await listSkills(indexUrl, category);
      const message = category
        ? `📋 分类 "${category}" 共有 ${skills.length} 个技能`
        : `📋 共有 ${skills.length} 个可用技能`;
      return { message, total: skills.length, skills };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
