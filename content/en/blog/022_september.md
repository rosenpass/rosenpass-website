---
title: "Rosenpass v0.2.2 Release"
linkTitle: "Rosenpass v0.2.2"
description: "A new version of Rosenpass to address a bug in the cookie mechanism"
author: "Alice Bowman"
date: 2024-09-19
blogpost: "true"
draft: "true"
---

Recently, we released version 0.2.2 of the Rosenpass tool. This release addresses a bug in the handling of message retransmissions in Rosenpass's cookie mechanism when under load. This posed only a low security risk: No information could be leaked, but the bug could interfere with the expected key exchange flow as the Pre-Shared Key (PSK) can be updated unnecessarily.

We use biscuits to store session state on a packet. In the protocol, a `InitConf` message includes these biscuits to validate whether a response is fresh or simply a retransmission. Prior to the fix, this message state was not properly communicated to the caller, who would thus believe that a new PSK event was triggered every time a `InitConf` message was received.

We addressed this issue thanks to the work of Preet, who introduced a check that would only set "exchanged" to true if the biscuit was valid and if the PSK generation was performed. This communicates to the Caller whether or not they should trigger a new session. We considered treating all new transmissions as new sessions, though this could lead to nonce misuse whereby the same number is used twice. Although this approach would not represent an actual security issue due Rosenpass' defensive design, and would only apply to non-WireGuard use cases, we discarded this approach in favour of introducing a check on the PSK generation.

The Rosenpass 0.2.2 update improves the protocol's handling of retransmissions by ensuring that the session state only changes when genuinely necessary. We are pleased to have discovered and addressed this flaw, and continually work to improve our security.

{{< blocks/rss-button href="https://github.com/rosenpass/rosenpass/releases.atom" color="dark" text="Stay up to date with Rosenpass releases by subscribing to the GitHub Release Atom feed!" class="highlight" >}}
