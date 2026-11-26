---
title: "Signal and Apple Tighten Controls as AI Agents Start Reading Screens"
description: Signal now blocks screenshots by default to keep OS-level AI agents out of private chats, and Apple is splitting up Mac data permissions in macOS 27.3. What changed and what you can do.
date: 2026-11-24
section: news
category: ai
key: ai-agents-screen-privacy
image: /images/ai-agents-privacy.jpg
sources:
  - title: The Hacker News — Data privacy coverage (Signal, Nov 21; Apple, Nov 17)
    url: https://thehackernews.com/search/label/data%20privacy
faq:
  - q: What is an AI agent?
    a: An AI program that can act on your device for you, reading the screen, tapping buttons, opening apps. To do that, agents often need very broad system permissions.
  - q: Should I turn off AI features entirely?
    a: Not necessarily. Review which apps hold accessibility, screen recording or full disk access, and grant those only where you really need them.
---

Within a week of each other, two privacy-focused companies moved against the same new problem: **AI agents built into operating systems can see everything on your screen.**

## Signal blocks screenshots by default

Per The Hacker News on November 21, Signal will **restrict screenshots by default** on Android and iOS to keep AI agents from reading private chats.

- On iOS, the protection targets agentic systems built into iOS 27
- On Android, it applies on versions where Signal can detect an AI assistant trying to read the screen
- Signal itself calls the protection "incomplete"

It extends a similar setting Signal added on Windows 11 in response to Microsoft's Recall feature. Signal Foundation president Meredith Whittaker said OS-level agents "scan" what's on screen to get information, which is why Signal is acting.

## Apple splits up Mac data permissions

On November 17, Apple previewed new controls in macOS 27.3 beta 2 that give Mac users finer control over which apps, including those using AI agents, can access their data.

| Area | Change |
| --- | --- |
| Device Control and Data Access | Split into System & App Protection Override and Accessibility |
| Full Disk Access | Grant by picking specific apps from a list |

Apple warned that granting this kind of access "puts all of the data on their Mac at risk."

## Why this matters

Privacy conversations usually focus on data in transit. AI agents introduce a different risk: **your data is read on your own device**, before it goes anywhere. Encrypted messaging and VPNs protect the journey; they can't help if a privileged program is reading your screen.

## Three things you can do

1. **Audit high-privilege apps** in your phone and computer privacy settings
2. **Grant access only when needed**, and revoke it when you're done
3. **Use apps with screen protection** for sensitive conversations

For more privacy basics, see [How to Choose a VPN](/en/guides/how-to-choose-vpn/).
