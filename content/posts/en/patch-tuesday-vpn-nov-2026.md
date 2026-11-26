---
title: "Microsoft's November Patches Fix 3 VPN-Related Windows Flaws"
description: November's Windows security updates fix two SSTP vulnerabilities and one in the IKE extension, all rated Important. Home users just need to update; Always On VPN admins have a couple of extra steps.
date: 2026-11-12
section: news
category: security
key: patch-tuesday-vpn-nov-2026
image: /images/patch-tuesday-vpn.jpg
sources:
  - title: Richard Hicks — Always On VPN Security Updates November 2026
    url: https://directaccess.richardhicks.com/2026/11/10/always-on-vpn-security-updates-november-2026/
faq:
  - q: I use a third-party VPN app. Does this affect me?
    a: The flaws are in Windows' built-in SSTP and IKE components. If your app doesn't use them, the direct impact is limited, but you should still install Windows security updates.
  - q: Are these being exploited?
    a: The write-up doesn't mention known exploitation, active attacks or public exploit code.
---

Microsoft's November security updates include fixes for three vulnerabilities in Windows' built-in VPN components. Richard Hicks, who writes about Windows VPN deployments, summarized them; all three are rated Important.

## The three fixes

| CVE | Type | CVSS | Component |
| --- | --- | --- | --- |
| CVE-2026-105561 | Denial of service | 7.5 | SSTP |
| CVE-2026-105510 | Elevation of privilege | 7.0 | SSTP |
| CVE-2026-122169 | Spoofing | 7.5 | IKE extension |

SSTP and IKE are both part of Windows' own VPN stack. SSTP is commonly used for Always On VPN user tunnels; IKE is part of IKEv2, used for device tunnels or IKEv2 user tunnels. The write-up doesn't mention any known exploitation or public exploit code.

## What home users should do

Install the November update: Settings, Windows Update, Check for updates, then restart. If your VPN app doesn't rely on Windows' SSTP or IKEv2 components, the direct impact is smaller, but security updates fix other things too.

## What admins should do

Hicks recommends deploying the updates in your next scheduled maintenance window. For the IKE flaw, if you don't use IKEv2, he suggests blocking inbound UDP 500 and UDP 4500 at the edge firewall and considering disabling IKEv2 on the RRAS server.

## About those ports

UDP 500 and 4500 are IKEv2's fixed ports, which is also why IKEv2 is often the first protocol to fail on restrictive networks. For the trade-offs between protocols, see [VPN Protocols Explained](/en/guides/vpn-protocols/).
