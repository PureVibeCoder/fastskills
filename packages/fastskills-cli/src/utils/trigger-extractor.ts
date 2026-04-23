export function extractTriggers(name: string, description: string, content: string): string[] {
  const triggers: Set<string> = new Set();

  // Add skill name (converted to lowercase, hyphenated)
  const baseName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (baseName) {
    triggers.add(baseName);
  }

  // Extract English words from name (camelCase, PascalCase)
  const nameWords = name
    .replace(/([A-Z])/g, ' $1')
    .split(/\s+/)
    .map(w => w.toLowerCase())
    .filter(w => w.length > 2);
  nameWords.forEach(w => triggers.add(w));

  // Extract Chinese keywords from description
  const chineseRegex = /[\u4e00-\u9fa5]+/g;
  const chineseMatches = description.match(chineseRegex);
  if (chineseMatches) {
    chineseMatches.slice(0, 5).forEach(word => triggers.add(word));
  }

  // Extract English keywords from description
  const englishWords = description
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'will', 'your', 'need'].includes(w))
    .slice(0, 10);
  englishWords.forEach(w => triggers.add(w));

  // Add common skill-related keywords if present in content
  const commonKeywords = ['react', 'vue', 'angular', 'node', 'python', 'typescript', 'javascript'];
  const lowerContent = content.toLowerCase();
  commonKeywords.forEach(kw => {
    if (lowerContent.includes(kw)) {
      triggers.add(kw);
    }
  });

  return Array.from(triggers).slice(0, 15); // Limit to 15 triggers
}
