import { describe, it, expect } from 'vitest';
import { detectIntent, getIntentKeywords, IntentType } from '../engine/intent';

describe('Intent Detection', () => {
  it('should detect CREATE intent', () => {
    expect(detectIntent('创建一个新组件')).toBe(IntentType.CREATE);
    expect(detectIntent('build a React component')).toBe(IntentType.CREATE);
    expect(detectIntent('implement a new feature')).toBe(IntentType.CREATE);
  });

  it('should detect DEBUG intent', () => {
    expect(detectIntent('修复这个bug')).toBe(IntentType.DEBUG);
    expect(detectIntent('fix the error in login')).toBe(IntentType.DEBUG);
    expect(detectIntent('debug the issue')).toBe(IntentType.DEBUG);
  });

  it('should detect TEST intent', () => {
    expect(detectIntent('写单元测试')).toBe(IntentType.TEST);
    expect(detectIntent('add unit tests')).toBe(IntentType.TEST);
    expect(detectIntent('run pytest')).toBe(IntentType.TEST);
  });

  it('should detect DEPLOY intent', () => {
    expect(detectIntent('部署到生产环境')).toBe(IntentType.DEPLOY);
    expect(detectIntent('deploy to kubernetes')).toBe(IntentType.DEPLOY);
    // "set up docker container" matches DEPLOY via devops domain context
    expect(detectIntent('deploy docker container')).toBe(IntentType.DEPLOY);
  });

  it('should detect RESEARCH intent for chemistry domain', () => {
    // Chemistry domain should override DESIGN to RESEARCH
    expect(detectIntent('设计分子结构')).toBe(IntentType.RESEARCH);
    expect(detectIntent('design a new protein')).toBe(IntentType.RESEARCH);
    expect(detectIntent('molecule visualization')).toBe(IntentType.RESEARCH);
  });

  it('should detect ANALYZE intent', () => {
    // Note: "分析" alone matches RESEARCH, need explicit ANALYZE triggers
    expect(detectIntent('visualize the statistics')).toBe(IntentType.ANALYZE);
    expect(detectIntent('show data chart')).toBe(IntentType.ANALYZE);
  });

  it('should return UNKNOWN for ambiguous queries', () => {
    expect(detectIntent('hello world')).toBe(IntentType.UNKNOWN);
  });

  it('should return keywords for each intent', () => {
    const createKeywords = getIntentKeywords(IntentType.CREATE);
    expect(createKeywords).toContain('create');
    expect(createKeywords).toContain('build');

    const debugKeywords = getIntentKeywords(IntentType.DEBUG);
    expect(debugKeywords).toContain('debug');
    expect(debugKeywords).toContain('fix');

    const unknownKeywords = getIntentKeywords(IntentType.UNKNOWN);
    expect(unknownKeywords.length).toBe(0);
  });
});
