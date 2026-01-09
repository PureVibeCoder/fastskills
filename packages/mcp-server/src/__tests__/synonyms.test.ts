import { describe, it, expect } from 'vitest';
import { expandQueryWithSynonyms } from '../engine/synonyms';

describe('Synonym Expansion', () => {
  it('should expand Chinese terms to English', () => {
    const expanded = expandQueryWithSynonyms('蛋白质结构预测');

    expect(expanded).toContain('protein');
    expect(expanded).toContain('structure');
    expect(expanded).toContain('prediction');
  });

  it('should expand domain aliases', () => {
    const expanded = expandQueryWithSynonyms('scanpy analysis');

    expect(expanded).toContain('single-cell');
    expect(expanded).toContain('bioinformatics');
    expect(expanded).toContain('scRNA-seq');
  });

  it('should avoid false positives with word boundaries', () => {
    // "reaction" should not match "react"
    const expanded = expandQueryWithSynonyms('chemical reaction');

    expect(expanded).not.toContain('frontend');
    expect(expanded).not.toContain('ui');
    expect(expanded).not.toContain('component');
  });

  it('should match exact word react', () => {
    const expanded = expandQueryWithSynonyms('react component');

    expect(expanded).toContain('frontend');
    expect(expanded).toContain('ui');
  });

  it('should deduplicate terms', () => {
    const expanded = expandQueryWithSynonyms('frontend frontend react');
    const terms = expanded.split(' ');
    const uniqueTerms = [...new Set(terms)];

    expect(terms.length).toBe(uniqueTerms.length);
  });

  it('should handle mixed Chinese and English', () => {
    const expanded = expandQueryWithSynonyms('分析 single-cell 数据');

    expect(expanded).toContain('分析');
    expect(expanded).toContain('single-cell');
  });
});
