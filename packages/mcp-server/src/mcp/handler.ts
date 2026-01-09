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
    description:
      '根据任务描述智能推荐技能。当用户描述一个任务但你不确定需要什么专业技能时使用。支持中英文查询。',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '任务描述或关键词' },
        limit: { type: 'number', default: 5 },
        category: { type: 'string', description: '限定分类' }
      },
      required: ['query']
    }
  },
  {
    name: 'get_skill_content',
    description: '获取技能的完整内容。返回 SKILL.md 或 README.md 的完整文本。',
    inputSchema: {
      type: 'object',
      properties: {
        skill_id: { type: 'string', description: '技能 ID' }
      },
      required: ['skill_id']
    }
  },
  {
    name: 'list_skills',
    description: '列出所有可用技能。可按分类筛选。',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: '按分类筛选' }
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
      const message = results.length > 0
        ? `✅ 找到 ${results.length} 个相关技能：${results.map(r => r.skill.name).join('、')}`
        : `❌ 未找到匹配 "${args.query}" 的技能，请尝试其他关键词`;
      return { message, skills: results };
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
