// @ts-check
import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cloudflare from '@astrojs/cloudflare';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  vite: {
    resolve: {
      alias: {
        '@anthropic-skills': path.resolve(__dirname, '../../anthropic-skills'),
        '@scientific-skills': path.resolve(__dirname, '../../scientific-skills'),
        '@claudekit-skills': path.resolve(__dirname, '../../claudekit-skills'),
        '@awesome-claude-skills': path.resolve(__dirname, '../../awesome-claude-skills'),
        '@composio-skills': path.resolve(__dirname, '../../composio-skills'),
        '@voltagent-skills': path.resolve(__dirname, '../../voltagent-skills'),
        '@obsidian-skills': path.resolve(__dirname, '../../obsidian-skills'),
        '@planning-with-files': path.resolve(__dirname, '../../planning-with-files'),
      }
    }
  }
});
