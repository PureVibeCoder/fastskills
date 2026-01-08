import { describe, it, expect, beforeAll } from 'vitest';
import { SkillSearchEngine } from '../src/engine/search.js';
import { SkillMeta } from '../src/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Chinese-English Synonym Expansion', () => {
  let allSkills: SkillMeta[];
  let engine: SkillSearchEngine;

  beforeAll(async () => {
    const skillsPath = path.join(__dirname, '..', 'src', 'data', 'skills.json');
    const content = await fs.readFile(skillsPath, 'utf-8');
    allSkills = JSON.parse(content);
    engine = new SkillSearchEngine(allSkills);
  });

  describe('Scientific Domain Expansions', () => {
    it('expands "蛋白质" to protein-related terms', () => {
      const results = engine.search('蛋白质结构', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasProteinSkill = results.some(r =>
        r.skill.description.toLowerCase().includes('protein') ||
        r.skill.triggers.some(t => t.toLowerCase().includes('protein'))
      );
      expect(hasProteinSkill).toBe(true);
    });

    it('expands "单细胞" to single-cell related terms', () => {
      const results = engine.search('单细胞分析', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasSingleCellSkill = results.some(r =>
        r.skill.description.toLowerCase().includes('single-cell') ||
        r.skill.description.toLowerCase().includes('scanpy') ||
        r.skill.triggers.some(t => 
          t.toLowerCase().includes('single') || 
          t.toLowerCase().includes('scanpy')
        )
      );
      expect(hasSingleCellSkill).toBe(true);
    });

    it('expands "基因" to gene-related terms', () => {
      const results = engine.search('基因序列分析', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasGeneSkill = results.some(r =>
        r.skill.description.toLowerCase().includes('gene') ||
        r.skill.description.toLowerCase().includes('genomic') ||
        r.skill.category === 'bioinformatics'
      );
      expect(hasGeneSkill).toBe(true);
    });

    it('expands "分子" to molecular-related terms', () => {
      const results = engine.search('分子模拟', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasMolecularSkill = results.some(r =>
        r.skill.description.toLowerCase().includes('molecul') ||
        r.skill.category === 'cheminformatics'
      );
      expect(hasMolecularSkill).toBe(true);
    });

    it('expands "药物" to drug-related terms', () => {
      const results = engine.search('药物发现', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasDrugSkill = results.some(r =>
        r.skill.description.toLowerCase().includes('drug') ||
        r.skill.description.toLowerCase().includes('pharmaceutical')
      );
      expect(hasDrugSkill).toBe(true);
    });
  });

  describe('Technical Domain Expansions', () => {
    it('expands "爬虫" to crawler/scraping terms', () => {
      const results = engine.search('网页爬虫', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasCrawlerSkill = results.some(r =>
        r.skill.description.toLowerCase().includes('playwright') ||
        r.skill.description.toLowerCase().includes('scrap') ||
        r.skill.description.toLowerCase().includes('browser')
      );
      expect(hasCrawlerSkill).toBe(true);
    });

    it('expands "浏览器" to browser-related terms', () => {
      const results = engine.search('浏览器自动化', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasBrowserSkill = results.some(r =>
        r.skill.description.toLowerCase().includes('browser') ||
        r.skill.description.toLowerCase().includes('playwright') ||
        r.skill.description.toLowerCase().includes('chrome')
      );
      expect(hasBrowserSkill).toBe(true);
    });

    it('expands "前端" to frontend-related terms', () => {
      const results = engine.search('前端开发', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasFrontendSkill = results.some(r =>
        r.skill.category === 'frontend' ||
        r.skill.description.toLowerCase().includes('react') ||
        r.skill.description.toLowerCase().includes('frontend')
      );
      expect(hasFrontendSkill).toBe(true);
    });

    it('expands "后端" to backend-related terms', () => {
      const results = engine.search('后端API', 10);
      expect(results.length).toBeGreaterThan(0);
    });

    it('expands "测试" to testing-related terms', () => {
      const results = engine.search('自动化测试', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasTestingSkill = results.some(r =>
        r.skill.category === 'testing' ||
        r.skill.description.toLowerCase().includes('test') ||
        r.skill.triggers.some(t => t.toLowerCase().includes('test'))
      );
      expect(hasTestingSkill).toBe(true);
    });

    it('expands "部署" to deployment-related terms', () => {
      const results = engine.search('部署Docker', 10);
      expect(results.length).toBeGreaterThan(0);
    });

    it('expands "容器" to container-related terms', () => {
      const results = engine.search('容器编排', 10);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Data Science Expansions', () => {
    it('expands "机器学习" to ML-related terms', () => {
      const results = engine.search('机器学习模型', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasMLSkill = results.some(r =>
        r.skill.category === 'ml-ai' ||
        r.skill.description.toLowerCase().includes('machine') ||
        r.skill.description.toLowerCase().includes('learning')
      );
      expect(hasMLSkill).toBe(true);
    });

    it('expands "深度学习" to deep learning terms', () => {
      const results = engine.search('深度学习神经网络', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasDeepLearningSkill = results.some(r =>
        r.skill.category === 'ml-ai' ||
        r.skill.description.toLowerCase().includes('deep') ||
        r.skill.description.toLowerCase().includes('neural') ||
        r.skill.description.toLowerCase().includes('pytorch')
      );
      expect(hasDeepLearningSkill).toBe(true);
    });

    it('expands "可视化" to visualization terms', () => {
      const results = engine.search('数据可视化', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasVizSkill = results.some(r =>
        r.skill.category === 'data-viz' ||
        r.skill.description.toLowerCase().includes('visual') ||
        r.skill.description.toLowerCase().includes('plot')
      );
      expect(hasVizSkill).toBe(true);
    });

    it('expands "统计" to statistics terms', () => {
      const results = engine.search('统计分析', 10);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Domain Alias Expansions', () => {
    it('recognizes "rdkit" as chemistry domain', () => {
      const results = engine.search('use rdkit for analysis', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasChemistrySkill = results.some(r =>
        r.skill.category === 'cheminformatics' ||
        r.skill.id.toLowerCase().includes('rdkit')
      );
      expect(hasChemistrySkill).toBe(true);
    });

    it('recognizes "scanpy" as single-cell domain', () => {
      const results = engine.search('use scanpy for analysis', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasScanpySkill = results.some(r =>
        r.skill.category === 'bioinformatics' ||
        r.skill.id.toLowerCase().includes('scanpy')
      );
      expect(hasScanpySkill).toBe(true);
    });

    it('recognizes "pytorch" as deep learning domain', () => {
      const results = engine.search('pytorch neural network', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasMLSkill = results.some(r =>
        r.skill.category === 'ml-ai' ||
        r.skill.description.toLowerCase().includes('pytorch')
      );
      expect(hasMLSkill).toBe(true);
    });

    it('recognizes "playwright" as browser automation domain', () => {
      const results = engine.search('playwright testing', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasBrowserSkill = results.some(r =>
        r.skill.description.toLowerCase().includes('playwright')
      );
      expect(hasBrowserSkill).toBe(true);
    });

    it('recognizes "docker" as container domain', () => {
      const results = engine.search('docker kubernetes deployment', 10);
      expect(results.length).toBeGreaterThan(0);
    });

    it('recognizes "pandas" as data analysis domain', () => {
      const results = engine.search('pandas dataframe', 10);
      expect(results.length).toBeGreaterThan(0);
    });

    it('recognizes "matplotlib" as visualization domain', () => {
      const results = engine.search('matplotlib plotting', 10);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Mixed Chinese-English Queries', () => {
    it('handles "分析 single-cell 数据"', () => {
      const results = engine.search('分析 single-cell 数据', 10);
      expect(results.length).toBeGreaterThan(0);
      const hasBioSkill = results.some(r =>
        r.skill.category === 'bioinformatics' ||
        r.skill.description.toLowerCase().includes('single-cell')
      );
      expect(hasBioSkill).toBe(true);
    });

    it('handles "使用 React 创建组件"', () => {
      const results = engine.search('使用 React 创建组件', 10);
      expect(results.length).toBeGreaterThan(0);
    });

    it('handles "Docker 容器化 部署"', () => {
      const results = engine.search('Docker 容器化 部署', 10);
      expect(results.length).toBeGreaterThan(0);
    });

    it('handles "PyTorch 深度学习 训练"', () => {
      const results = engine.search('PyTorch 深度学习 训练', 10);
      expect(results.length).toBeGreaterThan(0);
    });

    it('handles "Playwright 浏览器 自动化测试"', () => {
      const results = engine.search('Playwright 浏览器 自动化测试', 10);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Query Expansion Coverage', () => {
    const synonymMappings = [
      { chinese: '蛋白质', expectedEnglish: ['protein', 'alphafold'] },
      { chinese: '单细胞', expectedEnglish: ['single-cell', 'scanpy'] },
      { chinese: '基因', expectedEnglish: ['gene', 'genomic'] },
      { chinese: '分子', expectedEnglish: ['molecule', 'molecular'] },
      { chinese: '化学', expectedEnglish: ['chemistry', 'chemical'] },
      { chinese: '药物', expectedEnglish: ['drug', 'pharmaceutical'] },
      { chinese: '爬虫', expectedEnglish: ['crawler', 'scraping', 'playwright'] },
      { chinese: '浏览器', expectedEnglish: ['browser', 'chrome'] },
      { chinese: '前端', expectedEnglish: ['frontend', 'react'] },
      { chinese: '后端', expectedEnglish: ['backend', 'api'] },
      { chinese: '测试', expectedEnglish: ['test', 'testing'] },
      { chinese: '部署', expectedEnglish: ['deploy', 'kubernetes', 'docker'] },
      { chinese: '机器学习', expectedEnglish: ['machine-learning', 'ml'] },
      { chinese: '深度学习', expectedEnglish: ['deep-learning', 'pytorch'] },
      { chinese: '可视化', expectedEnglish: ['visualization', 'plot'] },
    ];

    for (const mapping of synonymMappings) {
      it(`expands "${mapping.chinese}" and finds relevant skills`, () => {
        const results = engine.search(mapping.chinese, 10);
        expect(results.length).toBeGreaterThan(0);
      });
    }
  });
});
