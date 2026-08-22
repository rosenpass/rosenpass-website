---
title: "Who ist Rosenpass?"
linkTitle: "Who is Rosenpass?"
weight: 50
menu:
  main:
    params:
      ShortBlerb: "The Rosenpass team, contributors, our partners, and how to reach us"
    weight: 50
type: community
---

{{< blocks/lead color="dark" >}}
<h3>Who we are</h3>
{{< /blocks/lead >}}

{{< blocks/section color="white">}}

<div class="rp-buttonrow mx-auto contact-buttons">
		<a class="btn btn-lg btn-primary mr-3 mb-4" href="#core-team">
		<span>Core Team</span>
		</a>
		<a class="btn btn-lg btn-secondary mr-3 mb-4" href="#code-contributors">
			<span>Code Contributors</span> 
		</a>
		<a class="btn btn-lg btn-light mr-3 mb-4" href="#with-support-from">
		<span>Funding Partners</span>
		</a>
		<a class="btn btn-lg btn-dark mr-3 mb-4" href="#contact">
			<span>Contact</span>
		</a>
</div>

	<img src="/icons/rosenpass-darkogo.svg" height="200px" class="mb-3"></img>
	<p class="text-center">Rosenpass is a cryptography research group that was foundend outside of a university or business context. <br>
	Most of us are from Germany, but we consider ourselves a decentralized, international association. </p>
	
{{< /blocks/section >}}

{{< blocks/lead color="primary" >}}
### Core Team
{{< /blocks/lead >}}
<div id="main-contributors" class="row">
{{< blocks/member 
	contribution="Protocol Design and Coordination" 
	name="Karolin “dakoraa” Varner" 
	mail="karo@rosenpass.eu" 
	key="/keys/karo@rosenpass.eu.pub" 
	web="cupdev.net" 
	github="koraa" 
	>}}

{{< blocks/member 
	contribution="Cryptographic Analysis" 
	name="Benjamin “blipp” Lipp" 
	mail="blipp@rosenpass.eu" 
	key="/keys/blipp@rosenpass.eu.pub"
	web="benjaminlipp.de" 
	github="blipp" 
	>}}

{{< blocks/member 
	contribution="Science Illustration, Web Design and Web Development" 
	name="Lisa “Mullana” Schmidt" 
	mail="mullana@rosenpass.eu" 
	key="/keys/mullana@rosenpass.eu.pub"
	web="mullana.de" 
	github="Mullana" 
	>}}
	
{{< blocks/member 
	contribution="LaTeX" 
	name="Marei “TeXhackse” Peischl" 
	mail="marei@rosenpass.eu" 
	web="peitex.de" 
	github="TeXhackse" 
	>}}

{{< blocks/member 
	contribution="Engineering" 
	name="Wanja “wucke13” Zaeske" 
	mail="wucke13@rosenpass.eu" 
	github="wucke13"
	color="ff7900" 
	>}}
	

<!-- {{< blocks/member
	contribution="Engineering and Documentation"
	name="Clara cve Engler"
	mail="engler@rosenpass.eu"
	github="cvengler"
	>}} -->
</div>

