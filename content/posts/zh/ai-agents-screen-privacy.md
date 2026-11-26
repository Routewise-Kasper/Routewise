---
title: Signal 和苹果同一周收紧权限：AI 代理正在改写隐私规则
description: Signal 默认阻止截屏以防系统级 AI 代理读取聊天，苹果在 macOS 27.3 测试版中细化数据访问权限。两件事背后，是“AI 读屏”带来的新隐私问题。
date: 2026-11-24
section: news
category: ai
key: ai-agents-screen-privacy
image: /images/ai-agents-privacy.jpg
sources:
  - title: The Hacker News — Signal blocks AI agents from reading private chats via screenshots
    url: https://thehackernews.com/search/label/data%20privacy
  - title: The Hacker News — Apple tightens macOS app permissions amid AI agent security risks
    url: https://thehackernews.com/search/label/data%20privacy
faq:
  - q: 什么是 AI 代理？
    a: AI 代理是能代替你在设备上执行操作的 AI 程序，比如读取屏幕内容、点击按钮、打开应用。为了完成任务，它们往往需要很高的系统权限。
  - q: 我需要关掉手机上的 AI 功能吗？
    a: 不必一刀切。建议检查哪些应用拥有辅助功能、屏幕录制等高权限，只给真正需要的应用开放。
---

11 月中下旬，两家以隐私著称的公司接连出手，目标都指向同一个新问题：**操作系统里的 AI 代理，正在“看”你屏幕上的一切。**

## Signal：默认阻止截屏

据 The Hacker News 11 月 21 日报道，Signal 将在 Android 和 iOS 上**默认限制截屏**，以防止 AI 代理读取私密聊天。

- iOS 上，这项保护针对 iOS 27 内置的代理系统
- Android 上，适用于 Signal 能检测到 AI 助手试图读取屏幕的系统版本
- Signal 自己也承认，这项保护“并不完整”

这并不是 Signal 第一次这样做。此前在 Windows 11 上，Signal 已经因微软的 Recall 功能推出过类似设置，这次是把同样的思路扩展到手机上。Signal 基金会主席 Meredith Whittaker 解释说，系统级 AI 代理是通过“扫描”屏幕内容来获取信息的，这正是 Signal 采取行动的原因。

## 苹果：细化 Mac 的数据访问权限

几天前的 11 月 17 日，苹果在 macOS 27.3 beta 2 中预览了新的权限控制，让用户能更细致地管理应用（包括使用 AI 代理的应用）能访问哪些数据。变化主要集中在两处：

| 区域 | 变化 |
| --- | --- |
| 设备控制与数据访问 | 拆分为“系统与应用保护覆盖”和“辅助功能”两项 |
| 完全磁盘访问 | 改为从列表中选择具体应用授权，鼓励只给特定应用开放 |

苹果在说明中直言，授予这类权限会让“Mac 上的所有数据都面临风险”。

## 为什么这件事值得关注

过去我们谈隐私，关注的多是“数据在网络上传输时会不会被看到”。而 AI 代理带来的是另一种风险：**数据在你自己的设备上，就已经被读取了。**

加密聊天、VPN 这类工具，保护的都是传输过程。如果一个拥有读屏权限的程序直接“看”你的屏幕，传输加密就帮不上忙。

## 你可以做的三件事

1. **检查高权限应用**：在手机和电脑的隐私设置里，查看哪些应用拥有辅助功能、屏幕录制、完全磁盘访问权限
2. **按需授权**：只给确实需要的应用开放，用完可以随时关闭
3. **敏感对话用有防护的应用**：比如开启了截屏保护的加密聊天工具

想了解更多隐私基础知识，可以看：[免费 VPN 能用吗？免费、试用和付费的真实区别](/guides/free-vs-paid-vpn/)。
