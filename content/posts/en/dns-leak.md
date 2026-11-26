---
title: "What Is a DNS Leak? Why Sites May Still Know Where You Are"
description: DNS is the internet's phone book. If lookups skip the VPN tunnel, your provider can still see every site you visit. How leaks happen, a two-minute self-test, and the WebRTC and IPv6 leaks people miss.
date: 2026-11-21
section: guides
category: privacy
key: dns-leak
image: /images/dns-leak.jpg
faq:
  - q: Does a DNS leak reveal what I'm reading?
    a: Not the content, but it reveals which domains you looked up, which is effectively a list of the sites you visit.
  - q: If the test shows foreign DNS servers, am I safe?
    a: Check whether they belong to your VPN provider. If you see your local internet provider, or a server you never configured, some lookups are going outside the tunnel.
  - q: Will disabling IPv6 break anything?
    a: For most home users the impact is small, since almost all sites also support IPv4. A VPN that handles IPv6 properly is the better fix.
---

Your VPN is on and an IP checker says you're in Japan. Everything looks right. Meanwhile, your home internet provider's servers may be logging every address you look up.

That's a DNS leak. It doesn't stop anything from working, which is why most people never notice.

## What DNS is

Computers talk using IP addresses. People use names like `example.com`. DNS translates one into the other.

Every time you open a site, your device asks a DNS server for the address. It's quick enough that you never notice, but it leaves a record: this device looked up this domain at this time. By default your internet or mobile provider answers those questions, so even on HTTPS sites, your provider can see where you go.

## How leaks happen

A working VPN sends DNS lookups through the tunnel to its own resolvers. A leak means some lookups go around the tunnel instead. Common causes:

**The operating system races queries.** Windows can send DNS requests over several network interfaces and use whichever answers first, so a fast local resolver wins.

**Manual DNS settings.** If you changed DNS on your router or device, those settings may keep applying unless the VPN overrides them.

**Reconnect gaps.** In the seconds between a tunnel dropping and reconnecting, queries can go out the normal way. A "kill switch" exists to close that gap.

**Browser-level DNS.** Browsers with "secure DNS" (DNS over HTTPS) may contact their own chosen server directly.

## Test it in two minutes

With the VPN off, open a DNS leak test such as dnsleaktest.com or the DNS page on browserleaks.com and run the extended test. Note the servers listed, usually your provider's.

Turn the VPN on, refresh and test again. If you now see only your VPN provider's servers, or servers in the same region as your VPN location that you don't recognize and that aren't your local provider, you're fine. If your local provider still shows up, you have a leak.

:::tip
Close other apps that use the network and test two or three times. One odd result can be caching. Repeated results are worth acting on.
:::

## Two leaks people overlook

**WebRTC.** Browsers use WebRTC for calls and file transfers, and it can reveal your real IP while trying to connect devices directly. If the WebRTC section of the test shows your real IP, turn it off in Firefox's advanced settings or use a trusted extension in Chrome-based browsers.

**IPv6.** Many connections now have both IPv4 and IPv6 addresses. If the VPN only handles IPv4, traffic to IPv6 sites can go out directly. Good VPNs handle IPv6 or block it while connected.

## Fixing a leak

Start with the VPN app's own "DNS protection," "leak protection" or "kill switch" settings. Then remove any manual DNS settings on your device or router and test again. Turn off your browser's secure DNS while using the VPN, or set it to follow the system. Handle WebRTC and IPv6 as above. If it still leaks, contact the provider's support with screenshots of your test results.

## Why it's worth the two minutes

Stitched together, DNS lookups become a detailed diary of your online life. One entry is nothing; months of them are a lot. Checking that your VPN really protects them is a small effort. For the underlying mechanics, see [How Does a VPN Actually Work?](/en/guides/how-vpn-works/).