{{< blocks/lead color="secondary" >}}
### Code Contributors
{{< /blocks/lead >}}
{{< blocks/section color="white" >}}
<p class="text-center codethanks-blerb">
The Rosenpass tool is only made possible due to the contributions of a wide variety of people, inside and outside the core team, ranging from academic crytographers to Rust enthusiasts. Their wealth of experience, knowledge, and perspectives have driven the code we present today. We are grateful for their commitment to a secure, free, open source internet, as well as the contributions of each and every one.
</p>
<a href="https://github.com/rosenpass/rosenpass/graphs/contributors" alt="Link to Rosenpass' GitHub contributor page"><img src="/icons/github-mark.svg" class="github-svg svg-light"></img><img src="/icons/github-mark-white.svg" class="github-svg svg-invert"></img></a>
<div class="row contributors codethanks-list">
	{{< blocks/contributor github="koraa">}}
	{{< blocks/contributor github="prabhpreet">}}
	{{< blocks/contributor github="cvengler">}}
	{{< blocks/contributor github="aparcar">}}
	{{< blocks/contributor github="pqcfox">}}
	{{< blocks/contributor github="TeXhackse">}}
	{{< blocks/contributor github="Mullana">}}
	{{< blocks/contributor github="blipp">}}
	{{< blocks/contributor github="br-olf">}}
	{{< blocks/contributor github="AliceOrunitia">}}
	{{< blocks/contributor github="Rixxc">}}
	{{< blocks/contributor github="pcwizz">}}
	{{< blocks/contributor github="wahjava">}}
	{{< blocks/contributor github="ajuvo">}}
	{{< blocks/contributor github="sevenautumns">}}
	{{< blocks/contributor github="marek22k">}}
	{{< blocks/contributor github="mogery">}}
	{{< blocks/contributor github="TimMellor">}}
	{{< blocks/contributor github="stv0g">}}
	{{< blocks/contributor github="lorenzleutgeb">}}
	{{< blocks/contributor github="ezhil56x">}}
	{{< blocks/contributor github="AlooDon">}}
	{{< blocks/contributor github="beau2am">}}
	{{< blocks/contributor github="rex4539">}}
</div>
{{< /blocks/section >}}

{{< blocks/lead color="light" >}}
### With support from
{{< /blocks/lead >}}
{{< blocks/section color="white" >}}
<div class="container mobile-display">
	<div class="text-center row">
		<div class="col funding">
			<div>
				<a href="https:prototypefund.de" >
				<img src="/icons/PrototypeFund_Logo.svg" class="rp-supporter" alt="Logo ProtoType Fund: Large blue P letter">
				</a>
	  		</div>
	  		<p>Rosenpass received funding and support through the <a href="https://prototypefund.de/en/project/post-quantum-vpn-mit-minimalen-privilegien/">ProtoType Fund's 14th round to reduce the privileges needed by the Rosenpass tool</a>. The ProtoType Fund is a project of the <a href="https://okfn.de/en/">Open Knowledge Foundation Germany</a>, funded by the <a href="https://www.bmbf.de/en/index.html">Federal Ministry of Education and Research (BMBF).</a></p>
	 	</div> 
		<div class="col funding">
			<div>
				<a href="https://NLnet.nl" >
				<img src="/icons/nlnet.svg" class="rp-supporter" alt="Logo NLnet: abstract logo of four people seen from above">
				</a>
			
				<a href="https://NLnet.nl/assure" >
				<img src="/icons/ngiassure.svg" class="rp-supporter" alt="Logo NGI Assure: letterlogo shaped like a tag">
				</a>
			</div>
	  		<p>Rosenpass is also funded through NLNet's <a href="https://NLnet.nl/assure">NGI Assure</a> Fund, with financial support from the European Commission's <a href="https://ngi.eu">Next Generation Internet</a> programme, under the aegis of DG Communications Networks, Content and Technology. Funding has been provided for <a href="https://nlnet.nl/project/Rosenpass/">the initial Rosenpass project</a> and <a href="https://nlnet.nl/project/Rosenpass-API/">improvements to the Rosenpass API.</a></p>
		</div>
	</div>
