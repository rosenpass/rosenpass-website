+++
title = "Rosenpass"
linkTitle = "Rosenpass"
subtitle = "Build post-quantum-secure VPNs with WireGuard!"
shortBlerb = "Rosenpass homepage"
images = ['img/rosenpass-preview.png']
weight = 10
newUpdate= false

+++

{{< blocks/cover title="Rosenpass" image_anchor="top" height="auto" color="white" >}}
<p class="subtitle">Build post-quantum-secure VPNs with WireGuard!</p>
<div class="rp-buttonrow mx-auto">
<a class="btn btn-lg btn-secondary mr-3 mb-4" href="/docs/rosenpass-tool/guides">
Quick Start <!-- <i class='fas fa-arrow-alt-circle-down '></i>-->
</a>
<a class="btn btn-lg btn-primary mr-3 mb-4" href="/about">
What is Rosenpass? <!--<i class="fas fa-arrow-alt-circle-right ml-2"></i>-->
</a>
<a class="btn btn-lg btn-dark mr-3 mb-4" href="https://github.com/rosenpass/rosenpass" target="_blank">
Source Code <i class="fab fa-github ml-2 "></i>
</a>

<div>
{{< blocks/link-down color="info" >}}
</div>
</div>
{{< /blocks/cover >}}


{{< blocks/section color="white" class="rosenpass-overview-links">}}
	{{< blocks/feature icon="fa-lock" title="Post-Quantum Secure" >}}
		<strong>Rosenpass</strong> is a key-exchange protocol using techniques that are secure against attacks from quantum computers.
		It achieves the same security guarantees as WireGuard, using two strong post-quantum key exchange methods – Classic McEliece and Kyber.
		{{< /blocks/feature >}}
		{{< blocks/feature icon="fa-dragon" title="Works with WireGuard" url="" >}}
		<strong>Rosenpass</strong> keeps WireGuard security intact and adds on to it; Rosenpass handles post-quantum security, WireGuard handles pre-quantum security.
		{{< /blocks/feature >}}
		{{< blocks/feature icon="fa-box-open" title="Free and Open Source" url="" >}}
		<strong>Rosenpass</strong> is Free and Open Source Software under the Apache 2.0 and MIT license and developed by hackers and researchers.
	{{< /blocks/feature >}}
{{< /blocks/section >}}



{{< blocks/section color="light" class="">}}
	<h3>What is Rosenpass? </h3>
	<p>Rosenpass is free and open-source software based on the latest research in the field of cryptography. It is intended to be used with WireGuard VPN, but can work with all software that uses pre-shared keys. It uses two cryptographic methods (Classic McEliece and Kyber) to secure systems against attacks with quantum computers.</p>

	<p>Rosenpass is also a science communication project that intends to make cryptography easy to understand for everyone. </p>
	
	<p><button class="btn btn-primary "><a href="/about">Read more</a></button></p>
{{< /blocks/section >}}

{{< blocks/section color="white" class="">}}
	<h3>What are we up to? </h3>
	
	<p>Take a look at our latest blog posts!</p>


{{< blocks/latest-posts >}}

{{< /blocks/section >}}
