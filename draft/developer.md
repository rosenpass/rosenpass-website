# Developer

Rosenpass implements a post-quantum-secure key exchange in the spirit of a Noise protocol. The motivating use case is integrating with the WireGuard VPN: In this mode, the key generated by Rosenpass is supplied to WireGuard as its pre-shared symmetric key (PSK). This results in a WireGuard VPN connection with hybrid post-quantum security.

While Rosenpass is designed with WireGuard in mind, it can be used as a stand-alone tool to exchange keys. Using this mode, it can be used to secure other protocols against attacks from quantum computers, given that they offer using a PSK, and that a secure PSK is sufficient for security of the protocol. To use this mode, the `rosenpass` binary must be used together with the `outfile <FILE>` parameter. Then, Rosenpass will write a key to the given file every two minutes, and print a message on standard out to notify the user or the calling script that the key has changed.

The implementation is written in Rust but uses libsodium and liboqs -- both of which are C libraries. This does not result in pretty code everywhere, but enables some advanced security features such as using libsodium’s `sodium_malloc`. We use a couple of techniques to make sure the code is secure: We use variable colouring (gating use of a secret value through a `.secret()` method), and the code zeroizes all key material.