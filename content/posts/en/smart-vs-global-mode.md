---
title: "Smart Mode vs. Global Mode: Split Tunneling Explained"
description: Smart mode sends only the traffic that needs a VPN through it; global mode sends everything. When to use each, the trade-offs, and common myths.
date: 2026-11-24
section: guides
image: /images/smart-vs-global.jpg
category: basics
key: smart-vs-global-mode
faq:
  - q: Is global mode more secure?
    a: Not in terms of encryption. Traffic that goes through the VPN is protected the same way in both modes. The difference is only which traffic goes through it.
  - q: Why do some local apps complain when I use global mode?
    a: Banking, payment and streaming apps sometimes flag logins from an unexpected country. Smart mode avoids this by keeping local traffic on a direct connection.
---

Most VPN apps offer two modes, often called **smart** and **global**. The difference fits in one sentence:

> Smart mode routes only the traffic that needs the VPN; global mode routes all of it.

## How smart mode (split tunneling) works

Smart mode, also called split tunneling or rule mode, decides per connection:

- **Local** sites and apps, like your bank, maps or payment apps, connect **directly**
- **Everything else** goes through the **VPN**

The benefits are practical: local services stay at full speed and don't trigger "unusual location" checks, and the VPN only carries traffic that actually needs it.

## How global mode works

In global mode, **every** request from your device goes through the VPN, no matter where it's headed.

It's useful when:

- A particular site doesn't load correctly in smart mode
- You need every app to appear to be in another region
- You're troubleshooting and want to rule out routing rules

## Which one should you use?

| | Smart mode | Global mode |
| --- | --- | --- |
| Local site speed | Unchanged | May be slower |
| Foreign site access | Normal | Normal |
| Local app compatibility | Good | Some apps may flag logins |
| Best for | Everyday use | One-off issues, special needs |

**Our recommendation: use smart mode by default, switch to global mode temporarily when something doesn't load, then switch back.**

:::note
Apps name these differently, for example "rule / global", "split / full tunnel" or "auto / all traffic". The idea is the same.
:::

## Common myths

**"Global mode is safer."** Encryption is the same in both modes. Only the routing differs.

**"Smart mode makes foreign sites slower."** No. Foreign traffic uses the same VPN route in both modes.

**"I have to reconnect after switching."** Most apps apply the change instantly; a few need a quick reconnect.

If a site still won't load after switching modes, work through our [VPN troubleshooting checklist](/en/guides/vpn-troubleshooting/).
