---
title: "About Rosenpass"
linkTitle: "About"
weight: 20
menu:
  main:
    weight: 20
type: community
---


{{< blocks/lead  >}}

## So what exactly does **Rosenpass** do?
 
{{< /blocks/lead >}}

<div class="about">

{{< blocks/section color="white" >}}


Today, Virtual Private Networks (VPNs) are a cornerstone of the modern Internet. Whenever you connect to your workplace from your home office, you are probably, consciously or not, using VPN software to ensure that all the data flowing from your computer at home to your employer's office is safe from being tampered with.

There are many more common, everyday use cases ‒ from online research to circumventing location-based (and regulated) online services.

For people in countries that regulate their citizens' internet usage in a more aggressive way, VPNs have become a ubiquitous source of online "mobility" through different regulatory environments, enabling access to uncensored information and communication. Some malicious governments even make using them a criminal offence.

As VPNs became a common internet standard, certain "protocols" ‒ technical sets of rules on how to communicate ‒ also became standards. Today's most important VPN standard is the Free and Open Source Software WireGuard®.

In recent years, "Quantum Computers" have become visible on the horizon as we look towards the future ‒ computers so powerful they could break any current cryptographic standard. Standards that ensure the safety of our online banking or the authenticity of a website pretending to be the BBC, the Reuters news bureau or your favorite low-cost airline.

**Rosenpass** is an important precaution against what is to come: a safeguard. It is a computer programme installed and run in parallel to WireGuard, making it immune to attacks from Quantum Computers. **Rosenpass** doesn't change the way WireGuard works (in fact, WireGuard encryption continues to work as it used to without **Rosenguard**), but it adds encryption that cannot be broken by the Quantum Computers that are about to become part of our online reality.

**Rosenpass** is Free and Open Source Software, developed independently by cryptographers and scientists with the help of a grant by the Dutch philanthropic foundation Stichtig NLnet.


**Do you still have questions?**


Understanding what Rosenpass does is complicated, that's why we thought we'd allow you to choose your own battle:

{{% blocks/anchor-nav %}} 

{{< /blocks/section >}}

{{< blocks/lead color="light" >}}

### Explain it to me like I'm five.

{{< /blocks/lead >}}

{{< blocks/section color="white">}}

Cryptographers are people who work on making your phone, tablet, or laptop more secure. They create calculations that are so complicated to undo that they can be used to create locked envelopes, sealing messages so that they can't be opened unless you have the key. These locks can be created by any computer; your phone, tablet or laptop is probably creating many of them right at this moment.

This technology has been working very well for years, but when somebody manages to build a quantum computer they may be able to open up these locks without the key. Quantum computers use properties of the smallest things that exist ‒ components of atoms ‒ to perform calculations. These new computers are difficult to use and good at few things, but they happen to be very good at opening most of the locks created by cryptographers.

There are many ways to create locks that cannot be opened by quantum computers. Cryptographers have been holding competitions to find out whose locks are the best. Some winners have been found, and now cryptographers are working hard to allow all computers – including yours – to create these locks that cannot be opened by quantum computers.

**Rosenpass** is a part of this effort. We want to allow a program called WireGuard to create these locks. Our program, called **Rosenpass**, complements WireGuard; they work together to protect network messages better than either could on their own.

{{< /blocks/section >}}

{{< blocks/lead  color="secondary" >}}

### Explain it like I'm a tech journalist

{{< /blocks/lead >}}

{{< blocks/section  color="light" >}}

**Rosenpass** provides a complement to the well-known WireGuard standard, adding quantum-hardened cryptography and key exchange while keeping the established WireGuard standard encryption security. So **Rosenpass** is not just an add-on or a plug-in, but coprocessing software that interacts with WireGuard at exactly one point, enhancing WireGuards predefined key generation and exchange process with Post Quantum Secure (PQS) cryptography, based on the McEliece cryptosystem.

