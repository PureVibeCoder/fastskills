import { describe, it, expect } from 'vitest';
import { TfIdfEngine } from '../engine/tfidf';

describe('TfIdfEngine', () => {
  it('should add and search documents', () => {
    const engine = new TfIdfEngine();

    engine.addDocument('doc1', 'React component development frontend');
    engine.addDocument('doc2', 'Python data analysis pandas numpy');
    engine.addDocument('doc3', 'Docker container deployment kubernetes');

    const results = engine.search('React frontend', 2);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('doc1');
  });

  it('should handle Chinese text', () => {
    const engine = new TfIdfEngine();

    engine.addDocument('scanpy', '单细胞 RNA 分析 scRNA-seq bioinformatics');
    engine.addDocument('rdkit', '分子 化学 药物设计 cheminformatics');

    const results = engine.search('单细胞分析', 2);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('scanpy');
  });

  it('should return empty for no matches', () => {
    const engine = new TfIdfEngine();

    engine.addDocument('doc1', 'React component');

    const results = engine.search('zzzznotfound', 5);

    expect(results.length).toBe(0);
  });

  it('should respect limit parameter', () => {
    const engine = new TfIdfEngine();

    engine.addDocument('doc1', 'test one');
    engine.addDocument('doc2', 'test two');
    engine.addDocument('doc3', 'test three');
    engine.addDocument('doc4', 'test four');

    const results = engine.search('test', 2);

    expect(results.length).toBe(2);
  });

  it('should clear documents', () => {
    const engine = new TfIdfEngine();

    engine.addDocument('doc1', 'hello world');
    expect(engine.size()).toBe(1);

    engine.clear();
    expect(engine.size()).toBe(0);
  });
});
