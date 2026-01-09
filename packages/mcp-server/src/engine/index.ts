/**
 * FastSkills Search Engine
 * Re-exports all engine components
 */

export { TfIdfEngine, type TfIdfDocument, type TfIdfSearchResult } from './tfidf';
export { expandQueryWithSynonyms, CHINESE_TO_ENGLISH_SYNONYMS, DOMAIN_ALIASES } from './synonyms';
export { detectIntent, getIntentKeywords, IntentType, INTENT_CATEGORY_MAP } from './intent';
