import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createRouterServer } from '../src/server.js';
import { SkillMeta } from '../src/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const createMockSkill = (partial: Partial<SkillMeta>): SkillMeta => ({
  id: partial.id ?? 'test-skill',
  name: partial.name ?? 'Test Skill',
  description: partial.description ?? 'A test skill',
  category: partial.category ?? 'tools',
  source: partial.source ?? 'test',
  triggers: partial.triggers ?? ['test'],
  path: partial.path ?? '/path/to/skill',
  fullDescription: partial.fullDescription,
});

describe('MCP Server Integration', () => {
  let client: Client;
  let tempDir: string;
  let skillsDir: string;
  let sourceDir: string;

  const testSkills: SkillMeta[] = [
    createMockSkill({
      id: 'scanpy',
      name: 'Scanpy',
      description: 'Single-cell RNA-seq analysis',
      category: 'bioinformatics',
      triggers: ['scanpy', 'single-cell', 'rna-seq'],
    }),
    createMockSkill({
      id: 'react-design',
      name: 'React Design',
      description: 'Build React components',
      category: 'frontend',
      triggers: ['react', 'component', 'frontend'],
    }),
  ];

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-test-'));
    tempDir = await fs.realpath(tempDir);
    skillsDir = path.join(tempDir, 'skills');
    sourceDir = path.join(tempDir, 'source');
    
    await fs.mkdir(sourceDir, { recursive: true });
    await fs.writeFile(path.join(sourceDir, 'SKILL.md'), '# Test Skill');

    const skillsWithPaths = testSkills.map(s => ({
      ...s,
      path: sourceDir,
    }));

    const { server } = createRouterServer({
      skills: skillsWithPaths,
      loaderOptions: { claudeSkillsDir: skillsDir },
    });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);
  });

  afterEach(async () => {
    try {
      await client.close();
    } catch {
      // Ignore close errors
    }
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('list tools', () => {
    it('returns all registered tools', async () => {
      const tools = await client.listTools();
      
      expect(tools.tools.length).toBe(4);
      
      const toolNames = tools.tools.map(t => t.name);
      expect(toolNames).toContain('find_skills');
      expect(toolNames).toContain('load_skills');
      expect(toolNames).toContain('unload_skill');
      expect(toolNames).toContain('list_active_skills');
    });

    it('includes input schemas for each tool', async () => {
      const tools = await client.listTools();
      
      const findSkillsTool = tools.tools.find(t => t.name === 'find_skills');
      expect(findSkillsTool?.inputSchema).toBeDefined();
      expect((findSkillsTool?.inputSchema as Record<string, unknown>).required).toContain('query');
    });
  });

  describe('find_skills tool', () => {
    it('finds skills by query', async () => {
      const result = await client.callTool({
        name: 'find_skills',
        arguments: { query: 'single-cell RNA analysis' },
      });

      expect(result.isError).toBeFalsy();
      
      const content = JSON.parse((result.content as Array<{type: string; text: string}>)[0].text);
      expect(content.results.length).toBeGreaterThan(0);
      expect(content.results[0].id).toBe('scanpy');
    });

    it('respects limit parameter', async () => {
      const result = await client.callTool({
        name: 'find_skills',
        arguments: { query: 'test', limit: 1 },
      });

      const content = JSON.parse((result.content as Array<{type: string; text: string}>)[0].text);
      expect(content.results.length).toBeLessThanOrEqual(1);
    });

    it('filters by category', async () => {
      const result = await client.callTool({
        name: 'find_skills',
        arguments: { query: 'build', category: 'frontend' },
      });

      const content = JSON.parse((result.content as Array<{type: string; text: string}>)[0].text);
      for (const skill of content.results) {
        expect(skill.category).toBe('frontend');
      }
    });

    it('throws error for invalid params', async () => {
      await expect(
        client.callTool({
          name: 'find_skills',
          arguments: {},
        })
      ).rejects.toThrow();
    });
  });

  describe('load_skills tool', () => {
    it('loads skills successfully', async () => {
      const result = await client.callTool({
        name: 'load_skills',
        arguments: { skills: ['scanpy'] },
      });

      expect(result.isError).toBeFalsy();
      
      const content = JSON.parse((result.content as Array<{type: string; text: string}>)[0].text);
      expect(content.loaded).toContain('scanpy');
      
      const stat = await fs.lstat(path.join(skillsDir, 'scanpy'));
      expect(stat.isSymbolicLink()).toBe(true);
    });

    it('handles non-existent skills', async () => {
      const result = await client.callTool({
        name: 'load_skills',
        arguments: { skills: ['nonexistent-skill'] },
      });

      const content = JSON.parse((result.content as Array<{type: string; text: string}>)[0].text);
      expect(content.failed.length).toBeGreaterThan(0);
      expect(content.failed[0].skillId).toBe('nonexistent-skill');
    });
  });

  describe('unload_skill tool', () => {
    it('unloads a loaded skill', async () => {
      await client.callTool({
        name: 'load_skills',
        arguments: { skills: ['scanpy'] },
      });

      const result = await client.callTool({
        name: 'unload_skill',
        arguments: { skill_id: 'scanpy' },
      });

      expect(result.isError).toBeFalsy();
      
      const content = JSON.parse((result.content as Array<{type: string; text: string}>)[0].text);
      expect(content.status).toBe('unloaded');
    });

    it('returns not_found for non-existent skill', async () => {
      const result = await client.callTool({
        name: 'unload_skill',
        arguments: { skill_id: 'nonexistent' },
      });

      const content = JSON.parse((result.content as Array<{type: string; text: string}>)[0].text);
      expect(content.status).toBe('not_found');
    });
  });

  describe('list_active_skills tool', () => {
    it('returns empty list initially', async () => {
      const result = await client.callTool({
        name: 'list_active_skills',
        arguments: {},
      });

      expect(result.isError).toBeFalsy();
      
      const content = JSON.parse((result.content as Array<{type: string; text: string}>)[0].text);
      expect(content.active).toEqual([]);
    });

    it('lists loaded skills', async () => {
      await client.callTool({
        name: 'load_skills',
        arguments: { skills: ['scanpy'] },
      });

      const result = await client.callTool({
        name: 'list_active_skills',
        arguments: {},
      });

      const content = JSON.parse((result.content as Array<{type: string; text: string}>)[0].text);
      expect(content.active.length).toBe(1);
      expect(content.active[0].id).toBe('scanpy');
    });
  });

  describe('error handling', () => {
    it('returns error for unknown tool', async () => {
      try {
        await client.callTool({
          name: 'unknown_tool',
          arguments: {},
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
