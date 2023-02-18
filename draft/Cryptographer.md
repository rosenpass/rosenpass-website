# Cryptographer


Rosenpass protocol provides a post-quantum-secure authenticated key exchange, based on the work “Post-quantum WireGuard” (PQWG) by Hülsing, Ning, Schwabe, Weber, and Zimmermann [^pqwg]. Apart from some tweaks to the protocol internals, we provide security against what we call _state disruption attacks_ as a major contribution.

Both the classic WireGuard protocol (WG) and PQWG rely on a timestamp to protect against replay of the first protocol message. By setting the system time to a future date, an attacker can trick the initiator into generating a kill-packet that can be used to inhibit future handshakes without special access; this renders the initiator’s static key pair practically useless. Requiring the ability to modify the system time is a realistic assumption due to the use of the insecure NTP protocol on many systems, as described in [WireGuard CVE-2021-46873](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-46873).

Instead of attempting to protect against replay of the first protocol message, Rosenpass uses a stateless responder, so replay of the first message leads to no attack. To achieve this, we move the responder state into an encrypted cookie and have the responder include it with their message. The initiator returns this cookie in their reply so the responder can restore it before processing the reply.

In practice, Rosenpass is meant to be used together with WireGuard to achieve hybrid post-quantum security. In this scenario, WireGuard is still used as the main VPN protocol for transporting data while Rosenpass runs on the side and supplies the WireGuard implementation with keys to be used as the pre-shared key (PSK) during its handshake. Just like WireGuard, Rosenpass executes a new handshake every two minutes.

A cryptographic proof of security is work in progress. At this time, we provide a symbolic analysis of the protocol using ProVerif and a practical implementation of the protocol in the Rust programming language. The implementation uses cryptographic primitives from liboqs [^liboqs] and libsodium [^libsodium].

## References

[^wg]: Jason A. Donenfeld. WireGuard: Next Generation Kernel Network Tunnel. NDSS 2017
```
@inproceedings{DBLP:conf/ndss/Donenfeld17,
  author    = {Jason A. Donenfeld},
  title     = {WireGuard: Next Generation Kernel Network Tunnel},
  booktitle = {24th Annual Network and Distributed System Security Symposium, {NDSS}
               2017, San Diego, California, USA, February 26 - March 1, 2017},
  publisher = {The Internet Society},
  year      = {2017},
  url       = {https://www.ndss-symposium.org/ndss2017/ndss-2017-programme/wireguard-next-generation-kernel-network-tunnel/},
  timestamp = {Mon, 01 Feb 2021 08:42:15 +0100},
  biburl    = {https://dblp.org/rec/conf/ndss/Donenfeld17.bib},
  bibsource = {dblp computer science bibliography, https://dblp.org}
}
```

[^pqwg]: Andreas Hülsing, Kai-Chun Ning, Peter Schwabe, Florian Weber, and Philip R. Zimmermann. Post-quantum WireGuard. https://eprint.iacr.org/2020/379
```
@inproceedings{DBLP:conf/sp/HulsingNSWZ21,
  author    = {Andreas H{\"{u}}lsing and
               Kai{-}Chun Ning and
               Peter Schwabe and
               Florian Weber and
               Philip R. Zimmermann},
  title     = {Post-quantum WireGuard},
  booktitle = {42nd {IEEE} Symposium on Security and Privacy, {SP} 2021, San Francisco,
               CA, USA, 24-27 May 2021},
  pages     = {304--321},
  publisher = {{IEEE}},
  year      = {2021},
  url       = {https://doi.org/10.1109/SP40001.2021.00030},
  doi       = {10.1109/SP40001.2021.00030},
  timestamp = {Mon, 03 Jan 2022 22:27:45 +0100},
  biburl    = {https://dblp.org/rec/conf/sp/HulsingNSWZ21.bib},
  bibsource = {dblp computer science bibliography, https://dblp.org}
}
```

[^liboqs]: Douglas Stebila, Michele Mosca. Post-quantum key exchange for the Internet and the Open Quantum Safe project. In Roberto Avanzi, Howard Heys, editors, Selected Areas in Cryptography (SAC) 2016, LNCS, vol. 10532, pp. 1–24. Springer, October 2017. https://openquantumsafe.org
https://eprint.iacr.org/2016/1017
```
@inproceedings{DBLP:conf/sacrypt/StebilaM16,
  author    = {Douglas Stebila and
               Michele Mosca},
  editor    = {Roberto Avanzi and
               Howard M. Heys},
  title     = {Post-quantum Key Exchange for the Internet and the Open Quantum Safe
               Project},
  booktitle = {Selected Areas in Cryptography - {SAC} 2016 - 23rd International Conference,
               St. John's, NL, Canada, August 10-12, 2016, Revised Selected Papers},
  series    = {Lecture Notes in Computer Science},
  volume    = {10532},
  pages     = {14--37},
  publisher = {Springer},
  year      = {2016},
  url       = {https://doi.org/10.1007/978-3-319-69453-5\_2},
  doi       = {10.1007/978-3-319-69453-5\_2},
  timestamp = {Tue, 14 May 2019 10:00:38 +0200},
  biburl    = {https://dblp.org/rec/conf/sacrypt/StebilaM16.bib},
  bibsource = {dblp computer science bibliography, https://dblp.org}
}
```



[^libsodium]: https://doc.libsodium.org/


###  Reference

https://eprint.iacr.org/2020/379.pdf 


