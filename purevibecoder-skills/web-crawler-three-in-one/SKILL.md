---
name: web-crawler-three-in-one
category: research
description: |
  三引擎合一的AI爬虫能力，快速捕获网页、搜索引擎和结构化数据。
  
  **解决痛点：**
  - 静态页面解析不了JS渲染内容（React/Vue单页应用）
  - 捕获的数据需要二次清洗（HTML标签、CSS样式混杂）
  
  **三引擎：**
  1. **静态引擎**：BeautifulSoup式快速解析
  2. **动态引擎**：Playwright/Selenium渲染JS页面
  3. **智能引擎**：LLM-powered自动提取结构化数据

trigger:
  - 爬虫
  - 抓取网页
  - 数据收集
  - 竞品监控
  - 信息抓取
  - web scraping
  - 批量下载
version: 1.0.0
author: 翡冷翠
source: https://x.com/NFTCPS/status/2046414824901652766
---

# AI 爬虫三合一技能教程

> 本教程目标：帮助任何人掌握三引擎合一的爬虫能力

---

## 一、技能概述

在 AI 时代，传统的爬虫方案面临两大痛点：

1. **静态页面解析不了 JS 渲染内容** —— 现代网站大多是 React/Vue 单页应用，纯 HTML 解析只能拿到空壳
2. **捕获的数据需要二次清洗** —— HTML 标签、CSS 样式、广告弹窗混在一起，不好直接喂给 LLM

**爬虫三合一** 解决的就是这个问题：把三种引擎打包在一起，根据页面特点自动或手动选择最适合的方案，输出直接可以喂给 LLM 的结构化数据。

---

## 二、为什么要用它

| 场景 | 传统方案的痛点 | 三合一方案 |
|---|---|---|
| 抓取普通文章页面 | 需要写 BeautifulSoup 解析 | 一行 API 调用，返回 Markdown |
| 抓取 JS 渲染页面 | 需要配置 Selenium/Playwright | 切换引擎即可，无需额外配置 |
| 批量搜索 Google | 需要自己处理反爬虫、验证码 | 内置 SERP 爬取，批量友好 |
| 从页面提取结构化数据 | 需要写正则或 XPath | LLM-powered 自动提取 JSON |
| 全站爬取 | 需要自己写 BFS/DFS 逻辑 | 配置 max_depth 和 limit 即可 |

**典型用途：**
- 竞品信息收集（价格、功能、文案）
- 行业研究数据采集
- 学术论文批量下载
- 社交媒体内容监控
- 产品评价抓取分析

---

## 三、核心能力

### 引擎一：静态解析
适合传统 CMS 网站、博客、新闻站点
```python
# 返回清洗后的 Markdown
```

### 引擎二：动态渲染
适合 React/Vue 单页应用、需要登录的页面
```python
# Playwright 自动渲染，等待 JS 执行完成
```

### 引擎三：智能提取
LLM 自动识别页面结构，提取结构化数据
```python
# 自动识别产品名称、价格、描述等字段
```

---

## 四、推荐工具

**AnyCrawl** - 开源爬虫框架
```bash
pip install anycrawl
```

支持三引擎切换、批量任务、自动反爬虫处理。

---

*来自翡冷翠 @ Neuma-Superpower*
