---
title: "How Does a VPN Actually Work? Start With One Web Page"
description: What happens when you open a web page without a VPN, what a VPN adds and changes along the way, and what it can't do. Once you see the route, slowdowns and failed connections make sense.
date: 2026-11-18
section: guides
category: basics
key: how-vpn-works
image: /images/how-vpn-works.jpg
affiliate: true
faq:
  - q: Can websites still tell who I am with a VPN on?
    a: They see the VPN server's IP instead of yours, but if you're logged in or have cookies stored, the site still knows it's you. A VPN changes your network identity, not your account identity.
  - q: Can the VPN provider see what I do?
    a: It can see which domains you connect to, when, and how much data you use. It can't read the contents of HTTPS pages. That's why a provider's privacy policy and audits matter.
  - q: Why does a VPN slow my connection?
    a: Your traffic takes a longer route through the VPN server, encryption adds a little overhead, and busy servers share bandwidth among many users at peak times.
---

Plenty of people use a VPN for years thinking of it as an on/off switch. That works until something breaks: the connection won't come up, video calls stutter, or your bank app suddenly asks you to verify yourself again. Then it helps to know what the switch actually does.

You don't need a technical background for this. We'll start with typing a web address.

## Opening a page without a VPN

Say you type `example.com` and press Enter. Roughly four things happen.

**Your device looks up the address.** Computers don't know names, only IP addresses like `93.184.215.14`. So the browser asks a DNS server which IP belongs to that name. By default that's usually a server run by your internet provider. Think of it as checking a phone book before you call.

**It opens a connection.** With the IP in hand, your device and the website's server agree to talk. For `https://` sites they also agree on encryption, so only the two of them can read what follows.

**Data travels in small packets.** Pages and images are cut into many small pieces. Each one is labeled with where it came from and where it's going: your IP and the site's IP. Those packets pass through your router, your provider's network and several other networks along the way.

**Everyone along the route can read the labels.** HTTPS hides what's inside each packet, but not the addresses on the outside. Your provider can see which servers you visit and when. The website sees your real IP and can roughly tell your city and provider.

Keep that picture in mind: **the letter is sealed, but the envelope's address is visible to anyone who handles it.**

## What a VPN adds

With a VPN on, your device first opens an encrypted connection to a VPN server, usually called a tunnel. After that, every packet you send gets placed inside a new, sealed envelope addressed only to the VPN server.

Your provider now sees a steady stream of traffic between you and one VPN server. It can't see which websites are inside.

The VPN server opens the outer envelope and sends your original request on to the website. The website replies to the VPN server, which seals the response and sends it back through the tunnel.

Two things change as a result. People on the path between you and the VPN server, like your provider or others on the same Wi‑Fi, can no longer see where you're going. And websites see the VPN server's location instead of yours, which is how people access content from another region.

One detail matters a lot: DNS lookups should go through the tunnel too. If your device keeps asking your provider's DNS server for addresses, your browsing list still leaks even though the traffic itself is encrypted. We cover that in [What Is a DNS Leak?](/en/guides/dns-leak/).

## What a VPN can't do

**It can't hide accounts you're logged into.** Sign in to a site and it knows it's you, whatever IP you use. Cookies and ad trackers work the same way.

**It doesn't hide you from the VPN provider.** The provider opens the outer envelope, so technically it can see which domains you visit and when. It still can't read HTTPS content, but that metadata is sensitive, which is why privacy policies and independent audits are worth checking.

**It can't protect data that's taken before encryption.** Malware, over-privileged browser extensions and apps that read your screen get your data before the tunnel ever sees it. See [the free VPN extension case](/en/news/free-vpn-extension-ai-prompts/) for a recent example.

**It can't fix a service that's down.** If the website's own servers fail, no route will reach them.

## Why it gets slow, and why it won't connect

**Slowness usually comes from distance.** Your data now goes to the VPN server first. If that server is far from you or from the website, each round trip takes longer. Streaming mostly needs bandwidth and tolerates some delay; calls and games need low latency and suffer first.

**Evening slowdowns are about load.** One server serves many people. Switching to a less busy server often helps more than reconnecting over and over.

**Encryption overhead is usually small.** Modern phones and laptops have hardware support for it. Old routers are the main exception.

**Failed connections tend to have three causes:** the route between you and the VPN server is blocked or unstable, the protocol is being interfered with (protocols look different on the network, see [VPN Protocols Explained](/en/guides/vpn-protocols/)), or something on your device is wrong, such as an incorrect clock or a second VPN competing for control. Our [troubleshooting checklist](/en/guides/vpn-troubleshooting/) walks through these in order.

## And smart mode?

A VPN doesn't have to carry everything. The app can set a routing table on your device that says which destinations go through the tunnel and which go direct. The usual rule is by IP location: local destinations go direct, everything else goes through the VPN. That keeps local apps fast and avoids surprise security checks. More in [Smart Mode vs. Global Mode](/en/guides/smart-vs-global-mode/).

## The whole picture

| | Without a VPN | With a VPN |
| --- | --- | --- |
| Your provider sees | The sites and domains you visit | A connection to one VPN server |
| Websites see | Your real IP | The VPN server's IP |
| HTTPS content | Encrypted | Encrypted, plus the tunnel |
| VPN provider sees | Nothing | Domains, times, data volume |
| Logged-in accounts | Know it's you | Still know it's you |

## Choosing with this in mind

Once you know the route, choosing gets easier. Where the servers are decides speed. What the provider logs decides privacy. Protocols and resistance to interference decide stability. Our [6-point checklist](/en/guides/how-to-choose-vpn/) turns that into concrete tests.

The VPN we use day to day is [Hi快VPN (HiFast)](/go/hifast). It defaults to smart mode, picks servers by latency and bandwidth, and covers roughly 18 countries and regions. Check the official site for current pricing.
