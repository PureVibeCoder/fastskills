# GPT-image-2 官方渠道出图工作流

> 技能版本：v1.2.0 | 来源：Hermes Skills 迭代优化

## 能力概述

基于 API Mart GPT-image-2 官方渠道的完整出图工作流，支持 **1K/2K/4K 分辨率自动管理**、出图后质量检查、一键生成分享帖文案。

### 核心特性

| 特性 | 说明 |
|------|------|
| 分辨率档位管理 | **4K**（2160p/3840p） · **2K**（1080p/2048p） · **1K**（540p/1024p），自动降级 |
| 官方渠道接口 | `gpt-image-2-official`，支持 `resolution` 字段 |
| 4K 白名单支持 | `16:9` · `9:16` · `2:1` · `1:2` · `21:9` · `9:21`（其余比例自动降级为 2K） |
| 出图后检查 | 分辨率验证、像素总量、格式、色彩模式 |
| 文件结构 | 每条推文独立文件夹，图片+提示词+分享帖+检查报告 |
| 分享帖模板 | 自动生成 X/社交平台可发帖格式 |

## 快速使用

```bash
cd skills/gpt-image-2-workflow

# 日常配图 4:5（2K 默认）
python3 scripts/generate-and-share.py "你的提示词" 4:5 filename-prefix

# 高清海报 3:4
python3 scripts/generate-and-share.py "你的提示词" 3:4 poster 2k high

# 竖屏 4K 封面（9:16 支持 4K）
python3 scripts/generate-and-share.py "你的提示词" 9:16 vertical 4k high

# 横幅 4K（21:9 支持 4K）
python3 scripts/generate-and-share.py "你的提示词" 21:9 banner 4k ultra
```

## 分辨率档位规则

| 档位 | 最大边基准 | 总像素上限 | 支持比例数 |
|------|-----------|-----------|----------|
| `1k` | 1024 | 约 100 万 | 13 种 |
| **`2k`** | **2048** | 约 400 万 | **13 种（默认）** |
| `4k` | 3840 | **8,294,400** | **6 种（有限制）** |

### 4K 支持比例白名单

✅ `16:9` · `9:16` · `2:1` · `1:2` · `21:9` · `9:21`

❌ 不支持 4K（自动降级为 2K）：`1:1` · `3:2` · `2:3` · `4:3` · `3:4` · `5:4` · `4:5`

降级原因：OpenAI 单图总像素上限 8,294,400，上述比例的 4K 版本会超出上限。

## 环境配置

脚本需要 `APIMART_API_KEY` 环境变量，或通过 `~/.env` 等方式配置。不在脚本中硬编码密钥。

## 输出结构

```
~/HermesWork/x-posts/
└── 20260423-filename-prefix/
    ├── prefix_20260423_205443.png         # 配图
    ├── prefix_20260423_205443.prompt.txt  # 提示词存档
    ├── prefix_20260423_205443.share.md    # 分享帖文案
    └── prefix_20260423_205443.check.md    # 分辨率质量检查报告
```

## 依赖

- Python 3.9+
- Pillow
- requests

```bash
pip3 install pillow requests
```

## 相关链接

- [API Mart GPT-image-2 官方文档](https://docs.apimart.ai/cn/api-reference/images/gpt-image-2/official)
- [MrLarus GPT-image-2 教学帖](https://x.com/MrLarus/status/2046627021674168640)

---

*来自 Neuma Inc. 内部 Skills 库。基于 API Mart GPT-image-2 官方渠道。*