</div>
<div class="container large-display">
	<div class="text-center row">
		<div class="col funding">
			<div>
				<a href="https:prototypefund.de" >
				<img src="/icons/PrototypeFund_Logo.svg" class="rp-supporter" alt="Logo ProtoType Fund: Large blue P letter">
				</a>
	  		</div>
	 	</div> 
		<div class="col funding">
			<div>
				<a href="https://NLnet.nl" >
				<img src="/icons/nlnet.svg" class="rp-supporter" alt="Logo NLnet: abstract logo of four people seen from above">
				</a>
			
				<a href="https://NLnet.nl/assure" >
				<img src="/icons/ngiassure.svg" class="rp-supporter" alt="Logo NGI Assure: letterlogo shaped like a tag">
				</a>
			</div>
		</div>
	</div>
	<div class="text-center row">
		<div class="col funding baseline">
			<p>Rosenpass received funding and support through the <a href="https://prototypefund.de/en/project/post-quantum-vpn-mit-minimalen-privilegien/">ProtoType Fund's 14th round to reduce the privileges needed by the Rosenpass tool</a>. The ProtoType Fund is a project of the <a href="https://okfn.de/en/">Open Knowledge Foundation Germany</a>, funded by the <a href="https://www.bmbf.de/en/index.html">Federal Ministry of Education and Research (BMBF).</a></p>
		</div>
		<div class="col funding baseline">
			<p>Rosenpass is also funded through NLNet's <a href="https://NLnet.nl/assure">NGI Assure</a> Fund, with financial support from the European Commission's <a href="https://ngi.eu">Next Generation Internet</a> programme, under the aegis of DG Communications Networks, Content and Technology. Funding has been provided for <a href="https://nlnet.nl/project/Rosenpass/">the initial Rosenpass project</a> and <a href="https://nlnet.nl/project/Rosenpass-API/">improvements to the Rosenpass API.</a></p>
		</div>
	</div>
</div>
{{< /blocks/section >}}

{{< blocks/lead color="dark" >}}
### Contact
{{< /blocks/lead >}}
{{< blocks/section color="white" >}}
<div class="container">
	<div class="row justify-content-center">
		<p class="contact-blerb col-xs-12 col-md-10">We are happy to answer any enquiries via the methods listed below. Please note that we are a free and independent group of developers and researchers with limited administrative resources. We endeavour to respond promptly to all enquiries.</p>
	</div>
	<div class="row contact justify-content-center">
		<div class="col col-md-5 col-sm-12 text-center">
			<div class="fa-regular fa-envelope fa-2xl align-bottom contact-icon"></div>
			<h4>Please direct email inquiries as follows:</h4>
			<div class="contact-box">
				<h5>General inquiries</h5>
				
				<a href="mailto:info@rosenpass.eu">info@rosenpass.eu</a> (<a href="/keys/info@rosenpass.eu.pub">OpenPGP key</a>)
				
				<h5>Security issues and bug reports</h5>
				
				<a href="mailto:security@rosenpass.eu">security@rosenpass.eu</a> (<a href="/keys/security@rosenpass.eu.pub">OpenPGP key</a>)
				
				<h5>Report other problems and ask for support</h5>
				
				<a href="mailto:support@rosenpass.eu">support@rosenpass.eu</a> (<a href="/keys/support@rosenpass.eu.pub">OpenPGP key</a>)
				
				<h5>Press contact and interview requests</h5>
				
				<p><a href="mailto:press@rosenpass.eu">press@rosenpass.eu</a> (<a href="/keys/press@rosenpass.eu.pub">OpenPGP key</a>)</p>
			</div>
		</div>

		<div class="col col-md-5 col-sm-12 text-center">
			<i class="fa-regular fa-comments fa-2xl align-bottom contact-icon"></i>
			<h4>Socials:</h4>
			<div class="contact-box">
					<h5> Follow us on Mastodon:</h5>
					<p>
						<a href="https://chaos.social/@rosenpass" target="_blank">
							<div class="row social-container">
								<i class="fa-brands fa-mastodon fa-2xl mastodon"></i>
								<p>The Rosenpass Project is on Mastodon</p>
							</div>
						</a> 
					</p>
					
				<h5 >We maintain a <a href="https://matrix.org/">Matrix</a> chatroom for informal queries, development and use questions, and as a broad point of contact:</h5>
				<p>
					<a href="https://matrix.to/#/#rosenpass:matrix.org">
						<div class="row social-container">
							<img src="/icons/Matrix.svg" class="social-svg matrix">
							<p>Click here to join the Rosenpass room on Matrix</p>
						</div>
					</a>
				</p>
			</div>	
		</div>
	</div>
</div>
{{< /blocks/section >}}
