export interface SkillMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  source: string;
  triggers: string[];
  path: string;
  baseUrl?: string;
  fullDescription?: string;
}

export interface SearchResult {
  skill: SkillMeta;
  score: number;
  reason: string;
}

export interface Env {
  SKILLS_INDEX_URL: string;
}
