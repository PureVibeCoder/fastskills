# Skills.sh 自动爬虫

每日定时从 [skills.sh](https://skills.sh) 抓取热门技能，进行安全检查后自动收录到 FastSkills。

## 工作流程

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  GitHub Actions │────▶│  Crawl skills.sh│────▶│ Security Scan   │
│  (Daily 02:00)  │     │  (Top 5 hot)    │     │ (score >= 80)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                              ┌────────────────────────┼────────────────────────┐
                              ▼                        ▼                        ▼
                        ┌─────────┐              ┌─────────┐              ┌─────────┐
                        │Accepted │              │Needs    │              │Rejected │
                        │(import) │              │Review   │              │(report) │
                        └────┬────┘              └─────────┘              └─────────┘
                             │
                             ▼
                        ┌─────────────────┐
                        │  Create PR      │
                        │  (Auto-import)  │
                        └─────────────────┘
```

## 组件说明

### 1. 爬虫脚本 (`crawl-skills-sh.mjs`)

从 skills.sh 抓取热门技能并执行安全检查：

```bash
# 抓取前 5 个热门技能
node crawl-skills-sh.mjs --limit=5

# 仅测试，不写入文件
node crawl-skills-sh.mjs --limit=5 --dry-run

# 强制重新抓取已存在的技能
node crawl-skills-sh.mjs --limit=5 --force
```

**安全检查标准：**
- ✅ **Accepted** (>=80分): 自动收录
- ⚠️ **Needs Review** (60-79分): 标记需人工审查
- ❌ **Rejected** (<60分): 拒绝收录，生成报告

**检测的安全问题：**
- `eval()`, `Function()` 等动态代码执行
- `shell=True` 命令注入风险
- 路径遍历 (`../`)
- 硬编码密钥/密码
- 不安全的 URL 协议 (file://, gopher://)
- 不安全的反序列化 (pickle.load, yaml.load)
- XSS 风险 (dangerouslySetInnerHTML)

### 2. 收录脚本 (`import-skills.mjs`)

将通过安全检查的技能自动收录到 FastSkills：

```bash
# 使用默认路径 (output/accepted-skills.json)
node import-skills.mjs

# 指定输入文件
node import-skills.mjs /path/to/accepted-skills.json

# 仅测试，不写入文件
node import-skills.mjs --dry-run
```

**自动更新的文件：**
1. `skill-sources.ts` - 添加技能源映射
2. `skills.ts` - 添加技能元数据
3. `fastskills-router/SKILL.md` - 添加路由条目

### 3. GitHub Actions 工作流

`.github/workflows/daily-skills-crawler.yml`

**定时执行：**
- 每天 UTC 02:00 (北京时间 10:00)
- 支持手动触发 (`workflow_dispatch`)

**任务流程：**
1. **crawl-and-report**: 抓取技能并生成安全报告
2. **import-skills**: 将接受的技能导入项目，创建 PR
3. **notify-skills-sh**: (可选) 向 skills.sh 报告安全问题

## 输出文件

```
scripts/crawler/
├── output/
│   └── accepted-skills.json    # 通过安全检查的技能
├── reports/
│   ├── report-{timestamp}.json # 完整报告 (JSON)
│   └── report-{timestamp}.md   # 可读报告 (Markdown)
└── README.md                   # 本文档
```

## 安全报告示例

```markdown
# Skills.sh 抓取安全报告

## 摘要

- 总共处理: 5 个技能
- ✅ 通过 (安全): 3 个
- ❌ 拒绝 (危险): 1 个
- ⚠️ 需审查 (中等风险): 1 个

## ❌ 被拒绝的技能

### dangerous-skill

- **来源**: owner/repo
- **安全评分**: 45/100
- **风险等级**: risky

**发现的问题:**
- [HIGH] Code Execution: Detected eval() usage
- [HIGH] Command Injection: shell=True detected
```

## 配置

### 修改抓取数量

编辑 `.github/workflows/daily-skills-crawler.yml`:

```yaml
- name: Run skills.sh crawler
  run: node crawl-skills-sh.mjs --limit=10  # 改为抓取10个
```

### 调整安全阈值

编辑 `crawl-skills-sh.mjs`:

```javascript
const CONFIG = {
  SECURITY_THRESHOLD: 80,  // 通过阈值
  REJECT_THRESHOLD: 60,    // 拒绝阈值
};
```

## 本地测试

```bash
# 安装依赖
cd packages/website
pnpm install

# 运行爬虫
node scripts/crawler/crawl-skills-sh.mjs --limit=3 --dry-run

# 查看报告
cat scripts/crawler/reports/report-*.md
```

## 手动触发

在 GitHub 仓库页面：
1. 进入 **Actions** 标签
2. 选择 **Daily Skills.sh Crawler**
3. 点击 **Run workflow**
4. 可选：设置 `limit` 和 `dry_run` 参数

## 故障排除

### 爬虫无法获取技能列表

检查 skills.sh 页面结构是否变化：
```bash
curl -s https://skills.sh/hot | grep -o '<a[^>]*href="/[^"]*"' | head -20
```

### 安全评分过低

查看详细报告了解具体问题：
```bash
cat scripts/crawler/reports/report-*.md
```

### GitHub Actions 失败

检查以下配置：
- `GITHUB_TOKEN` 权限 (需要 `contents:write` 和 `pull-requests:write`)
- Node.js 版本 (20+)
- pnpm 版本 (8+)

## 向 skills.sh 报告安全问题

当发现被拒绝的技能时，建议通过以下方式报告：

1. **GitHub Issues**: 在 [skills.sh 仓库](https://github.com/vercel-labs/skills) 创建 Issue
2. **Email**: 联系维护团队
3. **Discord/Slack**: 通过社区频道私下报告

**报告模板：**
```
标题: [Security] Suspicious patterns detected in skills

在自动安全扫描中发现以下技能包含潜在风险模式：
- eval() 或动态代码执行
- shell=True 配置  
- 路径遍历模式
- 硬编码密钥

建议进行人工审查。
```

## 许可证

MIT License - 参见项目根目录 LICENSE 文件
