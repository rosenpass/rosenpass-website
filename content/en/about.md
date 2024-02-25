---
title: "What is Rosenpass?"
linkTitle: "What is Rosenpass?"
weight: 20
menu:
  main:
    weight: 20
type: community
---


{{< blocks/lead  >}}

## What is Rosenpass?
 
{{< /blocks/lead >}}

<div class="about">

{{< blocks/section color="white" >}}

**Rosenpass** is free and **open-source** software based on the latest research in the field of **cryptography**. It is intended to be used with **WireGuard VPN**, but can work with all software that uses pre-shared keys. It uses two cryptographic methods (Classic McEliece and Kyber) to secure systems against attacks with **quantum computers**.

**Rosenpass** is also a **science communication** project that intends to make cryptography easy to understand for everyone. 

#### "Explain it like I'm..."

On that note, we have provided a series in-depth of explanations about what **Rosenpass** does at different levels. 
Pick whatever you feel suits you best! :D

{{% blocks/eli5-nav %}} 

{{< /blocks/section >}}

{{< blocks/lead color="light" >}}

### Explain it like I'm five! 
(Meaning you don't have to know a lot about computers to understand this.)

{{< /blocks/lead >}}

{{< blocks/section color="white">}}

#### What is cryptograhpy?

Have you ever tried **writing a message** to a friend that **only they could read**? You might have told them: "Take each letter and move it forward three places in the alphabet!". Then you would have moved each letter of your message three places backward before writing it down. Encryption is basically like that, but *a lot* more complicated! And you can do other useful stuff with it. For example make sure the message really comes from the person it claims to be from.

{{< /blocks/section >}}
{{< blocks/eli5-images 	src1="img/about/eli5_wic1.png" alt1="Childish drawing of a girl handing a note to a boy." 
						src2="img/about/eli5_wic2.png" alt2="Girl handing a letter to the boy. Both have notes at their desks. " 
						src3="img/about/eli5_wic3.png" alt3="Decoding the letter with the note. " >}}

{{< blocks/section color="white">}}

#### Why do we need cryptography?
Without cryptography, every message you send on your phone or computer could be **read by everyone** on the way between you and the receiver of that message. It's like sending a letter without an envelope! That might not be such a big problem for the GIFs you send to your friends (We also send postcards without envelopes, after all!), but there are parts of our communication that really shouldn't be public. Like when you buy something online: If you sent your **credit card information** unencrypted, it would mean that everyone could read that data and go buy something with your money!

#### What is a quantum computer?
Regular computers only know two states: 0 (= power off) and 1 (= power on). When you send data on a regular computer, it maps every character to a long sequence of **ones and zeros**.
All over the world, scientists are trying to build computers that use quantum mechanics to have **more than just these two states**, because that would make them much **faster** than the computers we have today. They made prototypes that kind of work, but they are huge, unstable (because they are super sensitve to their environment) and **can't really do much, yet**. 

#### What makes quantum computers so bad for cryptography?
Cryptography is so secure because it takes your message and does some **math** with it, that's **super hard for computers** to undo. Your communication partner exchanged a **"key"** with you at some point. That's basically a long series of ones and zeros. With this, your computer can **restore the original message** pretty fast. Someone who doesn't have your key could just **try all possible combinations** of ones and zeros to find out which of them is your key. But it would take them centuries to try all possible combinations!
The problem with **quantum computers** is that they are **super good at the math** that's so hard for normal computers. So suddenly, trying all possible combinations doesn't take years anymore. Just minutes!

(You can also use quantum computers to make cryptography that's impossible to break even for quantum computers. But that's a whole other story. Everyone who wants to use it would need a quantum computers or at least a special device for that. So that's even much farther in the future than a few huge but functioning quantum computers that can break regular cryptography!)

#### What can we do to protect our encryption against quantum computers?
Cryptographers, the scientists that invent cryptography, have been watching the development of quantum computers closely. Their whole job is to **solve complex mathematical problems** and finding a way to protect encryption that's made on regular computers from attacks from quantum computers is an interesting and very important problem. 
So they tried (and still try) new things and held contests to **find cyphers** that could withstand quantum computer attacks. A cypher is like a set of instructions on what math you have to do with a message to encrypt and decrypt it. Then they proceeded to try and break each other's cyphers. That's just what scientist do to make sure that they really found the right solution. Even if it hurts, it's better when a fellow scientist breaks your cypher then when attacker does (without your knowledge)!

#### What is a VPN?
A VPN or **Virtual Private Network** is like a **tunnel** that you can send your messages through, so that **nobody can see** them. Not even when and where they go to! This tunnel is also **made of encryption**! Many companies use VPNs so that their employees who work from home or are on a business trip can connect to the company network. This makes sure that their competitiors or people who want to harm them can't know what they are working on. 
But you can also use a VPN at home. There are many providers that offer easy to use VPN software. 

#### What is WireGuard?
Many people think that software is secure if you just do your best to hide it's code from everyone's eyes. But that's not true. Software is the most secure when everyone can have a look at it and check that it really does what it does and nothing else. 
That's what makes **WireGuard** stand out among other **VPNs**. It is made of **short and easy to read code** that everyone can access. That's why people trust it to be really **secure**. 

#### What is Rosenpass?
**Rosenpass** is a piece of **software** that uses two of the **post-quantum-secure cyphers** the scientists found. It **generates keys** with those cyphers and **hands them to WireGuard**. Like WireGuard, it is easy to read and anyone can have a look at what it does.
WireGuard already comes with it's own cyphers, but those are not post-quantum-secure. **Rosenpass** doesn't replace those cyphers, but just kind of wraps around them. That means that even if there were something wrong with Rosenpass, the encryption can't get worse than the one WireGuard already has. Just better. Having **failsafes** like that is important in writing secure software. 

#### How can I use Rosenpass?
If you don't know a lot about computers, you will probably never install **Rosenpass** yourself. But you could subscribe to a **VPN provider** that uses WireGuard and **Rosenpass** to make **your communication secure against attacks from quantum computers**. 


{{< /blocks/section >}}

{{< blocks/lead  color="secondary" >}}

### Explain it like I'm a tech journalist!

{{< /blocks/lead >}}

{{< blocks/section  color="light" >}}

Rosenpass provides a complement to the well-known WireGuard protocol, adding quantum-hardened cryptography and key exchange while keeping the established WireGuard standard encryption security. So Rosenpass functions as an add-on, enhancing WireGuard's key negotiation process with Post Quantum Secure (PQS) cryptography, based a combination of Classic McEliece and Kyber.

Rosenpass is free and open-source software. This means it can be publicly reviewed and adapted by other developers for their purposes. All contributions to Rosenpass are provided both under a Apache 2.0 and an MIT License. When using Rosenpass itself, the user may choose under which license to use Rosenpass.
(See the [License](/#license) section for detailed information.) 

Rosenpass uses symbolically verified, state-of-the-art cryptography. This project is part of a wider effort to break new ground in improving the security of an important component of the public internet.

The project is run by a team of cryptographers, researchers, open-source developers, hackers and designers. We emphasise verifiable security, usability, and science communication. It is provided as a small package in a GitHub repository, and is easy to install and maintain alongside your WireGuard installation.

Rosenpass is written in Rust. The application serves as a reference implementation. It aids developers in implementing and adapting the protocol to other systems by providing readable source code and ample documentation. The software developed to implement Rosenpass can be easily adapted to other pieces of the internet security landscape, preserving trust and safety of future networks.

{{< /blocks/section >}}


{{< blocks/lead  color="primary" >}}

### Explain it like I'm a developer!

{{< /blocks/lead >}}

{{< blocks/section  color="white" >}}

Rosenpass implements a post-quantum-secure key exchange in the spirit of the [Noise Protocol Framework](https://noiseprotocol.org/). The motivating use case is integrating with the WireGuard VPN. In this mode, the shared secret generated by Rosenpass is supplied to WireGuard as its pre-shared symmetric key (PSK). This results in a WireGuard VPN connection with hybrid post-quantum security.

While Rosenpass is designed with WireGuard in mind, it can be used as a stand-alone tool to exchange keys. Using this mode, it can be employed to secure other protocols against attacks from quantum computers. The other protocol needs to provide security, assuming a secure PSK is used for this to work. To use this mode, the `rosenpass` binary must be used together with the `outfile <FILE>` parameter. Rosenpass will write a key to the given file every two minutes, and print a message on standard out to notify the user or the calling script that the key has changed.

The implementation is written in Rust but uses libsodium and liboqs, both of which are C libraries. This does not result in pretty code everywhere, but enables some advanced security features. We use a couple of techniques to make sure the code is secure. We use variable colouring (gating use of a secret value through a `.secret()` method), and the code zeroises all key material.

#### Repo

We maintain a public GitHub repository for Rosenpass and welcome all kinds of contributions:

https://github.com/rosenpass/rosenpass

Check the [Getting Started](/#start) section for further information.


{{< /blocks/section >}}


{{< blocks/lead color="dark" >}}

### Explain it like I'm a cryptographer!

{{< /blocks/lead >}}

{{< blocks/section color="light" >}}

The Rosenpass protocol provides a post-quantum-secure authenticated key exchange, based on the work "Post-quantum WireGuard" (PQWG) by Hülsing, Ning, Schwabe, Weber, and Zimmermann [^pqwg]. Apart from some tweaks to the protocol internals, we provide security against what we call _state disruption attacks_ as a major contribution.

Both the classic WireGuard protocol (WG)[^wg] and PQWG rely on a timestamp to protect against replay of the first protocol message. By setting the system time to a future date, an attacker can trick the initiator into generating a kill-packet that can be used to inhibit future handshakes without special access. This renders the initiator's static key pair practically useless. Assuming an attacker's ability to modify the system time is realistic due to the use of the insecure NTP protocol on many systems, as described in [WireGuard CVE-2021-46873](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-46873).

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
