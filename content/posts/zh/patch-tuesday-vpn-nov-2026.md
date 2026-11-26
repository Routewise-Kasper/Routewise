---
title: 微软 11 月补丁修复 3 个 VPN 相关漏洞，Windows 用户记得更新
description: 11 月的 Windows 安全更新修复了 SSTP 和 IKE 扩展中的三个漏洞，评级均为“重要”。普通用户装上更新即可，企业的 Always On VPN 部署需要多做几步检查。
date: 2026-11-12
section: news
category: security
key: patch-tuesday-vpn-nov-2026
image: /images/patch-tuesday-vpn.jpg
sources:
  - title: Richard Hicks — Always On VPN Security Updates November 2026
    url: https://directaccess.richardhicks.com/2026/11/10/always-on-vpn-security-updates-november-2026/
faq:
  - q: 我用的是第三方 VPN App，需要关心这个吗？
    a: 这三个漏洞位于 Windows 自带的 SSTP 和 IKE 组件。如果你的 VPN App 不使用这些系统组件，直接影响较小，但 Windows 安全更新本身仍然建议安装。
  - q: 这些漏洞已经被利用了吗？
    a: 报道中没有提到已知的利用、攻击活动或公开的利用代码。
---

微软在 11 月的例行安全更新（俗称“补丁星期二”）中，修复了三个与 Windows 内置 VPN 组件有关的漏洞。专注 Windows VPN 部署的技术博客作者 Richard Hicks 整理了这三个漏洞的情况，它们的严重程度评级都是“重要”。

## 修复了哪三个漏洞

| 编号 | 类型 | CVSS 评分 | 涉及组件 |
| --- | --- | --- | --- |
| CVE-2026-105561 | 拒绝服务 | 7.5 | SSTP |
| CVE-2026-105510 | 权限提升 | 7.0 | SSTP |
| CVE-2026-122169 | 欺骗 | 7.5 | IKE 扩展 |

SSTP（安全套接字隧道协议）和 IKE（互联网密钥交换）都是 Windows 自带的 VPN 技术。前者常用于企业 Always On VPN 的用户隧道连接，后者是 IKEv2 协议的一部分，用于设备隧道或使用 IKEv2 的用户隧道。

文章没有提到这些漏洞已经被利用，也没有提到公开的利用代码。

## 普通用户需要做什么

装上 11 月的 Windows 安全更新就可以。打开“设置 → Windows 更新”，点“检查更新”，按提示安装并重启。

如果你用的是第三方 VPN App，而它不调用 Windows 自带的 SSTP 或 IKEv2 组件，这几个漏洞对你的直接影响较小。不过系统安全更新通常同时修复了别的问题，没理由拖着不装。

## 企业管理员需要做什么

Hicks 的建议是在下一个计划维护窗口内部署 11 月更新。

针对 IKE 扩展的漏洞，他补充了一条额外措施：如果你的部署并没有用到 IKEv2，可以在边界防火墙上屏蔽入站的 UDP 500 和 UDP 4500 端口，并考虑在 RRAS 服务器上禁用 IKEv2。

## 顺带说一下这两个端口

UDP 500 和 4500 正是 IKEv2 固定使用的端口。这也解释了为什么在一些限制较多的网络里，IKEv2 往往第一个连不上：网络管理员只要屏蔽这两个端口就行了。不同 VPN 协议的特点和取舍，可以看 [VPN 协议怎么选](/guides/vpn-protocols/)。
