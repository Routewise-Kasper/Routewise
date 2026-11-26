# Routewise 运营手册（给自动任务的 Claude 看）

Routewise 是一个中英双语的网络使用指南站，静态生成，推送到 GitHub `main` 后由 Cloudflare Pages 自动构建上线。
品牌对外统一为 **Routewise / Routewise Team**。站内对 Hi快VPN 的推荐一律通过 `/go/hifast` 短链，并在文章 front matter 设 `affiliate: true`（页面顶部会自动显示合作披露）。

## 目录

- `content/posts/zh/*.md`：简体中文文章，网址 `/guides/<slug>/`
- `content/posts/en/*.md`：英文文章，网址 `/en/guides/<slug>/`
- `content/pages/{zh,en}/`：关于、合作披露等固定页（不要改动，除非被要求）
- `seo/facts.md`：产品事实库，写到 Hi快 时**只能**用这里的信息
- `seo/backlog.md`：选题池；`seo/log.md`：发布记录与周报
- `site.config.mjs`：域名、短链；`build.mjs`：构建脚本；`src/style.css`：样式
- `.claude/skills/`：SEO 技能（来自 claude-seo，MIT），写作和自检时按需调用

## Front matter 规范

```yaml
---
title: 标题（中文 ≤ 30 字；英文 ≤ 65 字符，含冒号的英文标题要加引号）
description: 摘要（中文 60–90 字；英文 140–160 字符）
date: YYYY-MM-DD
updated: YYYY-MM-DD   # 只在修订旧文时加
category: basics | howto | troubleshooting | privacy | travel
key: 与另一语言版本共用的标识（同一主题中英文用相同 key，自动生成 hreflang）
affiliate: true       # 文中出现 /go/ 链接时必须为 true
faq:                  # 2–4 条，生成 FAQ 结构化数据
  - q: 问题
    a: 回答
---
```

正文可用 Markdown 表格，提示框写法：`:::tip` / `:::note` / `:::warn` 单独一行开头，`:::` 单独一行结束。

## 每周例行任务（定时任务执行）

1. 读 `seo/log.md` 和 `seo/backlog.md`，列出 `content/posts` 已有文章，避免重复选题、避免两篇抢同一关键词。
2. 选题：用 WebSearch 调研真实搜索需求（搜索联想词、"People also ask"、问答社区的高频问题、竞品指南页的覆盖空白）。优先长尾、问题型、教程/排错型关键词。把新发现的选题补进 `backlog.md`。
3. 写作：本周发布 **中文 2 篇 + 英文 2 篇**（其中至少 1 组中英同主题，用相同 key）。每篇中文 1500–2500 字，英文 900–1600 词。
4. 自检（全部通过才能发布，见下方清单）。不通过就修改，改不好就不发这篇，在周报里写明原因。
5. 运行 `npm install && node build.mjs`，必须无报错。
6. 提交并推送到 `main`：提交信息 `content: <本周文章 slug 列表>`。
7. 在 `seo/log.md` 顶部追加本周记录：发布的文章、各自目标关键词、选题依据、跳过的内容及原因。
8. 每月第一周额外做一次全站体检：用 `.claude/skills/seo-technical`、`seo-hreflang`、`seo-schema` 的检查项过一遍构建产物，找出 3 篇需要更新的旧文并修订（加 `updated` 日期）。

## 发布前自检清单

- [ ] 事实：涉及 Hi快 的每一条信息都能在 `seo/facts.md` 找到；价格一律加"以官网为准"
- [ ] 不使用绝对化说法：最快、最好、第一、唯一、100%、永不、绝对、保证 等（英文 fastest/best/#1/guaranteed/never/100% 同理）
- [ ] 不点名贬低任何其他 VPN 或服务；对比只做中性事实描述
- [ ] 不写"独立评测""中立第三方"之类的自我定位；含 `/go/` 链接时 `affiliate: true`
- [ ] 推荐只出现在文末或自然相关的位置，正文主体对所有读者都有用
- [ ] 不教授违法用途；涉及法律的内容用审慎措辞并建议读者核实当地法规
- [ ] 标题含核心关键词；description 写清读者能得到什么；至少 2 个 `##` 小节
- [ ] 至少 1 条站内链接指向相关旧文（中文用 `/guides/<slug>/`，英文用 `/en/guides/<slug>/`）
- [ ] 内容原创、有具体步骤或判断标准，不是空泛的概述；去掉明显的 AI 套话
- [ ] 中文正文使用中文引号 “ ”，不用英文直引号

## 不要做的事

- 不修改 `pages/`、`build.mjs`、`src/style.css`、`site.config.mjs`，除非用户明确要求
- 不删除已发布文章，不改已发布文章的 slug（会产生死链）
- 一周发布总数不超过 6 篇
