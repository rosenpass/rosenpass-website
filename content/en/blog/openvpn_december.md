---
title: "Rosenpass with OpenVPN"
linkTitle: "Rosenpass with OpenVPN"
description: "Creating a Hybrid Post-Quantum-Secure VPN with Rosenpass and OpenSSL"
author: "Benjamin Lipp"
date: 2024-12-20
blogpost: "true"
shortBlerb: "Using Rosenpass with OpenVPN"
---


# Rosenpass with OpenVPN -- Creating a Hybrid Post-Quantum-Secure VPN

## Introduction

Rosenpass’ founding use case is the creation of a hybrid post-quantum-secure VPN tunnel together with WireGuard. However, we built the Rosenpass protocol and the Rosenpass tool such that they can also be used to help create post-quantum-secure systems in other contexts. To facilitate this, Rosenpass provides an option to export its shared secret to an output file.

In this tutorial blog post, we demonstrate how to add post-quantum security to OpenVPN using Rosenpass' `outfile` option. OpenVPN is a widely used VPN software available under a free and open source license. The OpenVPN protocol is based on TLS, and the implementation uses the OpenSSL library. In a previous blog post, we have demonstrated [how to add post-quantum security to TLS using OpenSSL](/blog/tlsrosenpass_july/), also using the `outfile` option. For this work, we are not changing OpenVPN's usage of OpenSSL. Instead, we use a higher-level mechanism that OpenVPN offers to additionally encrypt all TLS messages.

## Challenges When Adding Post-Quantum Security

I would say the following are the main two challenges when endevoring to hybridize an application using Rosenpass:

1. The cryptographic protocol development challenge. This is about figuring out _where_ and _how_ a post-quantum-secure pre-shared key can be inserted into a protocol such that it becomes hyprid post-quantum secure.
2. The cryptographic engineering challenge. Rosenpass provides a 32-byte shared secret, written to a text file in base64 encoding. The target application might expect a different format, a different key length, or even a different number of keys.

## Solving the 1st Challenge: OpenVPN's Options tls-crypt and tls-crypt-v2

OpenVPN provides the configuration options `tls-crypt` and `tls-crypt-v2` that allow to specify symmetric key material with which the TLS control channel messages then get encrypted as an additional security layer. The OpenVPN man page advertises this feature by listing multiple security and privacy goals. Post-quantum security is one of them, which is a great sign for a potential use case for Rosenpass:

> Encrypting (and authenticating) control channel packets:
> * provides more privacy by hiding the certificate used for the TLS connection,
> * makes it harder to identify OpenVPN traffic as such,
> * provides “poor-man's” post-quantum security, against attackers who will never know the pre-shared key (i.e. no forward secrecy).

When using `tls-crypt`, all peers in an OpenVPN network, e.g., all clients and the server, use the _same_ key material. In this case, it is assumed that clients receive this pre-shared key in some secure way, e.g., together with the OpenVPN configuration.

The `tls-crypt-v2` option was introduced later and allows to use individual key material per client. A fresh random “client key” can be generated at the discretion of each client, and is sent to the server upon initiating a new OpenVPN connection. Sending this key in the clear would defeat the purpose of the construction, which is why the “server key” enters the scene. It is assumed that this symmetric pre-shared key is distributed to the clients in some secure way. The client key is encrypted using the server key before sending it during connection initiation.

We'd like to refer to the OpenVPN man page for a discussion of how much data gets encrypted under one client or server key in `tls-crypt` vs. `tls-crypt-v2`. In summary, `tls-crypt-v2` allows for a longer lifetime of the pre-shared keys, because less data gets encrypted under one key.

In both `tls-crypt` and `tls-crypt-v2`, there is the assumption of a pre-shared key being distributed in some secure way. This assumption can be implemented by using Rosenpass, without diluting any of OpenVPN's three motivations for `tls-crypt(-v2)`, because the Rosenpass shared secret is post-quantum secure!

We decided to write this tutorial using `tls-crypt-v2`, because having individual client keys
provides more security and flexibility. Adapting our example to `tls-crypt` should not be too much work if needed. In `tls-crypt-v2`, the server key is the one that is assumed to be distributed in some way to the server and the client(s), so this is the pre-shared key that we will derive from the Rosenpass shared secret.