**Rosenpass** is Free and Open Source Software, publically reviewable and adaptable, published under Apache and MIT licenses. See the [License](/#license) section for detailed information.

**Rosenpass** is formally verifiable, state-of-the-art Post Quantum Cryptography, breaking new ground in improving the security of a cornerstone of the Internet.

Project **Rosenpass** is run by a team of cryptographers, researchers, open source developers, hackers and designers; focussing on verifiable security improvement, usability and user advantage.

It comes as a small package in a Github repository, and is easy to install and maintain alongside your WireGuard installation. At present, a new repository installation/addition is required, as the software is not yet packaged as standard.

**Rosenpass** is written in Rust. The rosenpass application should serve as a reference implementation; it should aide developers implementing and adapting the protocol to other systems by providing readable source code and ample comments.

**Rosenpass** is a technology project. In the future, it can be adapted to other elements of modern internet security, preserving trust and safety in future networks.

In short, **Rosenpass** will not just improve today's Internet, it will help keeping it going in the future.


{{< /blocks/section >}}


{{< blocks/lead  color="primary" >}}

### Explain it like I'm a developer

{{< /blocks/lead >}}

{{< blocks/section  color="white" >}}

**Rosenpass** implements a post-quantum-secure key exchange in the spirit of a Noise protocol. The motivating use case is integrating with the WireGuard VPN: In this mode, the key generated by **Rosenpass** is supplied to WireGuard as its pre-shared symmetric key (PSK). This results in a WireGuard VPN connection with hybrid post-quantum security.

While **Rosenpass** is designed with WireGuard in mind, it can be used as a stand-alone tool to exchange keys. Using this mode, it can be used to secure other protocols against attacks from quantum computers, given that they provide for the use of a PSK, and that a secure PSK is sufficient for security of the protocol. To use this mode, the `rosenpass` binary must be used together with the `outfile <FILE>` parameter. Then, **Rosenpass** will write a key to the given file every two minutes, and print a message on standard out to notify the user or the calling script that the key has changed.

The implementation is written in Rust but uses libsodium and liboqs -- both of which are C libraries. This does not result in pretty code everywhere, but enables some advanced security features such as using libsodium's `sodium_malloc`. We use a couple of techniques to make sure the code is secure: We use variable colouring (gating use of a secret value through a `.secret()` method), and the code zeroizes all key material.

#### Repo

There is a public github repository for **Rosenpass**.  You are welcome to participate with questions and contributions:

https://github.com/rosenpass/rosenpass

Check the [Getting Started](/#start) section for further information.


{{< /blocks/section >}}


{{< blocks/lead color="dark" >}}

### Explain it like I'm a cryptographer

{{< /blocks/lead >}}

{{< blocks/section color="light" >}}

**Rosenpass** protocol provides a post-quantum-secure authenticated key exchange, based on the work "Post-quantum WireGuard" (PQWG) by Hülsing, Ning, Schwabe, Weber, and Zimmermann [^pqwg]. Apart from some tweaks to the protocol internals, we provide security against what we call _state disruption attacks_ as a major contribution.

Both the classic WireGuard protocol (WG)[^wg] and PQWG rely on a timestamp to protect against the replaying of the first protocol message. By setting the system time to a future date, an attacker can trick the initiator into generating a kill-packet that can be used to inhibit future handshakes without special access; this renders the initiator's static key pair practically useless. Assuming an attacker's ability to modify the system time is realistic due to the use of the insecure NTP protocol on many systems, as described in [WireGuard CVE-2021-46873](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-46873).

Instead of attempting to protect against the replay attacks on the first protocol message; **Rosenpass** uses a stateless responder, so replay of the first message leads to no attack. To achieve this, we move the responder state into an encrypted cookie and have the responder include it with their message. The initiator returns this cookie in their reply so the responder can restore it before processing the reply.

In practice, **Rosenpass** is meant to be used together with WireGuard to achieve hybrid post-quantum security. In this scenario, WireGuard is still used as the main VPN protocol for transporting data while **Rosenpass** runs on the side and supplies the WireGuard implementation with keys to be used as the pre-shared key (PSK) during its handshake. Just like WireGuard, Rosenpass executes a new handshake every two minutes.

A cryptographic proof of security is in the works. At this time, we provide a symbolic analysis of the protocol using ProVerif and a practical implementation of the protocol in the Rust programming language. The implementation uses cryptographic primitives from liboqs [^liboqs] and libsodium [^libsodium].


&nbsp;

#### References

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