import chalk from 'chalk';
import { loadSkills } from '../utils/skills.js';
import { loadCategories } from '../utils/categories.js';

export async function listCommand(): Promise<void> {
  console.log(chalk.cyan('\n📦 FastSkills - Installed Skills\n'));

  const skills = loadSkills();
  const categories = loadCategories();

  // Group skills by category
  const skillsByCategory: Record<string, typeof skills> = {};

  for (const skill of skills) {
    const categoryId = skill.category?.id || 'uncategorized';
    if (!skillsByCategory[categoryId]) {
      skillsByCategory[categoryId] = [];
    }
    skillsByCategory[categoryId].push(skill);
  }

  // Display skills by category
  const uncategorized = skillsByCategory['uncategorized'] || [];
  delete skillsByCategory['uncategorized'];

  // Sort categories by skill count
  const sortedCategories = Object.entries(skillsByCategory)
    .sort((a, b) => b[1].length - a[1].length);

  for (const [categoryId, categorySkills] of sortedCategories) {
    const category = categories.find(c => c.id === categoryId);
    const icon = category?.icon || '📁';
    const name = category?.name || categoryId;
    const nameEn = category?.nameEn || '';

    console.log(`${icon} ${chalk.bold(name)} ${chalk.gray(`(${nameEn})`)} - ${categorySkills.length} skills`);

    for (const skill of categorySkills.slice(0, 10)) {
      const truncatedDesc = skill.description.length > 60
        ? skill.description.substring(0, 60) + '...'
        : skill.description;
      console.log(`  • ${chalk.cyan(skill.id)}: ${truncatedDesc}`);
    }

    if (categorySkills.length > 10) {
      console.log(`    ... and ${categorySkills.length - 10} more`);
    }

    console.log('');
  }

  // Display uncategorized skills
  if (uncategorized.length > 0) {
    console.log(`${chalk.bold('Uncategorized')} - ${uncategorized.length} skills`);
    for (const skill of uncategorized.slice(0, 10)) {
      const truncatedDesc = skill.description.length > 60
        ? skill.description.substring(0, 60) + '...'
        : skill.description;
      console.log(`  • ${chalk.cyan(skill.id)}: ${truncatedDesc}`);
    }
    console.log('');
  }

  console.log(chalk.gray(`Total: ${skills.length} skills installed`));
}
