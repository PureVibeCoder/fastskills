#!/usr/bin/env node
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

try {
  const { main } = await import(`${distDir}/index.js`);
  await main();
} catch (error) {
  console.error('Error running fastskills CLI:');
  console.error(error.message);
  if (error.code === 'ERR_MODULE_NOT_FOUND') {
    console.error('\nPlease run "pnpm build" first to build the CLI.');
  }
  process.exit(1);
}
