---
title: 免费 VPN 插件被指收集 AI 聊天记录：你需要知道的 5 件事
description: 美国律所正在调查三款 Urban VPN 相关浏览器插件是否在未经同意的情况下收集用户的 AI 对话，涉及用户可能超过 800 万。事件经过、目前进展，以及该怎么保护自己。
date: 2026-11-26
section: news
category: security
key: free-vpn-extension-ai-prompts
image: /images/vpn-extension-ai-prompts.jpg
sources:
  - title: TechRadar — Urban VPN under legal scrutiny over claims it harvested users' private AI prompts
    url: https://www.techradar.com/vpn/vpn-services/urban-vpn-under-legal-scrutiny-over-claims-it-harvested-users-private-ai-prompts
faq:
  - q: 用了 VPN，AI 服务商就看不到我输入的内容了吗？
    a: 不是。VPN 加密的是你到 VPN 服务器之间的流量，你在 AI 聊天框里输入的内容，AI 服务商本身仍然能看到。
  - q: 卸载插件后，之前被收集的数据能删除吗？
    a: 卸载可以阻止之后的收集，但无法收回已经被收集的内容。
---

据 TechRadar 11 月 25 日报道，美国一家律所正在调查 Urban VPN 旗下的三款浏览器插件，是否在用户不知情的情况下收集并共享了他们与 AI 聊天机器人的对话。下面是目前已知的关键信息。

:::warn
目前这些仍是**指控**，没有法院作出裁决，也没有达成和解。律所仍处于收集和审核用户材料的阶段。
:::

## 涉及哪些插件

报道点名了三款 Chrome 和 Edge 浏览器插件：

- Urban VPN Proxy
- 1ClickVPN Proxy
- Urban Browser Guard

可能受影响的用户超过 **800 万**。

## 被指控做了什么

根据报道，2025 年 7 月 9 日，Urban VPN Proxy 通过浏览器自动更新推送了 5.5.0 版本，被指新增了抓取 AI 对话的代码。被指收集的数据会发送到与 Urban VPN 相关的分析域名，并可能流向数据经纪公司 BiScience。

最值得注意的一点是：据称**即使关闭了 VPN，或者关闭了插件里的“AI 保护”开关，收集仍在继续**。

涉及的 AI 平台包括 ChatGPT、Claude、Gemini、Microsoft Copilot、Perplexity、DeepSeek、Grok 和 Meta AI。

## 事情是怎么被发现的

2025 年 12 月，网络安全公司 Koi Security 公布了相关发现。律所据此划定了 2025 年 7 月 9 日至 12 月 15 日这个时间窗口：在此期间安装过上述插件、并在同一浏览器里使用过 AI 聊天工具的加州用户，可能符合申请条件。

## 这件事说明了什么

插件拥有很高的浏览器权限，可以读取你访问的网页内容。**一款以“隐私保护”为卖点的免费插件，本身就可能成为隐私泄露的入口**。这也是我们在 [免费 VPN 能用吗](/guides/free-vs-paid-vpn/) 一文里反复强调的：免费服务的成本，最终总要有人来付。

另一个常见误解是“开了 VPN，AI 就看不到我说什么”。实际上，VPN 只加密你到 VPN 服务器这一段的流量，你在聊天框里输入的内容，AI 服务商依然能看到。

## 现在该做什么

1. **检查浏览器插件**：打开浏览器的扩展程序页面，删除不认识或不再使用的插件
2. **留意权限**：安装插件前看清它要求的权限，“读取和更改所有网站上的数据”属于最高级别
3. **谨慎对待免费的隐私工具**：优先选择有公开隐私政策、经过独立审计的服务
4. **不在 AI 对话里输入敏感信息**：密码、证件号、银行信息等，无论用什么工具都不建议输入

我们会持续关注这件事的后续进展。
