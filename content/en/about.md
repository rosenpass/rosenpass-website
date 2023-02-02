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

## So what exactly does **Rosenpass** do again?
 
{{< /blocks/lead >}}

<div class="about">

{{< blocks/section color="white" >}}

**It's complicated. We know.**

That's why we thought we'd allow you to choose your own battle:

{{% blocks/anchor-nav %}} 

{{< /blocks/section >}}

{{< blocks/lead color="light" >}}

## Explain it to me like I'm five.

{{< /blocks/lead >}}

{{< blocks/section color="white">}}

Welcome to Project **Rosenpass**.

The building ground of today's internet is under attack. "Quantum Computers" and their precursors are threatening almost every element of trust and security that keeps our current internet going.

Quantum Computers are vastly improved machines compared to today's technology. They will predictably be able to break one of the cornerstones of our internet, asymmetric key cryptography. That is of relevance for the everyday user and usage of the internet; for our bank accounts, our online purchases, for knowing if a website we surf to is the original or a fake.

Project **Rosenpass** is ultimately about protecting the internet in its social trust structure, preserving trustworthyness, identifiability and anonymity, whatever is desired by the participants.

The science of "Quantum Hardened" cryptography is already there, with mathematically provable software solutions at hand since many years ago. However, it is today's computers' capacities, bandwidths and energy comsumption ratio, that make practible implementations possible. **Rosenpass** is a groundbreaking step forward in that direction.

**Rosenpass** will not change the internet, but help keeping it going when big Quantum Computers become real.

It is a relatively cheap, but very significant improvement to internet security. The sooner it gets spread and widely used, the better.

**Rosenpass** starts out with an addition to the well-established VPN standard WireGuard, providing for quantum hardened VPN connections, a key feature of today's secure internet, especially in times of remote work.

It is easily installable side-by-side with existing WireGuard VPN installations.

**Rosenpass** is not just a plugin or add-on to the WireGuard VPN software, which is an internet standard of today. It is a cryptographic coprocessing system that does not intervene into WireGuards code execution, but providing it with Quantum secure cryptographic keys at one specific point.

**Rosenpass** is Free and Open Software, verifiable and reviewable by the scientific community. It uses mathematic software technology formally proven to be resistant against future Quantum Computer attacks.

Project **Rosenpass** is run by a German-based team of cryptographers, researchers, open source developers, hackers and design artists; with focus on verifiable security improvement, usability and user advantage. It is an independent scientific Free and Open Software Project, financially supported by a grant from the Dutch Stichting NLnet.

{{< /blocks/section >}}

{{< blocks/lead  color="secondary" >}}

## Explain it like I'm a (tech) journalist

{{< /blocks/lead >}}

{{< blocks/section  color="light" >}}


**Rosenpass** provides a complement to the well-recognised WireGuard standard, adding quantum-hardened key exchange while keeping established WireGuard-standard encryption security. Therefore, **Rosenpass** is not just an add-on or a plug-in, but a coprocessing software that interacts with WireGuard at exactly one point, enhancing WireGuards predefined key generation and exchange process with Post Quantum Secure (PQS) cryptography, based on the McEliece cryptosystem.

**Rosenpass** is Free and Open Source Software, publically reviewable and adaptable, published under the Apache 2.0 and MIT Licenses. See the Download section for detailed License information.

**Rosenpass** is formally verifiable state-of-the-art Post Quantum Cryptography, groundbreakingly improving the security of a cornerstone to the internet. 

Project **Rosenpass** is run by a team of cryptographers, researchers, open source developers, hackers and design artists; with focus on verifiable security improvement, usability and user advantage.

It comes as a small package at a Github-repository, easy to install and maintain with your WireGuard installation. At present, a new repository installation/addition is required, as the software is not packaged by standard yet.

**Rosenpass** is written in Rust, the philosophy behind its approach being to provide for code that is readable and legitimable in retrospect with implementations and improvements to come, thereby keeping the non-specified part of the system's behaviour explicable in the future.

**Rosenpass** is a technology project, too. In the future, it may very well be adapted to other key elements of today's internet security, preserving trust and safety in the coming Quantum era.

In short, **Rosenpass** will not just improve today's internet, it will help keeping it going in the future.


{{< /blocks/section >}}


{{< blocks/lead  color="primary" >}}

## Explain it like I'm a developer

{{< /blocks/lead >}}

{{< blocks/section  color="white" >}}

Rosenpass works as an addition to WireGuard, implementing post quantum secure encryption whilst keeping WireGuards untangled with as a fallback level, should Rosenpass fail for any reason in the future.

Therefore, Rosenpass is to be installed conjointly with an active WireGuard installation.

What Rosenpass does is essentially adding an advanced key exchange process and improved cryptography that is concurrently deemed quantum secure, i.e. reasonably hardened against attacks by quantum computers of different kinds.

**Rosenpass** is Free and Open Source Software under the Apache 2.0 and MIT licenses.

#### **Rosenpass** is written in Rust

**Rosenpass** is made in Rust, while being conscious about its many advandtages, but also its limitations. We have chosen a rather "low-level" manner of usage, the philosophy behind it being to write a cryptosystem that keeps being readable and legitimable in retrospect with future improvements to come, aiming at keeping the non-specified part of the system's behaviour explicable.


#### Repo

There's a public github repository to go with it, and you're welcome with your questions and contributions along the way:

https://github.com/rosenpass/rosenpass

Check the download section for further information.


{{< /blocks/section >}}


{{< blocks/lead color="dark" >}}

## Explain it like I'm a cryptographer

{{< /blocks/lead >}}

{{< blocks/section color="light" >}}

**Rosenpass** works as a complement to WireGuard, implementing post-quantum secure encryption whilst keeping WireGuards processing untangled with as a fallback level, should **Rosenpass** fail for any reason in the future. It's about additional, post-quantum safety, not alternative safety.

Therefore, **Rosenpass** is to be installed conjointly with an active WireGuard installation.

**Rosenpass** does coprocessing rather than code intervention.

**Rosenpass** solely intervenes into the WireGuard processing at the point of preshared key generation. It generates symmetric preshared keys, based on the classical McEliese cryptosystem, and does a few number of key exchanges, among other advantages handling the problem of sizeable McEliese public keys. 

Our calculations indicate that, by using **Rosenpass**, even embedded applications and systems using WireGuard can comfortably add Post Quantum security with reasonable additional computing power; with **Rosenpass**, cryptographic difficulty growth comes with over-linear, yet less-than-exponential computing power growth. See our whitepaper for calculations.

**Rosenpass** can be described as a post-quantum-secure key exchange protocol. It makes formal proof at the compiler backend possible, and it provides for symbolic verification, mechanized proof of security; a low-level, fast, formally verifiable piece of open source cryptography.

**Rosenpass**’s keys are used for the pre-shared keys in WireGuard. The Rosenpass protocol runs in parallel to the WireGuard protocol. Rosenpass is solely used for key agreement to compute the PSK, WireGuard is used for transport data, nothings changes here.

This design delivers fully hybrid post/pre-quantum security. **Rosenpass** + WireGuard is as least as secure as WireGuard alone, in any circumstances. 


####  Reference

We would like to refer to this paper by *Hülsing, Ning, Schwabe, Weber and Zimmermann (2021)*, as an important part of our work and protocol builds on its conclusions: 

https://eprint.iacr.org/2020/379.pdf 

{{< /blocks/section >}}

</div>