References for this section:
* [OpenVPN documentation on `tls-crypt-v2`](https://github.com/OpenVPN/openvpn/blob/master/doc/tls-crypt-v2.txt)
* [openvpn (8) man page](https://manpages.ubuntu.com/manpages/noble/en/man8/openvpn.8.html)

## Solving the 2nd Challenge: Encoding the OpenVPN Server Key from Rosenpass

According to the [OpenVPN documentation on `tls-crypt-v2`](https://github.com/OpenVPN/openvpn/blob/master/doc/tls-crypt-v2.txt), the server key

> […] contains 2 512-bit keys, of which we use:
> * the first 256 bits of key 1 as AES-256-CTR encryption key ``Ke``
> * the first 256 bits of key 2 as HMAC-SHA-256 authentication key ``Ka``.

Thus, we need to derive two 32-byte keys from the 32-byte Rosenpass shared secret. We will do so using a key derivation function, and use different labels for the `Ke` and the `Ka` key, respectively. This way, the two keys are independent from each other, cryptographically speaking.

In pseudo-code, the key derivation that we want to do is as follows:
```
Ke = HKDF(salt="", key=PSK_HEX, label="openvpn_tls_crypt_v2_server_key_encryption",     length=32)
Ka = HKDF(salt="", key=PSK_HEX, label="openvpn_tls_crypt_v2_server_key_authentication", length=32)
```
The parameter `key` is often called `ikm` for “input key material”, and `label` is often called `info`.

The second halves of the two 512-bit keys within the server key do not seem to have a designated use. To make sure that we do nothing with our Rosenpass key material that we do not know about, we will just choose these parts at random. Client and server will thus have different second halves, with overwhelming probability. If OpenVPN uses these bits without having documented it, the connection should fail because the two peers use different values. In our tests we did not run into such a situation.

To summarize, the server key is constructed as follows:

```
server key = Ke || 32-byte randomness || Ka || 32-byte randomness
```

Finally, the server key needs to be PEM-encoded, and judging from the output of an example call to `openvpn --genkey tls-crypt-v2-server`, the label is `OpenVPN tls-crypt-v2 server key`.

We wrote an implementation of this tutorial's proof-of-concept in Bash. The scripts to setup client and server and to run them [are available in a Git repository](https://github.com/rosenpass/openvpn-tutorial). In the following, we describe the part of the Bash scripts that can be used to do the cryptography and encoding operations outlined above. Prior to these commands, the script ran Rosenpass and waited for the first handshake to finish. The name of the file in which Rosenpass writes its shared secret is stored in the variable `$PSK_FILE`. We convert the Rosenpass shared secret to a hex encoding:
```bash
PSK_HEX=$(cat $PSK_FILE | base64 -d | od -t x1 -An | tr -d ' \n')
```

To implement the key derivation, we use OpenSSLs command-line tools, which take in the input key material in hex encoding, and write the keys `Ke` and `Ka` to the files `enc.bin` and `auth.bin`, respectively:

```bash
openssl kdf -binary -out enc.bin -keylen 32 -kdfopt digest:SHA2-256 -kdfopt key:${PSK_HEX} -kdfopt info:openvpn_tls_crypt_v2_server_key_encryption HKDF
openssl kdf -binary -out auth.bin -keylen 32 -kdfopt digest:SHA2-256 -kdfopt key:${PSK_HEX} -kdfopt info:openvpn_tls_crypt_v2_server_key_authentication HKDF
```

OpenSSL can generate the two 32-byte random values for us, too:
```bash
openssl rand -out rand1.bin 32
openssl rand -out rand2.bin 32
```

Finally, we concatenate the four keys to the server key and PEM-encode it:

```bash
cat enc.bin rand1.bin auth.bin rand2.bin > rp-server-v2.bin

echo "-----BEGIN OpenVPN tls-crypt-v2 server key-----" > rp-server-v2.key
base64 --wrap=64 rp-server-v2.bin >> rp-server-v2.key
echo "-----END OpenVPN tls-crypt-v2 server key-----" >> rp-server-v2.key
```

OpenVPN complains if the server key file is readable too broadly, so we change the file permissions:
```bash
chmod 600 rp-server-v2.key
```

In this section, we learned how to derive an OpenVPN `tls-crypt-v2` server key from a Rosenpass shared secret. Also a show case of how much cryptography can be done on the command line by using the OpenSSL tools! Pay attention, however, because the hex-encoded Rosenpass shared secret `${PSK_HEX}` will be visible in the process list on the machine where the command is executed. We already ran into this problem in the [Rosenpass with TLS blog post](/blog/tlsrosenpass_july/#indicating-the-psk-in-plaintext-on-the-command-line-is-a-security-issue). Thus, this Bash implementation is not ready for production use.

References for this section:
* [OpenVPN documentation on `tls-crypt-v2`](https://github.com/OpenVPN/openvpn/blob/master/doc/tls-crypt-v2.txt)
* [openvpn (8) man page](https://manpages.ubuntu.com/manpages/noble/en/man8/openvpn.8.html)
* [openssl-kdf (1) man page](https://manpages.ubuntu.com/manpages/noble/en/man1/openssl-kdf.1ssl.html)
* [openssl-rand (1) man page](https://manpages.ubuntu.com/manpages/noble/en/man1/openssl-rand.1ssl.html)


## Putting it All Together

In the [Git repository complementing this tutorial blog post](https://github.com/rosenpass/openvpn-tutorial), we provide the following Bash scripts:
* `setup-server.sh` and `setup-client.sh` that generate Rosenpass keypairs, TLS certificates and public parameters for OpenVPN,
* `server.sh` and `client.sh` that start the Rosenpass and OpenVPN connections on the respective sides, and
* `common.sh` that is included by `server.sh` and `client.sh` to take care of deriving the OpenVPN tls-crypt-v2 server key from the Rosenpass shared secret, with the code described in the previous section.

### The Rosenpass Connection

We work based on the following network assumptions for the test setup, that you can adapt for your own tests:
* the client has IP address `192.168.2.160`,
* the server has IP address `192.168.2.215`, and the client can resolve the hostname `server` to this IP address.

This is reflected in two Rosenpass peer configuration files `rp1` and `rp2` in the repository. They are written such that the two peers are talking to each other, respectively. Each peer reads its public key and secret key from files `public_key` and `secret_key`, and writes the Rosenpass shared key into a `key_out` file. After a successful key exchange, the files `rp1-key-out` and `rp2-key-out` are going to be exactly equal. This key file is what the cryptographic operations above are processing.

The server's config file is `rp1`:
```
public_key = "rp1-public-key"
secret_key = "rp1-secret-key"
listen = ["192.168.2.215:9998"]
verbosity = "Quiet"

[[peers]]
public_key = "rp2-public-key"
endpoint = "192.168.2.160:9999"
key_out = "rp1-key-out"
```

And the client's config file is `rp2`:
```
public_key = "rp2-public-key"
secret_key = "rp2-secret-key"
listen = ["192.168.2.160:9999"]
verbosity = "Quiet"

[[peers]]
public_key = "rp1-public-key"
endpoint = "192.168.2.215:9998"
key_out = "rp2-key-out"
```

As part of the setup scripts, the keypair are generated using the following two commands:

```bash
rosenpass gen-keys rp1
rosenpass gen-keys rp2
```

Client and server both start Rosenpass as part of the `common.sh` script with one of the following commands:

```bash
sudo rosenpass exchange-config rp1
sudo rosenpass exchange-config rp2
```

The script waits until the file containing the Rosenpass shared secret is created, respectively. It then stops the Rosenpass process, and continues to process the key file as described above. The next step then is to start OpenVPN with the Rosenpass-provided tls-crypt-v2 server key.

### The OpenVPN Connection

In case you are not yet familiar with OpenVPN, it can be useful to read through the simple configuration examples in the [openvpn-examples (5) man page](https://manpages.ubuntu.com/manpages/noble/en/man5/openvpn-examples.5.html), because we build upon them in the following. To keep things simple enough, we do not configure a certificate authority, but validate the client and server certificates by indicating their fingerprints, respectively.

In the OpenVPN network, we assign server and client the IP addresses `10.4.0.1` and `10.4.0.2`, respectively. To test the setup, we simply ping these IP addresses to see if the client can reach the server's internal IP address, and vice versa. This is sufficient to judge wether the `tls-crypt-v2` connection works, with the advantage that we do not have to spend time configuring packet routing correctly.

As part of the setup Bash scripts, client and server generate TLS certificates and display their certificate's fingerprint, respectively. If you run these scripts yourself, you have to copy-paste these fingerprints into the correct place in `client.sh` and `server.sh`.

On the client's side, `setup-client.sh` just creates a certificate:
```bash
openssl req -x509 -newkey ec:<(openssl ecparam -name secp521r1) -keyout client.key -out client.crt -nodes -sha256 -days 365 -subj '/CN=client'
openssl x509 -fingerprint -sha256 -in client.crt -noout
```

On the server's side, `setup-server.sh` also generates Diffie-Hellman public parameters:
```bash
openssl req -x509 -newkey ec:<(openssl ecparam -name secp521r1) -keyout server.key -out server.crt -nodes -sha256 -days 365 -subj '/CN=server'
openssl x509 -fingerprint -sha256 -in server.crt -noout
openssl dhparam -out dh2048.pem 2048
```

With the setup being done, we can go on to starting the OpenVPN endpoints. The server is started by the following `openvpn` command which we explain a bit more just below:

```bash
sudo openvpn --ifconfig 10.4.0.1 10.4.0.2 --tls-server --dev tun1 --dh dh2048.pem --cert server.crt --key server.key --cipher AES-256-GCM --peer-fingerprint "96:93:87:7A:1C:31:0B:7F:3F:20:27:9C:DC:85:86:3F:4F:CC:A2:74:EA:0D:2B:FE:0A:65:A7:D4:D1:20:91:36" --tls-crypt-v2 rp-server-v2.key --verb 2
```

The parameter `--ifconfig` indicates the IP address assigned to this endpoint, and on the second position the IP address of the peer. The parameter `--tls-crypt-v2` activates to use client-specific tls-crypt keys and provides the pre-shared key, in this case the server key produced from the Rosenpass shared secret. The OpenVPN server is now running. In the server command, we additionally use `--verb 2` to slightly increase verbosity level. This allows us to see in the output that `tls-crypt-v2` is used.

Going over to the client's side, the client Bash script has also computed the OpenVPN `tls-crypt-v2` server key. It can now generate a fresh `tls-crypt-v2` client key:
```bash
openvpn --tls-crypt-v2 rp-server-v2.key --genkey tls-crypt-v2-client client-v2.key
```
This command needs the server key as parameter because the client key is encrypted under it, as preparation for it being sent to the server upon initiating the connection. The file `client-v2.key` contains both the plain-text pre-shared key, and its encryption under the server key. This is why a client key file is larger than a server key file.

The OpenVPN client is now ready to be started:
```bash
sudo openvpn --remote server --tls-client --dev tun1 --ifconfig 10.4.0.2 10.4.0.1 --cipher AES-256-GCM --cert client.crt --key client.key --peer-fingerprint "15:41:62:46:C8:78:A4:A5:7B:CB:1A:7D:FF:72:4E:D6:64:B7:CC:50:A7:97:25:DF:BA:72:E3:81:71:41:DE:2E" --tls-crypt-v2 client-v2.key
```
This command looks very similar to the server one, just that it is a `--tls-client`, the IP addresses are swapped, and of course the appropriate client certificate files, and the server fingerprint are used.

In the terminals that started the OpenVPN peers, you should see an output similar to the following:

```bash
$ ./client.sh
Starting Rosenpass with PID 1840365
output-key peer SBwA7bPwhhpBIxsMxrH59WSBwBDl+UKjOBVYoQrnNvY= key-file "rp2-key-out" exchanged
PSK file has been created, killing Rosenpass process
2024-12-20 13:07:34 Using certificate fingerprint to verify peer (no CA option set). 
2024-12-20 13:07:34 OpenVPN 2.6.12 x86_64-pc-linux-gnu [SSL (OpenSSL)] [LZO] [LZ4] [EPOLL] [PKCS11] [MH/PKTINFO] [AEAD] [DCO]
2024-12-20 13:07:34 library versions: OpenSSL 3.0.13 30 Jan 2024, LZO 2.10
2024-12-20 13:07:34 DCO version: N/A
2024-12-20 13:07:34 TUN/TAP device tun1 opened
2024-12-20 13:07:34 net_iface_mtu_set: mtu 1500 for tun1
2024-12-20 13:07:34 net_iface_up: set tun1 up
2024-12-20 13:07:34 net_addr_ptp_v4_add: 10.4.0.2 peer 10.4.0.1 dev tun1
2024-12-20 13:07:34 TCP/UDP: Preserving recently used remote address: [AF_INET]192.168.2.215:1194
2024-12-20 13:07:34 UDPv4 link local (bound): [AF_INET][undef]:1194
2024-12-20 13:07:34 UDPv4 link remote: [AF_INET]192.168.2.215:1194
2024-12-20 13:07:34 peer info: IV_CIPHERS=AES-256-GCM:AES-128-GCM:CHACHA20-POLY1305
2024-12-20 13:07:34 peer info: IV_PROTO=746
2024-12-20 13:07:34 [server] Peer Connection Initiated with [AF_INET]192.168.2.215:1194
2024-12-20 13:07:36 Initialization Sequence Completed
```

And on the server's side:
```bash
$ ./server.sh
Starting Rosenpass with PID 18255
output-key peer Kijnd75aYrWjKN/f18m9S0klo49p5RVUcXQ197KzMSg= key-file "rp1-key-out" exchanged
PSK file has been created, killing Rosenpass process
2024-12-20 12:07:34 Using certificate fingerprint to verify peer (no CA option set). 
2024-12-20 12:07:34 OpenVPN 2.6.12 x86_64-pc-linux-gnu [SSL (OpenSSL)] [LZO] [LZ4] [EPOLL] [PKCS11] [MH/PKTINFO] [AEAD] [DCO]
2024-12-20 12:07:34 library versions: OpenSSL 3.3.1 4 Jun 2024, LZO 2.10
2024-12-20 12:07:34 DCO version: N/A
2024-12-20 12:07:34 TUN/TAP device tun1 opened
2024-12-20 12:07:34 net_iface_mtu_set: mtu 1500 for tun1
2024-12-20 12:07:34 net_iface_up: set tun1 up
2024-12-20 12:07:34 net_addr_ptp_v4_add: 10.4.0.1 peer 10.4.0.2 dev tun1
2024-12-20 12:07:34 Could not determine IPv4/IPv6 protocol. Using AF_INET
2024-12-20 12:07:34 UDPv4 link local (bound): [AF_INET][undef]:1194
2024-12-20 12:07:34 UDPv4 link remote: [AF_UNSPEC]
2024-12-20 12:07:34 Control Channel: using tls-crypt-v2 key
2024-12-20 12:07:34 VERIFY OK: depth=0, CN=client
2024-12-20 12:07:34 VERIFY OK: depth=0, CN=client
2024-12-20 12:07:34 peer info: IV_CIPHERS=AES-256-GCM:AES-128-GCM:CHACHA20-POLY1305
2024-12-20 12:07:34 peer info: IV_PROTO=746
2024-12-20 12:07:34 Control Channel: TLSv1.3, cipher TLSv1.3 TLS_AES_256_GCM_SHA384, peer certificate: 521 bits ECsecp521r1, signature: ecdsa-with-SHA256, peer temporary key: 253 bits X25519
2024-12-20 12:07:34 [client] Peer Connection Initiated with [AF_INET]192.168.2.160:1194
2024-12-20 12:07:35 Initialization Sequence Completed
2024-12-20 12:07:35 Data Channel: cipher 'AES-256-GCM', peer-id: 0
```

Especially notice the line confirming the usage of `tls-crypt-v2`:

```bash
2024-12-20 12:07:34 Control Channel: using tls-crypt-v2 key
```

With the OpenVPN processes reporting a completed initialization sequence, we can go on to test the connection. On the client's side, we can open a new terminal and ping the server:
```bash
ping 10.4.0.1
```
And vice-versa on the server, we can ping the client:
```bash
ping 10.4.0.2
```

If everything works, you should see the pings getting through, and can stop both the pings and the client and server with `Ctrl+C`.

References for this section:
* [openvpn-examples (5) man page](https://manpages.ubuntu.com/manpages/noble/en/man5/openvpn-examples.5.html)

## Conclusion

This ends the tutorial about using Rosenpass to add post-quantum security in a hybrid way to OpenVPN. A related project is an [integration of post-quantum TLS into OpenVPN](https://github.com/open-quantum-safe/oqs-demos/tree/main/openvpn). The OpenVPN build in that project relies solely on post-quantum cryptography and thus, no hybrid security. With our tutorial, the OpenVPN connection remains secure if either the classic cryptography or the post-quantum cryptography are secure.

This work has been funded by the [Sovereign Tech Agency](https://www.sovereign.tech).

We would love to hear from you if you have questions or comments, and also if you would like to explore working together on Rosenpass-related projects. Feel free to [reach out to us](/contributors/)!