---
title: "Rosenpass v0.2.2 Release"
linkTitle: "Rosenpass v0.2.2"
description: "A new version of Rosenpass to address a bug in the cookie mechanism"
author: "Benjamin Lipp & Alice Bowman"
date: 2024-10-01
blogpost: "true"
---

Recently, we released version 0.2.2 of the Rosenpass tool. This release addresses a bug in the handling of message retransmissions. The bug could be triggered when Rosenpass peers are under load and discard messages.

**For the standard use case** of Rosenpass with WireGuard, and thus, for the majority of users, **this has no security impact**. 

For specialised applications using the Output Shared Key (OSK) interface of Rosenpass, the bug could potentially have led to a nonce reuse, depending on how the higher-level protocol uses this shared key. We are currently not aware of applications using the OSK interface.

**Which protocol messages were affected?** Specifically, the responder's handling of a retransmitted InitConf message was flawed. On reception of such a message, the responder would treat it as if a new session had to be started, not noticing that this message had already been processed, and that a session had already been started based on it. This would lead to the same PSK, or OSK, being installed again. An external application could then potentially use that same shared key again with, potentially, depending on the protocol design, the same nonce. This could, depending on the encryption algorithm being used, lead to a leak of the data transmitted by this higher-level protocol. Again, we are not aware of anyone currently building higher-level protocols based on Rosenpass' OSK interface. If you do so, please feel free to contact us, we would love to get in touch!

**When would an InitConf message be retransmitted?** Rosenpass implements a mechanism that allows peers to discard messages that they receive while they are under load. A receiving peer signals this to the sending peer by responding with a cookie message instead of the usual protocol message that the sending peer would expect as a response. This mechanism is called *cookie mechanism*. We took it over from WireGuard.

For this bug to trigger, the initiator has to be under load when receiving the last protocol message from the responder, the `EmptyData` message. At this point, the responder has processed the `InitConf` message and has set its pre-shared key (PSK). Because it is under load, the initiator discards the `EmptyData` message. After some time, it retransmits the `InitConf` message because it has not yet received the `EmptyData` message. In versions of Rosenpass before 0.2.2, the responder would then process the `InitConf` message again, and set its PSK again, and export an OSK again.

**How was this issue addressed?** This bug was found and addressed by Preet. As of Rosenpass version 0.2.2, an `InitConf` message is only treated as starting a new session if it has not been seen before. This check is done via the biscuit number that was already part of the data transmitted in the `InitConf` message.

**Summary** The Rosenpass 0.2.2 update improves the protocol’s handling of retransmissions by ensuring that the session state only changes when genuinely necessary. We are pleased to have discovered and addressed this flaw, and continually work to improve our security.

{{< blocks/rss-button href="https://github.com/rosenpass/rosenpass/releases.atom" color="dark" text="Stay up to date with Rosenpass releases by subscribing to the GitHub Release Atom feed!" class="highlight" >}}
