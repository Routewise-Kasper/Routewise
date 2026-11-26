---
title: "VPN Connected but Not Working? A 6-Step Troubleshooting Checklist"
description: Fix a VPN that won't connect, shows connected with no internet, or runs slowly. Six steps in order, from the quickest checks to contacting support.
date: 2026-11-23
category: troubleshooting
key: vpn-troubleshooting
affiliate: true
faq:
  - q: Why is my VPN slow only in the evening?
    a: Evenings are peak hours, so international links and servers are busier. Try a server with lower latency, or a different region.
  - q: My VPN disconnects when I switch from Wi-Fi to mobile data. Is that normal?
    a: Yes. Changing networks interrupts the connection. Most apps reconnect automatically; if yours doesn't, disconnect and connect again.
---

When a VPN misbehaves, it's tempting to tap "connect" over and over. Working through the causes **in order, from most common to least**, is much faster.

## Step 1: Check your own connection

**Disconnect the VPN** and open any website.

- Doesn't load? The problem is your Wi-Fi, router or mobile signal, not the VPN
- Loads fine? Your connection is OK. Move on

## Step 2: Restart the app and switch servers

1. Fully quit the app (not just send it to the background)
2. Reopen it and connect
3. Still stuck? Pick a different server with **lower latency**

:::tip
The geographically nearest server isn't always the fastest. Choose by latency and availability indicators in the app.
:::

## Step 3: Check the routing mode

If one site won't load in smart (split) mode, try global mode. If local apps slow down in global mode, switch back to smart mode. Here's [how the two modes differ](/en/guides/smart-vs-global-mode/).

## Step 4: Remove conflicts on your device

- **More than one VPN installed**: keep only one running
- **VPN permission**: on iPhone, check Settings → General → VPN & Device Management; on Android, accept the connection request the first time
- **Proxies and accelerators**: browser proxy extensions or game boosters can take over the connection

## Step 5: Update the app and your OS

Older versions may not support newer servers or protocols. Updating fixes a surprising number of "won't connect" cases.

## Step 6: Contact support with the right details

Include these and you'll get a faster fix:

- Device model and OS version
- App version
- Network type (Wi-Fi or mobile, and carrier)
- When it started and which servers you tried

## Quick reference

| Symptom | Likely cause | Try first |
| --- | --- | --- |
| Won't connect at all | Local network or app state | Steps 1–2 |
| Connected, no pages load | Server or routing mode | Switch server, change mode |
| Slow in the evening | Peak-hour load | Lower-latency server |
| Local apps slow | Global mode on | Switch to smart mode |
| Frequent drops | Network changes or app conflicts | Step 4 |

---

The VPN we use, [Hi快VPN (HiFast)](/go/hifast), defaults to smart mode, marks available servers with a green dot, and has live support inside the app, which makes most of these steps quick.
