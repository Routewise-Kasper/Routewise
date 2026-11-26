---
title: "Using ChatGPT, Claude or Gemini to Fix Network Problems: How to Ask"
description: Tell an AI assistant "my internet doesn't work" and you'll get a generic list. Give it symptoms, environment and what you've tried, and it can narrow things down like an experienced friend. Includes a copy-paste template.
date: 2026-11-25
section: tips
category: aitips
key: ai-troubleshoot-prompts
image: /images/ai-troubleshoot-prompts.jpg
faq:
  - q: Which assistant is best for network troubleshooting?
    a: ChatGPT, Claude, Gemini and DeepSeek handle common network issues similarly well. What matters most is how specific your information is. Versions with web search are better at "is this service down today?" questions.
  - q: Can I send screenshots of my router settings?
    a: Yes, but blur your public IP, MAC addresses, Wi‑Fi password and account names first.
  - q: Is it safe to run the commands it suggests?
    a: Ask it to explain each command first. Read-only commands like ping or ipconfig are low risk. Be careful with anything that changes system settings, disables the firewall or deletes files.
---

A common scenario: with the VPN on, a laptop's chat app works but the browser loads nothing. Ask an AI "my internet doesn't work, what do I do?" and you'll likely get a dozen suggestions ranging from "restart your router" to "reinstall your OS." That rarely helps.

The assistant isn't the problem. The question is.

## Why vague questions get vague answers

Call a friend who knows networking and say "my internet's broken." They'll immediately ask: which device? Is everything down or one site? Since when? What have you tried? An AI can't see your screen either, so without those details it lists every possibility.

## Four things a good question includes

**Specific symptoms.** "Doesn't work" covers spinning pages, "This site can't be reached," certificate errors, slow loading and missing images, and each points somewhere different. Paste any error message exactly.

**Your environment.** Device and OS version, home broadband or office network or hotspot, and whether a VPN or proxy is on and in which mode.

**A timeline.** Has it always been like this, or did it start today? Did you install something, change a setting or get a system update just before?

**What you've already tried, and what happened.** That stops the assistant from repeating steps and pushes it to the next layer.

## A template to copy

```
I have a network problem. Please troubleshoot step by step, giving me only one or two of the most likely checks at a time, and wait for my results before continuing.

Symptoms: [e.g. Chrome shows ERR_CONNECTION_TIMED_OUT on every site, but my chat app works]
Exact error: [if any]
Device and OS: [e.g. Windows 11 laptop]
Network: [e.g. home broadband over Wi-Fi; VPN on, smart mode]
Started: [e.g. this morning; fine last night]
Recent changes: [e.g. installed a download manager last night]
Already tried: [e.g. restarted laptop and router; browser works with the VPN off]
```

The first sentence matters most. Asking for one or two steps at a time turns a wall of text into a conversation.

## Differences between assistants

ChatGPT, Claude, Gemini, DeepSeek and Kimi all explain network concepts and error messages well enough. A few practical differences:

**Web access helps with outages.** "Is Outlook down today?" needs live information. An assistant with search can check status pages and news; one without can only guess. The recent [Microsoft 365 outage](/en/news/microsoft-365-outage-nov-2026/) is a good example.

**Image input helps with errors.** A screenshot of an error dialog is more precise than your description. Blur personal details first.

**Summarize long conversations.** After many rounds, ask "summarize what we've ruled out and what's left" so earlier conclusions don't get lost.

## Three cautions

Don't paste sensitive details: public IPs, Wi‑Fi or router passwords, VPN credentials, internal company addresses.

Understand commands before running them. Queries like `ping`, `ipconfig /all` or `nslookup` just read information. Anything touching the registry, firewall or system files deserves an explanation and an undo plan first.

Expect occasional mistakes. Assistants sometimes invent menu paths or setting names, especially for new OS versions. If a setting doesn't exist, say so and ask for another approach.

## Pair it with a checklist

AI is good at reasoning about your specific case; a fixed checklist is good at not skipping steps. Run through our [troubleshooting checklist](/en/guides/vpn-troubleshooting/) first, then give the results to the assistant using the template above.
