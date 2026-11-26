---
title: "Microsoft 365 Outage Explained: How a Capacity Upgrade Took Outlook Down"
description: Outlook and other Microsoft 365 services went down worldwide from Nov 12 into Nov 13, 2026. What broke, what Microsoft said caused it, and how to tell a service outage from your own connection problem.
date: 2026-11-25
section: news
category: internet
key: microsoft-365-outage-nov-2026
image: /images/microsoft-365-outage.jpg
sources:
  - title: Macworld — Microsoft 365 outage coverage
    url: https://www.macworld.com/article/3284152/yes-the-whole-internet-is-having-major-issues-right-now.html
faq:
  - q: Does a VPN help during a service outage?
    a: No. If the service's own servers are failing, as with this Microsoft 365 incident, a VPN can't reach a server that isn't working. A VPN only helps with problems on the route between you and the site.
  - q: How do I tell an outage from my own connection problem?
    a: Open a few unrelated websites. If they load, your connection is fine. Then check the service's official status page or social accounts.
---

On Thursday, November 12, Outlook users around the world found their inboxes frozen and calendars failing to load. The problems ran overnight, and Microsoft only confirmed the issue was resolved late on November 13, while continuing to monitor recovery.

## What was affected

The incident centered on **Exchange Online**, the email backbone of Microsoft 365, so anything built on top of it suffered:

- **Outlook email**, reported worldwide
- **Email- and calendar-dependent Teams features**, though Microsoft said core Teams calling, meetings and messaging were mostly unaffected
- **Public services**, including email at some UK NHS trusts, and schools reporting communication problems
- **AI assistant connectors**, with both OpenAI and Anthropic reporting disruption to tools linking their assistants to Microsoft 365

Outage trackers also logged complaints about other platforms, but reporting noted these didn't establish that those services were down or shared the same cause. Apple's status page showed no iMessage outage, and Amazon said AWS ran normally all day.

## The cause

Microsoft gave two explanations over the course of the incident:

1. **Early on:** a server process became overwhelmed, reducing capacity, and some servers became unresponsive again as traffic returned.
2. **Later:** the problem was introduced during an **earlier network capacity upgrade** and only surfaced after a more recent network change.

Microsoft said the incident was not related to a cyberattack or to AI agents.

:::note
A single change cascading into a global outage is a familiar pattern in large cloud platforms. Services depend on each other, so one failure can travel a long way down the chain.
:::

## What you can do when a service goes down

1. **Rule out your own connection.** If other sites load, your network is fine.
2. **Check the official status page.** Most major services publish one.
3. **Don't start reinstalling or changing settings.** None of that helps with a server-side failure.
4. **Keep a backup channel** for important communication, like a messaging app or phone.

## Where a VPN fits in

| Situation | What you see | Can a VPN help? |
| --- | --- | --- |
| Route problem | Only you or your region can't connect | Possibly |
| Service outage | Users everywhere can't connect | No |

This was the second kind. For a structured way to diagnose connection problems, see our [VPN troubleshooting checklist](/en/guides/vpn-troubleshooting/).
