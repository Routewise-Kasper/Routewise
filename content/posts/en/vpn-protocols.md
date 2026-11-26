---
title: "VPN Protocols Explained: WireGuard vs. OpenVPN vs. IKEv2"
description: A protocol decides how a VPN builds its tunnel, encrypts data and looks on the network. What protocols are, how the three common ones compare on speed and stability, and when obfuscation helps.
date: 2026-11-19
section: guides
category: basics
key: vpn-protocols
image: /images/vpn-protocols.jpg
faq:
  - q: Do I need to pick a protocol myself?
    a: Usually not. Most apps choose automatically based on your network. It's worth switching manually only when a connection keeps dropping or won't connect on a particular network.
  - q: Which protocol is the most secure?
    a: All three mainstream protocols are considered secure when configured properly. The practical differences are speed, stability and how well they get through restrictive networks.
  - q: Why does a protocol work at the office but not at home?
    a: Networks restrict ports and connection types differently. Some block UDP, others block specific ports. Switching to a TCP-based option or turning on obfuscation often fixes it.
---

Open the settings in many VPN apps and you'll find a "protocol" option listing names like WireGuard, OpenVPN and IKEv2. Most people never touch it, and that's fine. Knowing what they are gives you one more lever when a connection misbehaves.

## What a protocol is

A VPN builds an encrypted tunnel between your device and a server (see [How Does a VPN Actually Work?](/en/guides/how-vpn-works/)). The protocol is the construction standard for that tunnel. It defines how both sides verify each other and agree on keys, how data is encrypted and packaged, and what kind of channel it travels through.

That last part, TCP or UDP and which port, decides what the traffic looks like on the network and whether restrictive networks let it through.

TCP is like registered mail: every packet is confirmed, and lost ones are resent. It's reliable but chatty. UDP is like a postcard: fast, with no confirmation. Calls and games prefer UDP because a dropped frame is better than waiting. VPN protocols make the same trade-off.

## WireGuard: new, fast, small

WireGuard is the protocol that's drawn the most attention in recent years. Its design keeps only what's necessary, and its core is a few thousand lines of code, far less than older protocols. Less code means fewer places for bugs to hide and an easier audit.

It uses a fixed set of modern cryptography instead of letting you choose, which removes a whole class of misconfiguration.

It connects quickly, keeps latency low and recovers fast when your phone switches networks. The downsides: it only uses UDP, so networks that block UDP stop it cold, and its traffic is fairly easy to identify where networks are closely monitored.

## OpenVPN: established and flexible

OpenVPN has been around for more than twenty years and is still a standard option for many services. It's built on TLS, the same foundation as HTTPS websites.

Its strength is flexibility. It runs over UDP or TCP on configurable ports. Set to TCP port 443, it looks a lot like ordinary HTTPS traffic, which helps on office, school and hotel networks.

The cost is speed. It's more complex than WireGuard and slower to connect. Over TCP on a lossy network you can get "TCP over TCP," where both layers retransmit and delays pile up, so UDP mode is usually the better default.

## IKEv2/IPsec: built for mobile

IKEv2 is usually paired with IPsec and is built into iOS, macOS and Windows, so it can work without an extra app.

It shines when you change networks. Thanks to a feature called MOBIKE, a phone moving from Wi‑Fi to cellular can keep its connection instead of rebuilding it.

Its weakness is fixed ports, UDP 500 and 4500, which are easy for network admins to block. Windows' IKE extension also received a security fix this month; see [Microsoft's November patches](/en/news/patch-tuesday-vpn-nov-2026/).

## Side by side

| | WireGuard | OpenVPN | IKEv2/IPsec |
| --- | --- | --- | --- |
| Connection setup | Fast | Slower | Fast |
| Everyday speed | High | Medium | Medium-high |
| Network switching | Recovers quickly | Average | Very stable |
| Transport | UDP only | UDP or TCP | UDP, fixed ports |
| Restrictive networks | Often blocked | Often gets through | Often blocked |
| Built into the OS | Some systems | Needs an app | iOS, macOS, Windows |

## Why obfuscation exists

Encryption hides content, not the fact that you're using a VPN. Monitoring equipment can often recognize VPN traffic from packet sizes, timing and handshakes.

Obfuscation wraps the protocol in another layer so the traffic resembles ordinary web browsing. Apps call it things like "stealth mode." It costs a bit of speed, so it's mainly useful when normal protocols won't connect.

## How to choose

If your app has an "automatic" option, use it most of the time. When you need to step in: try WireGuard for speed and low latency, IKEv2 if you're constantly switching networks on the go, and OpenVPN over TCP or an obfuscated mode on restrictive networks. If none of that helps, stop fiddling with protocols, switch servers, and work through the [troubleshooting checklist](/en/guides/vpn-troubleshooting/).
