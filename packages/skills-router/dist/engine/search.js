import natural from 'natural';
import { IntentType } from '../types.js';
import { detectIntent, getIntentKeywords } from './intent.js';
const INTENT_CATEGORY_MAP = {
    [IntentType.CREATE]: ['frontend', 'backend', 'tools', 'skill-dev'],
    [IntentType.RESEARCH]: ['scientific', 'bioinformatics', 'cheminformatics', 'sci-databases'],
    [IntentType.DEBUG]: ['testing', 'thinking', 'tools'],
    [IntentType.REFACTOR]: ['backend', 'frontend', 'thinking'],
    [IntentType.DOCUMENT]: ['document', 'sci-communication', 'knowledge'],
    [IntentType.TEST]: ['testing', 'tools'],
    [IntentType.DEPLOY]: ['devops', 'tools'],
    [IntentType.ANALYZE]: ['data-viz', 'ml-ai', 'scientific'],
    [IntentType.CONVERT]: ['document', 'tools', 'media'],
    [IntentType.DESIGN]: ['frontend', 'media', 'data-viz'],
    [IntentType.OPTIMIZE]: ['backend', 'devops', 'ml-ai'],
    [IntentType.UNKNOWN]: [],
};
export class SkillSearchEngine {
    tfidf;
    skills;
    initialized = false;
    constructor(skills = []) {
        this.tfidf = new natural.TfIdf();
        this.skills = skills;
        if (skills.length > 0) {
            this.buildIndex();
        }
    }
    buildIndex() {
        for (const skill of this.skills) {
            const document = [
                skill.name,
                skill.name,
                skill.description,
                skill.triggers.join(' '),
                skill.category,
                skill.fullDescription || ''
            ].join(' ');
            this.tfidf.addDocument(document);
        }
        this.initialized = true;
    }
    setSkills(skills) {
        this.skills = skills;
        this.tfidf = new natural.TfIdf();
        this.buildIndex();
    }
    search(query, limit = 5, options) {
        if (!this.initialized || this.skills.length === 0) {
            return [];
        }
        const results = [];
        const intent = detectIntent(query);
        const intentKeywords = getIntentKeywords(intent);
        const enhancedQuery = [...query.split(/\s+/), ...intentKeywords].join(' ');
        this.tfidf.tfidfs(enhancedQuery, (index, score) => {
            if (score > 0 && index < this.skills.length) {
                const skill = this.skills[index];
                let adjustedScore = score;
                if (intent !== IntentType.UNKNOWN) {
                    const intentCategories = INTENT_CATEGORY_MAP[intent] || [];
                    if (intentCategories.includes(skill.category)) {
                        adjustedScore *= 1.5;
                    }
                }
                results.push({
                    skill,
                    score: adjustedScore,
                    reason: this.generateReason(query, skill, intent)
                });
            }
        });
        let filteredResults = results;
        if (options?.category) {
            filteredResults = results.filter(r => r.skill.category === options.category);
        }
        return filteredResults
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
    generateReason(query, skill, intent) {
        const queryTokens = new Set(query.toLowerCase().split(/\s+/));
        const matchedTriggers = skill.triggers.filter(t => queryTokens.has(t.toLowerCase()));
        if (matchedTriggers.length > 0) {
            return `匹配关键词: ${matchedTriggers.slice(0, 3).join(', ')}`;
        }
        if (intent !== IntentType.UNKNOWN) {
            const intentCategories = INTENT_CATEGORY_MAP[intent] || [];
            if (intentCategories.includes(skill.category)) {
                return `意图匹配: ${intent} → ${skill.category}`;
            }
        }
        return `语义相关: ${skill.category}`;
    }
    getSkillById(id) {
        return this.skills.find(s => s.id === id);
    }
    getAllSkills() {
        return this.skills;
    }
    getSkillCount() {
        return this.skills.length;
    }
}
//# sourceMappingURL=search.js.map