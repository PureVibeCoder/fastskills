import { readFileSync, promises as fs } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..', '..', '..');

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  parent?: string;
}

let categoriesCache: Category[] | null = null;

export function loadCategories(): Category[] {
  if (categoriesCache) return categoriesCache;

  const categoriesPath = join(projectRoot, 'packages', 'website', 'src', 'data', 'categories.ts');
  const content = readFileSync(categoriesPath, 'utf-8');

  // Extract categories from the file
  const match = content.match(/export const categories: Category\[\] = \[([\s\S]*?)\];/);
  if (!match) {
    throw new Error('Could not parse categories.ts');
  }

  // Simple parsing - extract category objects
  const categoryObjects: Category[] = [];

  // Parse each category entry
  const entries = content.matchAll(/\{\s*id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"],\s*nameEn:\s*['"]([^'"]+)['"],\s*description:\s*['"]([^'"]+)['"],\s*icon:\s*['"]([^'"]+)['"](?:,\s*parent:\s*['"]([^'"]+)['"])?\s*\}/g);

  for (const entry of entries) {
    categoryObjects.push({
      id: entry[1],
      name: entry[2],
      nameEn: entry[3],
      description: entry[4],
      icon: entry[5],
      parent: entry[6] as string | undefined
    });
  }

  categoriesCache = categoryObjects;
  return categoriesCache;
}

export function getMainCategories(): Category[] {
  return loadCategories().filter(cat => !cat.parent);
}

export function getSubCategories(parentId: string): Category[] {
  return loadCategories().filter(cat => cat.parent === parentId);
}
