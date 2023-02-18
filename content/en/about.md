---
title: "How it works"
linkTitle: "How it works"
weight: 20
menu:
  main:
    weight: 20
type: community
---


{{< blocks/lead  >}}

So what exactly does **Rosenpass** do again?
 
{{< /blocks/lead >}}

<div class="about">

{{< blocks/section color="white" >}}


Today, Virtual Private Networks (VPNs) are a cornerstone of the modern internet. Whenever you connect to your workplace from your "home office", you would most probably, consciously or not, use a VPN software to ensure that all data flowing from your computer at home to your employer's office are safe from being tangled with.

There are many more common, daily usecases, from online research to circumventing location-based (and -regulated) online services.

For people in countries that do "regulate" their citizens' internet usage in a more aggressive way, VPNs have become a ubiquous source of online "mobility" through different regulatory environments, enabling access to uncensored information and communication. Some evil governments even make using them a criminal offence.

As VPNs became a common internet standard, certain "protocols", ways to do it in technical terms, also became standards. Today's most important VPN standard is the free and open source software WireGuard(c).

In recent years, "Quantum Computers" became visible at the horizon of the future; computers so powerful they could break any standard cryptography that today ensures the safety of our online banking or simply the authenticity of a website pretending to be the BBC, the Reuters news bureau, your favorite low-cost airline etc.

**Rosenpass** is an important precaution against what is about to come: A safeguard, a computer programme installed and run in parallel to WireGuard, making it immune against Quantum Computer attacks. **Rosenpass** doesn't change the way WireGuard works (in fact WireGuard continues working properly in any case), but adds encryption that cannot be broken by the Quantum Computers that are about to enter our online living space.

**Rosenpass** is free and open source software, developed independently by cryptographers and scientists with the help of a grant by the Dutch philanthropic foundation Stichtig NLnet.

**It's complicated. We know.**

That's why we thought we'd allow you to choose your own battle:

{{% blocks/anchor-nav %}} 

{{< /blocks/section >}}

{{< blocks/lead color="light" >}}

## Explain it to me like I'm five.

{{< /blocks/lead >}}

{{< blocks/section color="white">}}

Cryptographers are people who work on making your phone, tablet, or laptop more secure. They create calculations that are so complicated to undo that they can be used to create envelopes for messages that cannot be opened unless you have the key. These envelopes can be created by any computer; your phone, tabled, or laptop is creating many of these right now.

This technology has been working very well for years, but when somebody manages to build a quantum computer they may be able to open up these envelopes without the key. Quantum computers use properties of the smallest things that exist – atoms – to perform calculations. These new computers are difficult to use and good at few things, but they happen to be very good at opening most of the envelopes created by cryptographers.

There are many ways to create envelopes that cannot be opened by quantum computers. Cryptographers have been holding competitions to find out whose envelopes are the best. Some winners where found, and now cryptographers are working hard to allow all computers – including yours – to create these envelopes that cannot be opened by quantum computers.

**Rosenpass** is a part of this effort. We want to allow a program called WireGuard to create these envelopes. Our program called **Rosenpass** joins WireGuard; they work together to protect network messages better than either could on their own.

{{< /blocks/section >}}

{{< blocks/lead  color="secondary" >}}

## Explain it like I'm a (tech) journalist

{{< /blocks/lead >}}

{{< blocks/section  color="light" >}}

**Rosenpass** provides a complement to the well-recognised WireGuard standard, adding quantum-hardened cryptography and key exchange while keeping the established WireGuard-standard encryption security. Therefore, **Rosenpass** is not just an add-on or a plug-in, but a coprocessing software that interacts with WireGuard at exactly one point, enhancing WireGuards predefined key generation and exchange process with Post Quantum Secure (PQS) cryptography, based on the McEliece cryptosystem.

**Rosenpass** is Free and Open Source Software, publically reviewable and adaptable, published under the Apache 2.0 and MIT Licenses. See the Download section for detailed License information.

**Rosenpass** is formally verifiable state-of-the-art Post Quantum Cryptography, groundbreakingly improving the security of a cornerstone to the internet.

Project **Rosenpass** is run by a team of cryptographers, researchers, open source developers, hackers and design artists; with focus on verifiable security improvement, usability and user advantage.

It comes as a small package at a Github-repository, easy to install and maintain with your WireGuard installation. At present, a new repository installation/addition is required, as the software is not packaged by standard yet.

**Rosenpass** is written in Rust, the philosophy behind its approach being to provide for code that is readable and legitimable in retrospect with implementations and improvements to come, thereby keeping the non-specified part of the system’s behaviour explicable in the future.

