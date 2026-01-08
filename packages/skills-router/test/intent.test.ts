import { describe, it, expect } from 'vitest';
import { detectIntent, getIntentKeywords } from '../src/engine/intent.js';
import { IntentType } from '../src/types.js';

describe('detectIntent', () => {
  describe('CREATE intent', () => {
    it.each([
      ['创建一个React组件', IntentType.CREATE],
      ['新建用户模块', IntentType.CREATE],
      ['开发一个API', IntentType.CREATE],
      ['build a REST API', IntentType.CREATE],
      ['create user authentication', IntentType.CREATE],
      ['implement dark mode', IntentType.CREATE],
      ['generate a form component', IntentType.CREATE],
    ])('detects "%s" as CREATE', (query, expected) => {
      expect(detectIntent(query)).toBe(expected);
    });
  });

  describe('RESEARCH intent', () => {
    it.each([
      ['研究单细胞RNA', IntentType.RESEARCH],
      ['调研竞品功能', IntentType.RESEARCH],
      ['research best practices', IntentType.RESEARCH],
      ['investigate memory leak', IntentType.RESEARCH],
      ['explore the codebase', IntentType.RESEARCH],
    ])('detects "%s" as RESEARCH', (query, expected) => {
      expect(detectIntent(query)).toBe(expected);
    });
  });

  describe('DEBUG intent', () => {
    it.each([
      ['调试登录功能', IntentType.DEBUG],
      ['修复内存泄漏', IntentType.DEBUG],
      ['解决跨域问题', IntentType.DEBUG],
      ['debug authentication issue', IntentType.DEBUG],
      ['fix the bug in login', IntentType.DEBUG],
      ['troubleshoot network error', IntentType.DEBUG],
    ])('detects "%s" as DEBUG', (query, expected) => {
      expect(detectIntent(query)).toBe(expected);
    });
  });

  describe('REFACTOR intent', () => {
    it.each([
      ['重构用户模块', IntentType.REFACTOR],
      ['改进API设计', IntentType.REFACTOR],
      ['refactor the authentication module', IntentType.REFACTOR],
      ['clean up legacy code', IntentType.REFACTOR],
      ['restructure the project', IntentType.REFACTOR],
    ])('detects "%s" as REFACTOR', (query, expected) => {
      expect(detectIntent(query)).toBe(expected);
    });
  });

  describe('DOCUMENT intent', () => {
    it.each([
      ['编写API文档', IntentType.DOCUMENT],
      ['添加注释说明', IntentType.DOCUMENT],
      ['document the API endpoints', IntentType.DOCUMENT],
      ['update the README', IntentType.DOCUMENT],
      ['add comments to explain', IntentType.DOCUMENT],
    ])('detects "%s" as DOCUMENT', (query, expected) => {
      expect(detectIntent(query)).toBe(expected);
    });
  });

  describe('TEST intent', () => {
    it.each([
      ['编写单元测试', IntentType.TEST],
      ['添加集成测试', IntentType.TEST],
      ['add unit test for login', IntentType.TEST],
      ['add e2e tests', IntentType.TEST],
      ['increase test coverage', IntentType.TEST],
    ])('detects "%s" as TEST', (query, expected) => {
      expect(detectIntent(query)).toBe(expected);
    });
  });

  describe('DEPLOY intent', () => {
    it.each([
      ['部署到生产环境', IntentType.DEPLOY],
      ['发布新版本', IntentType.DEPLOY],
      ['deploy to production', IntentType.DEPLOY],
      ['release version 2.0', IntentType.DEPLOY],
      ['setup kubernetes cluster', IntentType.DEPLOY],
    ])('detects "%s" as DEPLOY', (query, expected) => {
      expect(detectIntent(query)).toBe(expected);
    });
  });

  describe('ANALYZE intent', () => {
    it.each([
      ['可视化数据', IntentType.ANALYZE],
      ['visualize the data', IntentType.ANALYZE],
      ['plot the results', IntentType.ANALYZE],
      ['show statistics', IntentType.ANALYZE],
    ])('detects "%s" as ANALYZE', (query, expected) => {
      expect(detectIntent(query)).toBe(expected);
    });
  });

  describe('CONVERT intent', () => {
    it.each([
      ['转换文件格式', IntentType.CONVERT],
      ['导出为CSV', IntentType.CONVERT],
      ['convert to JSON', IntentType.CONVERT],
      ['import from MySQL', IntentType.CONVERT],
      ['export the report', IntentType.CONVERT],
    ])('detects "%s" as CONVERT', (query, expected) => {
      expect(detectIntent(query)).toBe(expected);
    });
  });

  describe('DESIGN intent', () => {
    it.each([
      ['设计UI界面', IntentType.DESIGN],
      ['design a landing page', IntentType.DESIGN],
      ['change the UI layout', IntentType.DESIGN],
      ['style the components', IntentType.DESIGN],
      ['frontend design', IntentType.DESIGN],
    ])('detects "%s" as DESIGN', (query, expected) => {
      expect(detectIntent(query)).toBe(expected);
    });
  });

  describe('OPTIMIZE intent', () => {
    it.each([
      ['提升性能', IntentType.OPTIMIZE],
      ['加速页面加载', IntentType.OPTIMIZE],
      ['performance tuning', IntentType.OPTIMIZE],
      ['add cache layer', IntentType.OPTIMIZE],
      ['compress the assets', IntentType.OPTIMIZE],
    ])('detects "%s" as OPTIMIZE', (query, expected) => {
      expect(detectIntent(query)).toBe(expected);
    });
  });

  describe('UNKNOWN intent', () => {
    it.each([
      ['hello world'],
      ['random text'],
      ['foo bar baz'],
    ])('detects "%s" as UNKNOWN', (query) => {
      expect(detectIntent(query)).toBe(IntentType.UNKNOWN);
    });
  });
});

describe('getIntentKeywords', () => {
  it('returns keywords for CREATE intent', () => {
    const keywords = getIntentKeywords(IntentType.CREATE);
    expect(keywords).toContain('create');
    expect(keywords).toContain('build');
    expect(keywords.length).toBeGreaterThan(0);
  });

  it('returns keywords for RESEARCH intent', () => {
    const keywords = getIntentKeywords(IntentType.RESEARCH);
    expect(keywords).toContain('research');
    expect(keywords).toContain('analyze');
  });

  it('returns empty array for UNKNOWN intent', () => {
    const keywords = getIntentKeywords(IntentType.UNKNOWN);
    expect(keywords).toEqual([]);
  });

  it('returns keywords for all defined intents', () => {
    const intentTypes = Object.values(IntentType).filter(v => v !== IntentType.UNKNOWN);
    for (const intent of intentTypes) {
      const keywords = getIntentKeywords(intent);
      expect(keywords.length).toBeGreaterThan(0);
    }
  });
});
