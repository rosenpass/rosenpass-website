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

## So what exactly does Rosenpass do?
 
{{< /blocks/lead >}}

<div class="about">

{{< blocks/section color="white" >}}


Virtual Private Networks (VPNs) are a cornerstone of the modern internet. VPNs can be used for anonymization, to circumvent location-based website locks, and to get better deals in online stores. Whenever you connect to your workplace from your home, you are probably using a VPN to encrypt the connection. For people in countries that regulate their citizens' internet usage aggressively, VPNs have become a way to access uncensored information and free communication. One important VPNs type is called WireGuard®.

WireGuard is excellent; it is fast, secure, and very efficient, but there is a problem on the horizon threatening its security: quantum computers may be able to break all modern cryptosystems in a couple of years. With this breakage, all systems on the internet are threatened by criminals and state actors again; even data sent today is affected by this threat, as espionage agencies can store data transmitted today and decrypt it in the future.

Rosenpass can be used to hedge against that risk. The application can be installed to run in parallel to WireGuard and protect it from quantum attacks. Rosenpass doesn't change the way WireGuard works: its encryption remains as it was, except for an additional key that cannot be broken by the quantum computers.

Rosenpass is free and open-source software, developed by cryptographers and scientists thanks to a grant by the Dutch philanthropic foundation NLNet.

**Do you still have questions?**

To help everyone understand what Rosenpass does, we provided explanation at different levels:

{{% blocks/anchor-nav %}} 

{{< /blocks/section >}}

{{< blocks/lead color="light" >}}

### Explain it to me like I'm five.

{{< /blocks/lead >}}

{{< blocks/section color="white">}}

Cryptographers are people who work on making your phone, tablet, or laptop more secure. They create calculations that are very complicated to undo. These calculations can be used to create locked locks, sealing messages, so they cannot be opened unless you have the key. These locks can be created by any computer; your phone, tablet or laptop is probably creating many of them right now.

This technology has been working very well for years, but people are working to undo all the hard work: Some people are working to build a quantum computer; a special type of computer that can open these locks without the key. Quantum computers use properties of the smallest things that exist to perform calculations. Quantum computers are difficult to use and good at few things, but they happen to be very good at opening most of the locks created by cryptographers.

There are many ways to create locks that cannot be opened by quantum computers. Cryptographers have been holding competitions to find out whose locks are the best. Some winners have been found, and now cryptographers are working hard to allow all computers to create these locks. When they are done, even quantum computers cannot break the locks your computer creates.

Rosenpass is a part of this effort. Our program allows another program called WireGuard to create safe locks. Rosenpass and WireGuard work together to protect network messages better than either could on their own.

{{< /blocks/section >}}

{{< blocks/lead  color="secondary" >}}

### Explain it like I'm a tech journalist

{{< /blocks/lead >}}

{{< blocks/section  color="light" >}}

Rosenpass provides a complement to the well-known WireGuard standard, adding quantum-hardened cryptography and key exchange while keeping the established WireGuard standard encryption security. So Rosenpass is an add-on, enhancing WireGuard's key negotiation process with Post Quantum Secure (PQS) cryptography, based on the McEliece cryptosystem.

Rosenpass is free and open-source software. This means it can be publicly reviewed and adapted by other developers for their purposes. The source code published under Apache and MIT licenses – see the [License](/#license) section for detailed information.

Rosenpass uses symbolically verified, state-of-the-art cryptography. The project is breaking new ground in improving the security of an important component of the public internet.

The project is run by a team of cryptographers, researchers, open-source developers, hackers and designers. We emphasize verifiable security, usability, and science communication. It comes as a small package in a GitHub repository, and is easy to install and maintain alongside your WireGuard installation.

Rosenpass is written in Rust. The application should serve as a reference implementation; it should aid developers implementing and adapting the protocol to other systems by providing readable source code and ample documentation. The software developed to implement Rosenpass can be easily adapted to other pieces of the internet security landscape, preserving trust and safety of future networks.

{{< /blocks/section >}}


{{< blocks/lead  color="primary" >}}

### Explain it like I'm a developer

{{< /blocks/lead >}}

{{< blocks/section  color="white" >}}

Rosenpass implements a post-quantum-secure key exchange in the spirit of the Noise Protocol Framework. The motivating use case is integrating with the WireGuard VPN: In this mode, the key generated by Rosenpass is supplied to WireGuard as its pre-shared symmetric key (PSK). This results in a WireGuard VPN connection with hybrid post-quantum security.

While Rosenpass is designed with WireGuard in mind, it can be used as a stand-alone tool to exchange keys. Using this mode, it can be employed to secure other protocols against attacks from quantum computers. The other protocol needs to provide security, assuming a secure PSK is used for this to work. To use this mode, the `rosenpass` binary must be used together with the `outfile <FILE>` parameter. Rosenpass will write a key to the given file every two minutes, and print a message on standard out to notify the user or the calling script that the key has changed.

The implementation is written in Rust but uses libsodium and liboqs -- both of which are C libraries. This does not result in pretty code everywhere, but enables some advanced security features, such as using libsodium's `sodium_malloc`. We use a couple of techniques to make sure the code is secure: We use variable colouring (gating use of a secret value through a `.secret()` method), and the code zeroizes all key material.

#### Repo

There is a public GitHub repository for Rosenpass. We welcome all kinds of contributions:

https://github.com/rosenpass/rosenpass

Check the [Getting Started](/#start) section for further information.


{{< /blocks/section >}}


{{< blocks/lead color="dark" >}}

### Explain it like I'm a cryptographer

{{< /blocks/lead >}}

{{< blocks/section color="light" >}}

The Rosenpass protocol provides a post-quantum-secure authenticated key exchange, based on the work "Post-quantum WireGuard" (PQWG) by Hülsing, Ning, Schwabe, Weber, and Zimmermann [^pqwg]. Apart from some tweaks to the protocol internals, we provide security against what we call _state disruption attacks_ as a major contribution.

Both the classic WireGuard protocol (WG)[^wg] and PQWG rely on a timestamp to protect against replay of the first protocol message. By setting the system time to a future date, an attacker can trick the initiator into generating a kill-packet that can be used to inhibit future handshakes without special access; this renders the initiator's static key pair practically useless. Assuming an attacker's ability to modify the system time is realistic due to the use of the insecure NTP protocol on many systems, as described in [WireGuard CVE-2021-46873](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-46873).

Instead of attempting to protect against replay attacks on the first protocol message, Rosenpass uses a stateless responder, so replay of the first message leads to no attack. To achieve this, we move the responder state into an encrypted cookie and have the responder include it with their message. The initiator returns this cookie in their reply, so the responder can restore it before processing the reply.

In practice, Rosenpass is meant to be used together with WireGuard to achieve hybrid post-quantum security. In this scenario, WireGuard is still used as the main VPN protocol for transporting data while Rosenpass runs on the side and supplies the WireGuard implementation with keys to be used as the pre-shared key (PSK) during its handshake. Just like WireGuard, Rosenpass executes a new handshake every two minutes.

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