**Rosenpass** is a technology project, too. In the future, it may very well be adapted to other key elements of today’s internet security, preserving trust and safety in the coming Quantum era.

In short, **Rosenpass** will not just improve today’s internet, it will help keeping it going in the future.


{{< /blocks/section >}}


{{< blocks/lead  color="primary" >}}

## Explain it like I'm a developer

{{< /blocks/lead >}}

{{< blocks/section  color="white" >}}

**Rosenpass** implements a post-quantum-secure key exchange in the spirit of a Noise protocol. The motivating use case is integrating with the WireGuard VPN: In this mode, the key generated by **Rosenpass** is supplied to WireGuard as its pre-shared symmetric key (PSK). This results in a WireGuard VPN connection with hybrid post-quantum security.

While **Rosenpass** is designed with WireGuard in mind, it can be used as a stand-alone tool to exchange keys. Using this mode, it can be used to secure other protocols against attacks from quantum computers, given that they offer using a PSK, and that a secure PSK is sufficient for security of the protocol. To use this mode, the `rosenpass` binary must be used together with the `outfile <FILE>` parameter. Then, **Rosenpass** will write a key to the given file every two minutes, and print a message on standard out to notify the user or the calling script that the key has changed.

The implementation is written in Rust but uses libsodium and liboqs -- both of which are C libraries. This does not result in pretty code everywhere, but enables some advanced security features such as using libsodium’s `sodium_malloc`. We use a couple of techniques to make sure the code is secure: We use variable colouring (gating use of a secret value through a `.secret()` method), and the code zeroizes all key material.

#### Repo

There's a public github repository to go with it, and you're welcome with your questions and contributions along the way:

https://github.com/rosenpass/rosenpass

Check the download section for further information.


{{< /blocks/section >}}


{{< blocks/lead color="dark" >}}

## Explain it like I'm a cryptographer

{{< /blocks/lead >}}

{{< blocks/section color="light" >}}

**Rosenpass** protocol provides a post-quantum-secure authenticated key exchange, based on the work “Post-quantum WireGuard” (PQWG) by Hülsing, Ning, Schwabe, Weber, and Zimmermann [^pqwg]. Apart from some tweaks to the protocol internals, we provide security against what we call _state disruption attacks_ as a major contribution.

Both the classic WireGuard protocol (WG)[^wg] and PQWG rely on a timestamp to protect against replay of the first protocol message. By setting the system time to a future date, an attacker can trick the initiator into generating a kill-packet that can be used to inhibit future handshakes without special access; this renders the initiator’s static key pair practically useless. Requiring the ability to modify the system time is a realistic assumption due to the use of the insecure NTP protocol on many systems, as described in [WireGuard CVE-2021-46873](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-46873).

Instead of attempting to protect against replay of the first protocol message, **Rosenpass** uses a stateless responder, so replay of the first message leads to no attack. To achieve this, we move the responder state into an encrypted cookie and have the responder include it with their message. The initiator returns this cookie in their reply so the responder can restore it before processing the reply.

In practice, **Rosenpass** is meant to be used together with WireGuard to achieve hybrid post-quantum security. In this scenario, WireGuard is still used as the main VPN protocol for transporting data while **Rosenpass** runs on the side and supplies the WireGuard implementation with keys to be used as the pre-shared key (PSK) during its handshake. Just like WireGuard, Rosenpass executes a new handshake every two minutes.

A cryptographic proof of security is work in progress. At this time, we provide a symbolic analysis of the protocol using ProVerif and a practical implementation of the protocol in the Rust programming language. The implementation uses cryptographic primitives from liboqs [^liboqs] and libsodium [^libsodium].


&nbsp;

**References**

[^wg]: Jason A. Donenfeld. WireGuard: Next Generation Kernel Network Tunnel. NDSS 2017
 https://www.ndss-symposium.org/ndss2017/ndss-2017-programme/wireguard-next-generation-kernel-network-tunnel/

[^pqwg]: Andreas Hülsing, Kai-Chun Ning, Peter Schwabe, Florian Weber, and Philip R. Zimmermann. Post-quantum WireGuard. 
https://eprint.iacr.org/2020/379

[^liboqs]: Douglas Stebila, Michele Mosca. Post-quantum key exchange for the Internet and the Open Quantum Safe project. In Roberto Avanzi, Howard Heys, editors, Selected Areas in Cryptography (SAC) 2016, LNCS, vol. 10532, pp. 1–24. Springer, October 2017. 
https://openquantumsafe.org 
https://eprint.iacr.org/2016/1017

[^libsodium]: https://doc.libsodium.org/


{{< /blocks/section >}}

</div>