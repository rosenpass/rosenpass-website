---
title: "Rosenpass with TLS"
linkTitle: "Rosenpass with TLS"
description: "Creating a Hybrid Post-Quantum-Secure TLS Channel with Rosenpass and OpenSSL"
author: "Benjamin Lipp"
date: 2024-07-29
---

Although Rosenpass' primary use case is the creation of a hybrid post-quantum-secure VPN Channel for WireGuard, we have always sought to expand its utility to help create post-quantum-secure systems in other applications. In this case, by applying the principles used for its combination with WireGuard, we sought to produce a proof-of-concept demonstrating such its application to Transport Layer Security (TLS).

To achieve this, we used the popular OpenSSL library, and its tools `s-client` and `s_server` , to attempt to provide hybrid post-quantum security for TLS versions 1.2 and 1.3, which are the two versions currently in use online.

Typically, Rosenpass achieves post-quantum hybrid security with WireGuard by injecting external post-quantum-secure keys, from the Rosenpass tool, into its key derivation. This is called a pre-shared key (PSK), which is a symmetric key that both involved parties have to agree upon ahead of time.

As with WireGuard, both TLS 1.2 and 1.3 allow for the injection of an external pre-shared key as part of its key exchange. While the processes differ between the versions, we were able to specify a PSK for both versions of the protocol using the same command line interface.

### On Using Certificates

TLS relies on certificates, provided by an authority, to establish authentication. Most commonly, a web server will authenticate itself to a client web browser through the provision of a signed certificate from a trusted certification authority. Interestingly, TLS also supports client certificates in the other direction, allowing for a client to authenticate itself to a server. This is not commonly used.

Another approach is to use a pre-shared key to allow two parties to authenticate each other independently of a certification authority. If a symmetric secret is successfully exchanged, there is no need for a public-key infrastructure (PKI) to solve the problem of key distribution.

Thus, at a glance, it would appear redundant to use certificates in addition to a PSK ciphersuite with TLS. However, that redundancy is an end in of itself, as it is what hybrid security relies on, as we do not yet want to rely soley on post-quantum-secure PSKs that have not seen the same degree of real-world stress testing as classical cyrptographic solutions. Forced to choose between classical, albeit non-post-quantum-secure, crytography and post-quantum cryptography, it would be prudent to choose the better analysed cryptography for auythentication, especially given that quantum computers are not currently known to be in use. Fortunately, using hybrid schemes allow us to rely on the strengths of both methods.

Unfortunately, the TLS standards do not support combining certificates with PSK ciphersuites, as they were written without such a hybrid use case in mind. Indeed, OpenSSL s_client and s_server do not support using both certificates and a PSK. In testing, when we specified a certificate on the command line, the s_server proceeded to ignore our specified PSK. We could see this by giving the client and the server non-matching PSKs and PSK identities without causing the channel establishment to fail.


## Tutorial Overview

For this tutorial, we used two of the OpenSSL project's command line tools, `s_client` and `s_server`, that respectively implement a TLS client and server. The tools' man pages did not reveal to us what the `s` stands for. Is it “simple”? Or just a shorthand for the old “SSL”? In any case, `s_client`'s man page claims, “[i]t is a _very_ useful diagnostic tool for SSL servers”, so how could we resist? Regardless, one of this tutorial's co-authors has indeed already used `s_client` many times to test and debug TLS connections.

In the following sections, we build up the final show case step-by-step, retracing the steps we took:
* As a first step, we showed how to use OpenSSL's `s_client` and `s_server` to establish a TLS channel using a dummy pre-shared key.
* Then, we demonstrated the set up of two Rosenpass peers on localhost, having them exchange a post-quantum-secure key.
* As a last step, we plugged the first two steps together and used `s_client` and `s_server` to establish a TLS channel using a key exchanged by Rosenpass as pre-shared key.
* Finally, we include an informal discusssion of the cryptographic security of this approach.
* The conclusion contains an overview the issues we encountered on the way, as well as a discussion on the direction of future potential work.

All commands, config files, and scripts described in this tutorial are available in the [repository rosenpass/openssl-tutorial](https://github.com/rosenpass/openssl-tutorial).

### 1. Simple Example with a Dummy Pre-Shared Key


We started with the simple example of employing a dummy pre-shared key. We used two terminals on the same machine. In one, we executed the following command to start the server, which is explained directly below:

```bash
$ openssl s_server -accept localhost:4433 -www -naccept 1 -trace -nocert -psk 1a2b3c4d5e6f -psk_identity rosenpass
```

We told the server to accept connections on port 4433 on localhost (`-accept localhost:4433`). The `-www` parameter starts a simple HTTP server providing an HTML page with information about the TLS session. The client can request it by sending the `GET /` HTTP command. In our test case, we usually only ran each command once and then switched to another one, which is why the option `-naccept 1` is useful, which kills the server after one connection. We used `-trace` to display the TLS protocol messages received and sent by the server. This is not necessary for simple tests, however, we wanted to be able to explain what is going on based on this output.

And now for the cryptographically revelant parameters: As described above, we did not use certificates in our example (`-nocert`). The parameter `-psk` is used to provide a pre-shared key. Here, we just gave an unsecure short example key. TLS uses a so-called PSK identity bitstring to help the client and server communicate which PSK they use. In OpenSSL, it has a default value of `Client_identity`, and we set it to `rosenpass` using the `-psk_identity` parameter.

With OpenSSL version 3.0.10, this command displays the following to indicate that the server is listening for connections:
```bash
Using default temp DH parameters
ACCEPT
```
The first line gives an important security hint: the server is not sampling freshly random values for ephemeral Diffie-Hellman keys, but using pre-defined default values. This means you should not use the above commands for production use. If you need, look into the documentation of the `-dhparam` CLI option.


In the other terminal, we executed the following command for the client:

```bash
$ openssl s_client -connect localhost:4433 -psk 1a2b3c4d5e6f -psk_identity rosenpass
```

This command tells the client to connect to the port and server indicated above, and provide it with the same pre-shared key. The client produces a lot of output, giving details about the TLS channel, and then waiting for input that shall be sent on the channel:

```bash
CONNECTED(00000003)                                                                                                                                               
Can't use SSL_get_servername                                                                                                                                      
---                                                                                                                                                               
no peer certificate available                                                                                                                                     
---                                                                                                                                                               
No client certificate CA names sent                                                                                                                               
Server Temp Key: X25519, 253 bits                                                                                                                                 
---                                                                                                                                                               
SSL handshake has read 225 bytes and written 465 bytes                                                                                                            
Verification: OK                                                                                                                                                  
---                                                                                                                                                               
Reused, TLSv1.3, Cipher is TLS_CHACHA20_POLY1305_SHA256                                                                                                           
Secure Renegotiation IS NOT supported                                                                                                                             
Compression: NONE                                                                                                                                                 
Expansion: NONE                                                                                                                                                   
No ALPN negotiated                                                                                                                                                
Early data was not sent                                                                                                                                           
Verify return code: 0 (ok)                                                                                                                                        
---                                                                                                                                                               
---                                                                                                                                                               
Post-Handshake New Session Ticket arrived:                                                                                                                        
SSL-Session:                                                                                                                                                      
    Protocol  : TLSv1.3                                                                                                                                           
    Cipher    : TLS_CHACHA20_POLY1305_SHA256                                                                                                                      
    Session-ID: 3F45E9CD0E643A96B92BB0379DD656B2533ED1CF5419AAED4B42018121E95B89                                                                                  
    Session-ID-ctx:                                                                                                                                               
    Resumption PSK: 435E82BE9A44F9EFCB056B5D600A8C5D5400CD4F5C1571197F476CF8803CFD2D                                                                              
    PSK identity: None                                                                                                                                            
    PSK identity hint: None                                                                                                                                       
    SRP username: None                                                                                                                                            
    TLS session ticket lifetime hint: 304 (seconds)                                                                                                               
    TLS session ticket:                                                                                                                                           
    0000 - 25 36 db ec 3a b0 1b ae-09 f1 08 6e 3c 05 06 97   %6..:......n<...                                                                                     
    0010 - 62 01 2e 07 4a e9 65 91-90 31 29 77 95 12 34 70   b...J.e..1)w..4p                                                                                     
    0020 - 36 c2 da d5 3e 0c 3a bf-71 9e ea bc be 73 92 53   6...>.:.q....s.S                                                                                     
    0030 - 62 06 29 07 c0 8d 31 3e-6c c6 92 c6 f1 73 6c ac   b.)...1>l....sl.                                                                                     
    0040 - 58 b6 04 0f ae f9 7d e3-f5 50 78 d4 62 a0 09 ff   X.....}..Px.b...                                                                                     
    0050 - c9 78 7d 31 0b ef e3 10-07 e2 83 31 f1 c7 5c 2f   .x}1.......1..\/                                                                                     
    0060 - 68 8a 47 bc 27 50 01 59-cc 98 dc cd 39 04 9b 5d   h.G.'P.Y....9..]                                                                                     
    0070 - bd b6 bb c8 e2 95 57 fa-26 8c 0e ae 95 1f 83 48   ......W.&......H                                                                                     
    0080 - 27 c3 aa 07 c4 55 cb d0-1f ae 24 93 75 b8 27 cf   '....U....$.u.'.                                                                                     
    0090 - 80 ab 7a f9 95 4d 63 8b-40 ba 71 9e 3a aa c8 a3   ..z..Mc.@.q.:...                                                                                     
    00a0 - 42 13 d4 1f b0 0f 1d dd-d0 67 82 89 62 27 57 19   B........g..b'W.                                                                                     
    00b0 - 2d 32 f7 bd 84 57 c3 1b-79 50 75 87 cc 5e c9 49   -2...W..yPu..^.I                                                                                     
                                                                                                                                                                  
    Start Time: 1721301066                                                                                                                                        
    Timeout   : 304 (sec)                                                                                                                                         
    Verify return code: 1 (unspecified certificate verification error)                                                                                            
    Extended master secret: no                                                                                                                                    
    Max Early Data: 0                                                                                                                                             
---                                                                                                                                                               
read R BLOCK
```

We then inputted `GET /` and confirmed with `Enter` to request the server's status page via HTTP. The result was:


```bash
HTTP/1.0 200 ok
Content-type: text/html

<HTML><BODY BGCOLOR="#ffffff">
<pre>

s_server -accept localhost:4433 -www -nocert -psk 1a2b3c4d5e6f -psk_identity rosenpass -naccept 1 -trace 
Secure Renegotiation IS supported
Ciphers supported in s_server binary
TLSv1.3    :TLS_AES_256_GCM_SHA384    TLSv1.3    :TLS_CHACHA20_POLY1305_SHA256 
TLSv1.3    :TLS_AES_128_GCM_SHA256    TLSv1.2    :ECDHE-ECDSA-AES256-GCM-SHA384 
TLSv1.2    :ECDHE-RSA-AES256-GCM-SHA384 TLSv1.2    :DHE-RSA-AES256-GCM-SHA384 
TLSv1.2    :ECDHE-ECDSA-CHACHA20-POLY1305 TLSv1.2    :ECDHE-RSA-CHACHA20-POLY1305 
TLSv1.2    :DHE-RSA-CHACHA20-POLY1305 TLSv1.2    :ECDHE-ECDSA-AES128-GCM-SHA256 
TLSv1.2    :ECDHE-RSA-AES128-GCM-SHA256 TLSv1.2    :DHE-RSA-AES128-GCM-SHA256 
TLSv1.2    :ECDHE-ECDSA-AES256-SHA384 TLSv1.2    :ECDHE-RSA-AES256-SHA384   
TLSv1.2    :DHE-RSA-AES256-SHA256     TLSv1.2    :ECDHE-ECDSA-AES128-SHA256 
TLSv1.2    :ECDHE-RSA-AES128-SHA256   TLSv1.2    :DHE-RSA-AES128-SHA256     
TLSv1.0    :ECDHE-ECDSA-AES256-SHA    TLSv1.0    :ECDHE-RSA-AES256-SHA      
SSLv3      :DHE-RSA-AES256-SHA        TLSv1.0    :ECDHE-ECDSA-AES128-SHA    
TLSv1.0    :ECDHE-RSA-AES128-SHA      SSLv3      :DHE-RSA-AES128-SHA        
TLSv1.2    :RSA-PSK-AES256-GCM-SHA384 TLSv1.2    :DHE-PSK-AES256-GCM-SHA384 
TLSv1.2    :RSA-PSK-CHACHA20-POLY1305 TLSv1.2    :DHE-PSK-CHACHA20-POLY1305 
TLSv1.2    :ECDHE-PSK-CHACHA20-POLY1305 TLSv1.2    :AES256-GCM-SHA384         
TLSv1.2    :PSK-AES256-GCM-SHA384     TLSv1.2    :PSK-CHACHA20-POLY1305     
TLSv1.2    :RSA-PSK-AES128-GCM-SHA256 TLSv1.2    :DHE-PSK-AES128-GCM-SHA256 
TLSv1.2    :AES128-GCM-SHA256         TLSv1.2    :PSK-AES128-GCM-SHA256     
TLSv1.2    :AES256-SHA256             TLSv1.2    :AES128-SHA256             
TLSv1.0    :ECDHE-PSK-AES256-CBC-SHA384 TLSv1.0    :ECDHE-PSK-AES256-CBC-SHA  
SSLv3      :SRP-RSA-AES-256-CBC-SHA   SSLv3      :SRP-AES-256-CBC-SHA       
TLSv1.0    :RSA-PSK-AES256-CBC-SHA384 TLSv1.0    :DHE-PSK-AES256-CBC-SHA384 
SSLv3      :RSA-PSK-AES256-CBC-SHA    SSLv3      :DHE-PSK-AES256-CBC-SHA    
SSLv3      :AES256-SHA                TLSv1.0    :PSK-AES256-CBC-SHA384     
SSLv3      :PSK-AES256-CBC-SHA        TLSv1.0    :ECDHE-PSK-AES128-CBC-SHA256 
TLSv1.0    :ECDHE-PSK-AES128-CBC-SHA  SSLv3      :SRP-RSA-AES-128-CBC-SHA   
SSLv3      :SRP-AES-128-CBC-SHA       TLSv1.0    :RSA-PSK-AES128-CBC-SHA256 
TLSv1.0    :DHE-PSK-AES128-CBC-SHA256 SSLv3      :RSA-PSK-AES128-CBC-SHA    
SSLv3      :DHE-PSK-AES128-CBC-SHA    SSLv3      :AES128-SHA                
TLSv1.0    :PSK-AES128-CBC-SHA256     SSLv3      :PSK-AES128-CBC-SHA        
---
Ciphers common between both SSL end points:
TLS_AES_256_GCM_SHA384     TLS_CHACHA20_POLY1305_SHA256 TLS_AES_128_GCM_SHA256    
ECDHE-ECDSA-AES256-GCM-SHA384 ECDHE-RSA-AES256-GCM-SHA384 DHE-RSA-AES256-GCM-SHA384 
ECDHE-ECDSA-CHACHA20-POLY1305 ECDHE-RSA-CHACHA20-POLY1305 DHE-RSA-CHACHA20-POLY1305 
ECDHE-ECDSA-AES128-GCM-SHA256 ECDHE-RSA-AES128-GCM-SHA256 DHE-RSA-AES128-GCM-SHA256 
ECDHE-ECDSA-AES256-SHA384  ECDHE-RSA-AES256-SHA384    DHE-RSA-AES256-SHA256     
ECDHE-ECDSA-AES128-SHA256  ECDHE-RSA-AES128-SHA256    DHE-RSA-AES128-SHA256     
ECDHE-ECDSA-AES256-SHA     ECDHE-RSA-AES256-SHA       DHE-RSA-AES256-SHA        
ECDHE-ECDSA-AES128-SHA     ECDHE-RSA-AES128-SHA       DHE-RSA-AES128-SHA        
RSA-PSK-AES256-GCM-SHA384  DHE-PSK-AES256-GCM-SHA384  RSA-PSK-CHACHA20-POLY1305 
DHE-PSK-CHACHA20-POLY1305  ECDHE-PSK-CHACHA20-POLY1305 AES256-GCM-SHA384         
PSK-AES256-GCM-SHA384      PSK-CHACHA20-POLY1305      RSA-PSK-AES128-GCM-SHA256 
DHE-PSK-AES128-GCM-SHA256  AES128-GCM-SHA256          PSK-AES128-GCM-SHA256     
AES256-SHA256              AES128-SHA256              ECDHE-PSK-AES256-CBC-SHA384
ECDHE-PSK-AES256-CBC-SHA   RSA-PSK-AES256-CBC-SHA384  DHE-PSK-AES256-CBC-SHA384 
RSA-PSK-AES256-CBC-SHA     DHE-PSK-AES256-CBC-SHA     AES256-SHA                
PSK-AES256-CBC-SHA384      PSK-AES256-CBC-SHA         ECDHE-PSK-AES128-CBC-SHA256
ECDHE-PSK-AES128-CBC-SHA   RSA-PSK-AES128-CBC-SHA256  DHE-PSK-AES128-CBC-SHA256 
RSA-PSK-AES128-CBC-SHA     DHE-PSK-AES128-CBC-SHA     AES128-SHA                
PSK-AES128-CBC-SHA256      PSK-AES128-CBC-SHA
Supported groups: x25519:secp256r1:x448:secp521r1:secp384r1:ffdhe2048:ffdhe3072:ffdhe4096:ffdhe6144:ffdhe8192
Shared groups: x25519:secp256r1:x448:secp521r1:secp384r1:ffdhe2048:ffdhe3072:ffdhe4096:ffdhe6144:ffdhe8192
---
Reused, TLSv1.3, Cipher is TLS_CHACHA20_POLY1305_SHA256
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_CHACHA20_POLY1305_SHA256
    Session-ID: EC67D9D937FDC27A2F0E35D008787E510414B6DD66D92C25D5AC01C4D1946357
    Session-ID-ctx: 01000000
    Resumption PSK: 435E82BE9A44F9EFCB056B5D600A8C5D5400CD4F5C1571197F476CF8803CFD2D
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    Start Time: 1721301066
    Timeout   : 304 (sec)
    Verify return code: 1 (unspecified certificate verification error)
    Extended master secret: no
    Max Early Data: 0
---
   0 items in the session cache
   0 client connects (SSL_connect())
   0 client renegotiates (SSL_connect())
   0 client connects that finished
   1 server accepts (SSL_accept())
   0 server renegotiates (SSL_accept())
   1 server accepts that finished
   1 session cache hits
   0 session cache misses
   0 session cache timeouts
   0 callback cache hits
   0 cache full overflows (128 allowed)
---
no client certificate available
</pre></BODY></HTML>

closed
```


The last line, `closed`, indicates that the secure channel has been closed. On the server's side, we can also see that the command terminated with the following output:


```bash
Received Record                                                                                                                                                   
Header:                                                                                                                                                           
  Version = TLS 1.0 (0x301)                                                                                                                                       
  Content Type = Handshake (22)                                                                                                                                   
  Length = 396                                                                                                                                                    
    ClientHello, Length=392                                                                                                                                       
      client_version=0x303 (TLS 1.2)                                                                                                                              
      Random:                                                                                                                                                     
        gmt_unix_time=0xB5D63ECD                                                                                                                                  
        random_bytes (len=28): 4477B06A7A1D3A3E305AD869EF2D0B351A3D1B69C1DFA32FB0E7F9E7                                                                           
      session_id (len=32): 8BB25C4CD7DEDDC1105DC229A079FB1DAD14CF7F45954C7B6B5FE6F653438FBB                                                                       
      cipher_suites (len=114)                                                                                                                                     
        {0x13, 0x02} TLS_AES_256_GCM_SHA384                                                                                                                       
        {0x13, 0x03} TLS_CHACHA20_POLY1305_SHA256                                                                                                                 
        {0x13, 0x01} TLS_AES_128_GCM_SHA256                                                                                                                       
        {0xC0, 0x2C} TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384                                                                                                      
        {0xC0, 0x30} TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384                                                                                                        
        {0x00, 0x9F} TLS_DHE_RSA_WITH_AES_256_GCM_SHA384                                                                                                          
        {0xCC, 0xA9} TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256                                                                                                
        {0xCC, 0xA8} TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256                                                                                                  
        {0xCC, 0xAA} TLS_DHE_RSA_WITH_CHACHA20_POLY1305_SHA256                                                                                                    
        {0xC0, 0x2B} TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256                                                                                                      
        {0xC0, 0x2F} TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256                                                                                                        
        {0x00, 0x9E} TLS_DHE_RSA_WITH_AES_128_GCM_SHA256                                                                                                          
        {0xC0, 0x24} TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384                                                                                                      
        {0xC0, 0x28} TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384                                                                                                        
        {0x00, 0x6B} TLS_DHE_RSA_WITH_AES_256_CBC_SHA256                                                                                                          
        {0xC0, 0x23} TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256                                                                                                      
        {0xC0, 0x27} TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256                                                                                                        
        {0x00, 0x67} TLS_DHE_RSA_WITH_AES_128_CBC_SHA256                                                                                                          
        {0xC0, 0x0A} TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA                                                                                                         
        {0xC0, 0x14} TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA                                                                                                           
        {0x00, 0x39} TLS_DHE_RSA_WITH_AES_256_CBC_SHA                                                                                                             
        {0xC0, 0x09} TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA                                                                                                         
        {0xC0, 0x13} TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA                                                                                                           
        {0x00, 0x33} TLS_DHE_RSA_WITH_AES_128_CBC_SHA                                                                                                             
        {0x00, 0xAD} TLS_RSA_PSK_WITH_AES_256_GCM_SHA384                                                                                                          
        {0x00, 0xAB} TLS_DHE_PSK_WITH_AES_256_GCM_SHA384                                                                                                          
        {0xCC, 0xAE} TLS_RSA_PSK_WITH_CHACHA20_POLY1305_SHA256                                                                                                    
        {0xCC, 0xAD} TLS_DHE_PSK_WITH_CHACHA20_POLY1305_SHA256                                                                                                    
        {0xCC, 0xAC} TLS_ECDHE_PSK_WITH_CHACHA20_POLY1305_SHA256                                                                                                  
        {0x00, 0x9D} TLS_RSA_WITH_AES_256_GCM_SHA384                                                                                                              
        {0x00, 0xA9} TLS_PSK_WITH_AES_256_GCM_SHA384                                                                                                              
        {0xCC, 0xAB} TLS_PSK_WITH_CHACHA20_POLY1305_SHA256                                                                                                        
        {0x00, 0xAC} TLS_RSA_PSK_WITH_AES_128_GCM_SHA256                                                                                                          
        {0x00, 0xAA} TLS_DHE_PSK_WITH_AES_128_GCM_SHA256                                                                                                          
        {0x00, 0x9C} TLS_RSA_WITH_AES_128_GCM_SHA256                                                                                                              
        {0x00, 0xA8} TLS_PSK_WITH_AES_128_GCM_SHA256                                                                                                              
        {0x00, 0x3D} TLS_RSA_WITH_AES_256_CBC_SHA256                                                                                                              
        {0x00, 0x3C} TLS_RSA_WITH_AES_128_CBC_SHA256                                                                                                              
        {0xC0, 0x38} TLS_ECDHE_PSK_WITH_AES_256_CBC_SHA384                                                                                                        
        {0xC0, 0x36} TLS_ECDHE_PSK_WITH_AES_256_CBC_SHA                                                                                                           
        {0x00, 0xB7} TLS_RSA_PSK_WITH_AES_256_CBC_SHA384                                                                                                          
        {0x00, 0xB3} TLS_DHE_PSK_WITH_AES_256_CBC_SHA384                                                                                                          
        {0x00, 0x95} TLS_RSA_PSK_WITH_AES_256_CBC_SHA                                                                                                             
        {0x00, 0x91} TLS_DHE_PSK_WITH_AES_256_CBC_SHA                                                                                                             
        {0x00, 0x35} TLS_RSA_WITH_AES_256_CBC_SHA                                                                                                                 
        {0x00, 0xAF} TLS_PSK_WITH_AES_256_CBC_SHA384                                                                                                              
        {0x00, 0x8D} TLS_PSK_WITH_AES_256_CBC_SHA                                                                                                                 
        {0xC0, 0x37} TLS_ECDHE_PSK_WITH_AES_128_CBC_SHA256                                                                                                        
        {0xC0, 0x35} TLS_ECDHE_PSK_WITH_AES_128_CBC_SHA                                                                                                           
        {0x00, 0xB6} TLS_RSA_PSK_WITH_AES_128_CBC_SHA256                                                                                                          
        {0x00, 0xB2} TLS_DHE_PSK_WITH_AES_128_CBC_SHA256                                                                                                          
        {0x00, 0x94} TLS_RSA_PSK_WITH_AES_128_CBC_SHA                                                                                                             
        {0x00, 0x90} TLS_DHE_PSK_WITH_AES_128_CBC_SHA                                                                                                             
        {0x00, 0x2F} TLS_RSA_WITH_AES_128_CBC_SHA                                                                                                                 
        {0x00, 0xAE} TLS_PSK_WITH_AES_128_CBC_SHA256                                                                                                              
        {0x00, 0x8C} TLS_PSK_WITH_AES_128_CBC_SHA                                                                                                                 
        {0x00, 0xFF} TLS_EMPTY_RENEGOTIATION_INFO_SCSV
      compression_methods (len=1)                                                                                                                                 
        No Compression (0x00)                                                                                                                                     
      extensions, length = 205                                                                                                                                    
        extension_type=ec_point_formats(11), length=4                                                                                                             
          uncompressed (0)                                                                                                                                        
          ansiX962_compressed_prime (1)                                                                                                                           
          ansiX962_compressed_char2 (2)                                                                                                                           
        extension_type=supported_groups(10), length=22                                                                                                            
          ecdh_x25519 (29)                                                                                                                                        
          secp256r1 (P-256) (23)                                                                                                                                  
          ecdh_x448 (30)                                                                                                                                          
          secp521r1 (P-521) (25)                                                                                                                                  
          secp384r1 (P-384) (24)                                                                                                                                  
          ffdhe2048 (256)                                                                                                                                         
          ffdhe3072 (257)                                                                                                                                         
          ffdhe4096 (258)                                                                                                                                         
          ffdhe6144 (259)                                                                                                                                         
          ffdhe8192 (260)                                                                                                                                         
        extension_type=session_ticket(35), length=0                                                                                                               
        extension_type=encrypt_then_mac(22), length=0                                                                                                             
        extension_type=extended_master_secret(23), length=0                                                                                                       
        extension_type=signature_algorithms(13), length=42                                                                                                        
          ecdsa_secp256r1_sha256 (0x0403)                                                                                                                         
          ecdsa_secp384r1_sha384 (0x0503)                                        
          ecdsa_secp521r1_sha512 (0x0603)                                        
          ed25519 (0x0807)                                                       
          ed448 (0x0808)                                                         
          rsa_pss_pss_sha256 (0x0809)                                            
          rsa_pss_pss_sha384 (0x080a)                                            
          rsa_pss_pss_sha512 (0x080b)                                            
          rsa_pss_rsae_sha256 (0x0804)                                           
          rsa_pss_rsae_sha384 (0x0805)                                           
          rsa_pss_rsae_sha512 (0x0806)                                           
          rsa_pkcs1_sha256 (0x0401)                                              
          rsa_pkcs1_sha384 (0x0501)                                              
          rsa_pkcs1_sha512 (0x0601)                                              
          ecdsa_sha224 (0x0303)                                                  
          rsa_pkcs1_sha224 (0x0301)                                              
          dsa_sha224 (0x0302)                                                    
          dsa_sha256 (0x0402)                                                    
          dsa_sha384 (0x0502)                                                    
          dsa_sha512 (0x0602)                                                    
        extension_type=supported_versions(43), length=5                                                                                                           
          TLS 1.3 (772)                 
          TLS 1.2 (771)                 
        extension_type=psk_key_exchange_modes(45), length=2                                                                                                       
          psk_dhe_ke (1)                                                         
        extension_type=key_share(51), length=38                                  
            NamedGroup: ecdh_x25519 (29)                                         
            key_exchange:  (len=32): 5D6910ECD062F3F039BAE0408F958A09B294E24FEE94E2A695DE794E8F3B170B                                                             
        extension_type=psk(41), length=52                                        
          0000 - 00 0f 00 09 72 6f 73 65-6e 70 61 73 73 00 00   ....rosenpass..                                                                                   
          000f - 00 00 00 21 20 1c 7a 65-4b 77 67 fb 5f 05 ea   ...! .zeKwg._..                                                                                   
          001e - af 2c 8c 57 45 4e 36 00-5a e2 17 fa ee 58 c3   .,.WEN6.Z....X.                                                                                   
          002d - ac 83 c2 45 52 33 75                           ...ER3u                                                                                           

Sent Record                             
Header:                                 
  Version = TLS 1.2 (0x303)                                                      
  Content Type = Handshake (22)                                                  
  Length = 128                          
    ServerHello, Length=124                                                      
      server_version=0x303 (TLS 1.2)                                             
      Random:                           
        gmt_unix_time=0x67909183                                                 
        random_bytes (len=28): 983F9CDF3B45917CD2D4AB4AC77F162C332CEBE036CF6E9B63E3C52D                                                                           
      session_id (len=32): 8BB25C4CD7DEDDC1105DC229A079FB1DAD14CF7F45954C7B6B5FE6F653438FBB                                                                       
      cipher_suite {0x13, 0x03} TLS_CHACHA20_POLY1305_SHA256                                                                                                      
      compression_method: No Compression (0x00)                                  
      extensions, length = 52                                                    
        extension_type=supported_versions(43), length=2                                                                                                           
            TLS 1.3 (772)                                                        
        extension_type=key_share(51), length=36                                  
            NamedGroup: ecdh_x25519 (29)                                         
            key_exchange:  (len=32): D4A82CB37846403182A733E065DB2CA53B45F54970B24380EB146CB4F5BBD948                                                             
        extension_type=psk(41), length=2                                         
          0000 - 00 00                                          ..                                                                                                

Sent Record                             
Header:                                 
  Version = TLS 1.2 (0x303)                                                      
  Content Type = ChangeCipherSpec (20)                                           
  Length = 1                            
    change_cipher_spec (1)                                                       

Sent Record                             
Header:                                 
  Version = TLS 1.2 (0x303)                                                      
  Content Type = ApplicationData (23)                                            
  Length = 23                           
  Inner Content Type = Handshake (22)                                            
    EncryptedExtensions, Length=2                                                
      No extensions                     

Sent Record
Header:
  Version = TLS 1.2 (0x303)
  Content Type = ApplicationData (23)
  Length = 53
  Inner Content Type = Handshake (22)
    Finished, Length=32
      verify_data (len=32): 647FC71F9CC0E7940587B29DECF7FC5295A944BF6540B4D5FA6117B70CAAFD25

Received Record
Header:
  Version = TLS 1.2 (0x303)
  Content Type = ChangeCipherSpec (20)
  Length = 1
Received Record
Header:
  Version = TLS 1.2 (0x303)
  Content Type = ApplicationData (23)
  Length = 53
  Inner Content Type = Handshake (22)
    Finished, Length=32
      verify_data (len=32): 71E1483F9FBD49677C5CCD0127B05013D4F2EB9863582F7619F00AE1E3C544BF

Sent Record
Header:
  Version = TLS 1.2 (0x303)
  Content Type = ApplicationData (23)
  Length = 234
  Inner Content Type = Handshake (22)
    NewSessionTicket, Length=213
        ticket_lifetime_hint=304
        ticket_age_add=4053405538
        ticket_nonce (len=8): 0000000000000000
        ticket (len=192): 2536DBEC3AB01BAE09F1086E3C05069762012E074AE96591903129779512347036C2DAD53E0C3ABF719EEABCBE73925362062907C08D313E6CC692C6F1736CAC58B6040FAEF97DE3F55078D462A009FFC9787D310BEFE31007E28331F1C75C2F688A47BC27500159CC98DCCD39049B5DBDB6BBC8E29557FA268C0EAE951F834827C3AA07C455CBD01FAE249375B827CF80AB7AF9954D638B40BA719E3AAAC8A34213D41FB00F1DDDD0678289622757192D32F7BD8457C31B79507587CC5EC949
        No extensions

Received Record
Header:
  Version = TLS 1.2 (0x303)
  Content Type = ApplicationData (23)
  Length = 23
  Inner Content Type = ApplicationData (23)
Sent Record
Header:
  Version = TLS 1.2 (0x303)
  Content Type = ApplicationData (23)
  Length = 5448
  Inner Content Type = ApplicationData (23)
Sent Record
Header:
  Version = TLS 1.2 (0x303)
  Content Type = ApplicationData (23)
  Length = 19
  Inner Content Type = Alert (21)
    Level=warning(1), description=close notify(0)

Received Record
Header:
  Version = TLS 1.2 (0x303)
  Content Type = ApplicationData (23)
  Length = 19
  Inner Content Type = Alert (21)
    Level=warning(1), description=close notify(0)


```


```bash
   0 items in the session cache
   0 client connects (SSL_connect())
   0 client renegotiates (SSL_connect())
   0 client connects that finished
   1 server accepts (SSL_accept())
   0 server renegotiates (SSL_accept())
   1 server accepts that finished
   1 session cache hits
   0 session cache misses
   0 session cache timeouts
   0 callback cache hits
   0 cache full overflows (128 allowed)
```


#### Observations

##### Is the PSK really being used?

We wanted to confirm that the PSK and the PSK identity are actually being used for channel establishment. So let's see!

**Failure On Non-Matching PSK or PSK Identity.** The channel establishment indeed fails if either the PSK or the PSK identity parameter do not match on both sides. Feel free to try and experiment with this a bit yourself!

**Observing the Usage of the PSK Mode in the Output.** The output of client and server gave us a hint about usage of a PSK ciphersuite. First, they showed `Reused, TLSv1.3` instead of `New, TLSv1.3` in case of a certificate-only channel establishment. This is because the PSK modes in TLS 1.3 are mainly designed to reuse key material from a previous session.

In the trace output of the server, we can see that the client signals a PSK key exchange extension, and sends the PSK identity:
```bash
[…]
        extension_type=psk_key_exchange_modes(45), length=2                                                                                                       
          psk_dhe_ke (1)                                                         
[…]
        extension_type=psk(41), length=52                                        
          0000 - 00 0f 00 09 72 6f 73 65-6e 70 61 73 73 00 00   ....rosenpass..                                                                                   
          000f - 00 00 00 21 20 1c 7a 65-4b 77 67 fb 5f 05 ea   ...! .zeKwg._..                                                                                   
          001e - af 2c 8c 57 45 4e 36 00-5a e2 17 fa ee 58 c3   .,.WEN6.Z....X.                                                                                   
          002d - ac 83 c2 45 52 33 75                           ...ER3u
[…]
```

In the session details, the PSK identity did not appear:
```bash
    PSK identity: None
    PSK identity hint: None
```
This is not the intended behaviour, and [we filed a bug report against OpenSSL](https://github.com/openssl/openssl/issues/24823). On the API level, this bug was already known by the OpenSSL maintainers.

The output told us that the ciphersuite `TLS_CHACHA20_POLY1305_SHA256` has been selected for this secure channel, which does not indicate usage of a PSK. This is expected behaviour because, in TLS 1.3, the PSK is not part of the ciphersuite as it is in TLS 1.2.

##### Indicating the PSK in Plaintext on the Command Line is a Security Issue

You might have noticed that we gave the PSK as a plaintext parameter on the command line. You might also be aware that it is a bad idea to indicate secrets in the parameters of a command. This is true because it means that the secret can end up in the terminal history file, as well as being visible in the process list while the command is running.

The PSK is, unsurprisingly, indeed visible in the process list:
```bash
$ ps a | grep openssl
 269543 pts/2    S+     0:00 openssl s_server -accept localhost:4433 -www -naccept 1 -trace -nocert -psk 1a2b3c4d5e6f -psk_identity rosenpass
 269748 pts/3    S+     0:00 grep --color=auto openssl
```
We, unsurprisingly, do not like to leak our secrets to everyone having access to the process list!

The tool `xargs` did *not* help because it simply prepares the command that will still then contain the plaintext PSK:
```bash
$ echo 1a2b3c4d5e6f | xargs -I % sh -c 'openssl s_server -accept localhost:4433 -www -naccept 1 -trace -nocert -psk 1a2b3c4d5e6f -psk_identity rosenpass'
```
```bash
$ ps a | grep openssl
 270394 pts/2    S+     0:00 xargs -I % sh -c openssl s_server -accept localhost:4433 -www -naccept 1 -trace -nocert -psk 1a2b3c4d5e6f -psk_identity rosenpass
 270395 pts/2    S+     0:00 sh -c openssl s_server -accept localhost:4433 -www -naccept 1 -trace -nocert -psk 1a2b3c4d5e6f -psk_identity rosenpass
 270396 pts/2    S+     0:00 openssl s_server -accept localhost:4433 -www -naccept 1 -trace -nocert -psk 1a2b3c4d5e6f -psk_identity rosenpass
 270400 pts/3    S+     0:00 grep --color=auto openssl
```

OpenSSL s_client and s_server do not support reading the PSK from stdin because s_client uses stdin for input meant to be sent over the secure channel.

We opened a [feature request against OpenSSL, to allow reading the PSK from a file](https://github.com/openssl/openssl/issues/24721). The OpenSSL maintainers reacted impressively quickly, acknowledging the feature request. We agreed to contribute a pull request, and received helpful advice from a maintainer on how to go about it. Engaging with OpenSSL, for both of our requests, was a very pleasant experience!


#### Using TLS 1.2

TLS version 1.2 is still commonly in use on the internet, so we ran the example with this version as well. We were able to force the server to use TLS 1.2 by adding the CLI option `-tls1_2`:
```bash
$ openssl s_server -accept localhost:4433 -www -naccept 1 -trace -nocert -tls1_2 -psk 1a2b3c4d5e6f -psk_identity rosenpass
```
We did not need to adapt the client command. The output reads a bit differently:

```bash
---
New, TLSv1.2, Cipher is DHE-PSK-AES256-GCM-SHA384
[…]
SSL-Session:
    Protocol  : TLSv1.2
    Cipher    : DHE-PSK-AES256-GCM-SHA384
[…]
    PSK identity: rosenpass
    PSK identity hint: None
[…]
---
```
In TLS 1.2, the usage of a PSK was still part of the ciphersuite choice, and it is visible in the chosen ciphersuite `DHE-PSK-AES256-GCM-SHA384`. Also, the PSK identity `rosenpass` was displayed.


### 2. Rosenpass Simple Example

For this section, we assume that you have already installed Rosenpass on your system. You can do so by following the step-by-step [manual on our website](https://rosenpass.eu/docs/compilation/).

We needed two Rosenpass peers, and we set them up based on the two config files: `rp1` and `rp2`.

They are written such that the two peers are talking to each other, respectively. Each peer reads its public key and secret key from files `public_key` and `secret_key`, and writes the Rosenpass shared key into a `key_out` file. After a successful key exchange, the files `rp1-key-out` and `rp2-key-out` will be be exactly equal. This key is what we then handed over to OpenSSL in the following section.

 rp1:
```bash
public_key = "rp1-public-key"
secret_key = "rp1-secret-key"
listen = ["127.0.0.1:9998"]
verbosity = "Quiet"

[[peers]]
public_key = "rp2-public-key"
endpoint = "127.0.0.1:9999"
key_out = "rp1-key-out"
```

rp2:
```bash
public_key = "rp2-public-key"
secret_key = "rp2-secret-key"
listen = ["127.0.0.1:9999"]
verbosity = "Quiet"

[[peers]]
public_key = "rp1-public-key"
endpoint = "127.0.0.1:9998"
key_out = "rp2-key-out"
```

After writing these two config files, we executed the following two commands to instruct Rosenpass to sample the key pairs:

```bash
$ rosenpass gen-keys rp1
$ rosenpass gen-keys rp2
```

Now, in two different terminals, just as in the previous section, we started two Rosenpass peers:
```bash
$ sudo rosenpass exchange-config rp1
```
This command will not produce any output at this stage. It listens on port `9998` and waits for a connection.

Shortly after we started the second peer:
```bash
$ sudo rosenpass exchange-config rp2
```
Both peers then showed an output on the terminal:

```bash
output-key peer mD5+gb1BH3MZDewgoO3QML1DtA3Ip5XJtk+9kEp9ZpE= key-file "rp1-key-out" exchanged
```

```bash
output-key peer 2GTde5XqHa7bB4pq8Xk2BFD+QX94CqpPE+3VvYhvyZg= key-file "rp2-key-out" exchanged
```
Also, we can see that the two files `rp1-key-out` and `rp2-key-out` have been created, and that they are equal. Testing this command revealed that it did not produce output:
```bash
$ diff rp*-key-out
```

We then terminated both Rosenpass peers using `Ctrl+C`. Otherwise, they would have continued to perform new handshakes and written new shared keys to their output key file every two minutes.


### 3. Plugging it all in

The final step was to hand the Rosenpass shared key over to the OpenSSL `s_client` and `s_server` commands. We needed to achieve the following:

  * Detect when Rosenpass finished a handshake,
  * Encode the Rosenpass shared key such that `s_client` and `s_server` can read it,
  * And launch `s_client` and `s_server` with the key.

We implement this in Bash scripts, which are available in the repo [rosenpass/openssl-tutorial](https://github.com/rosenpass/openssl-tutorial) alongside the configuration files `rp1` and `rp2` for Rosenpass:

  * `setup.bash`: sample the Rosenpass keys based on the config files,
  * `client.bash`: running Rosenpass and then OpenSSL `s_client`,
  * `server_tls12.bash`: running Rosenpass and the OpenSSL `s_server` with the `-tls1_2` flag
  * `server_tls13.bash`: the same but with the `-tls1_3` flag
  * `common.bash`: shared code between client and server.

#### Waiting for One Rosenpass Handshake and Encoding the Shared Key

The first two tasks from above -- running Rosenpass and detecting the end of the first handshake, and encoding the key for OpenSSL -- were the same for client and server, and so we could share the code in a common Bash script that is sourced by both the client and server scripts. The client and server scripts only needed to set a variable, `PEER` to `rp1` or `rp2`, before sourcing the script to indicate which Rosenpass peer the script should set up. We took care to include comprehensive code comments into the script, allowing us to quote it in its entirety below.

The main idea for detecting the end of the first handshake was to use the existence of the output key file as signal. At the beginning of the script, we made sure that the file is deleted, and then waited until it was created again. When starting Rosenpass, we remember its process ID, so that we could kill it after the first handshake. Waiting for the file creation in a sleep loop is certainly not the cleanest approach, but as the handshake is not supposed to take long anyway, it seems ok for this purpose.

Encoding the shared key for OpenSSL was achieved through a series of pipes, to get from base64 to hex encoding. At the end of the script, we had a variable `PSK` containing the Rosenpass shared key in an encoding readable by OpenSSL, and a variable `PSK_ID` containing the bitstring `rosenpass` for the PSK identity.

common.bash:
```bash
#!/bin/bash

# This has to match the filename configured
# in rp1 and rp2, respectively. Rosenpass will
# write the shared key into this file.
PSK_FILE=./${PEER}-key-out

# Ideally, we want to have OpenSSL read the PSK
# from a file. This is the filename we will use.
PSK_FILE_HEX=${PSK_FILE}.hex

# PSK identity is a bitstring used by TLS and it
# has to be the same for client and server
PSK_ID="rosenpass"

# Remove previous PSK output file, because we use
# it to test if the first handshake completed.
rm -f $PSK_FILE

# Start Rosenpass in the background and keep the
# process ID to be able to kill the process after
# the first handshake completed.
sudo rosenpass exchange-config ${PEER} & PID=$!

echo "Started Rosenpass with PID $PID"

# Wait for the PSK file to be created by Rosenpass.
while [ ! -f $PSK_FILE ]; do sleep 1; done

# Kill the Rosenpass process as soon as a PSK has been written
# to the PSK file.
echo -e "PSK file has been created, killing Rosenpass process"
sudo kill $PID

# Encode the PSK for OpenSSL. We need to go from base64 to hex.
PSK=$(cat $PSK_FILE | base64 -d | od -t x1 -An | tr -d ' \n')

# Write PSK to file in case we manage to have OpenSSL read it from there
echo $PSK > $PSK_FILE_HEX
```

#### Client and Server Scripts

The client and server scripts call OpenSSL `s_client` and `s_server` and hand the PSK and PSK identity over as CLI parameters:

```bash
-psk "${PSK}" -psk_identity "${PSK_ID}"
```

As explained above, this is insecure because the PSK ends up visible in plaintext in the process list. We will hopefully soon have time to work on a pull request for the feature request that we submitted to OpenSSL.

On the client side, the user still needs to input `GET /` manually. We also tested piping `echo "GET /"` into the `openssl s_client` command, however, this turned out to be unreliable. The server sometimes did not answer with the status output. We believe this may be because the input would sometimes arrive too early.

### 4. Security Analysis

The general idea of hybrid post-quantum security is that:

1) We retain classic security in the case that the post-quantum cryptographic building blocks turn out to be vulnerable, be it to attacks by classical or quantum computers.
2) We still maintain security when quantum computers inevitably begin to break the building blocks of classical cryptography. 

The second point is especially relevant for confidentiality, as adversaries can start storing encrypted communication today and wait until a quantum computer capable of breaking it becomes available. By starting to employ post-quantum cryptography today, we improve our chances of protecting against “store-now decrypt-later” attacks.

Both TLS 1.2 and TLS 1.3 employ a key schedule that hashes together different cryptographic key material to produce a symmetric session key. In our case, the cryptographic key material is comprised of:

1) The shared secret from the ephemeral Diffie-Hellman (DH) key exchange executed within the TLS handshake.
2) The PSK. 

The key schedule is built in a way such that the symmetric session key remains secure even if the adversary knows either the DH shared secret or the PSK. The rough idea is that the key schedule is a key derivation function `KDF(dh, psk)` depending on both the DH shared secret and the PSK. This function produces a secure uniformly random symmetric key as long as one of the two parameters `dh` and `psk` is not known to the adversary.

There are two cryptography papers formally analysing the security of the PSK ciphersuites of TLS 1.2 and TLS 1.3. The analyses were done assuming a classical adversary, but still give indications that this security also holds against a quantum adversary. For more assurance and more precise security bounds, these analyses would need to be repeated with the consideration of a quantum adversary. At least in the case of TLS 1.3, this might necessitate the Quantum Random Oracle Model, which is a more involved way of analysing security of hash functions against a quantum adversary.

For TLS 1.2, more details can be found in *Section 3* and *Theorem 2* of [ia.cr/2014/037](https://eprint.iacr.org/2014/037) relating to the “TLS_DHE_PSK protocol”. For TLS 1.3, there are *Theorem 7.1* and *Figure 1* of [ia.cr/2022/246](https://eprint.iacr.org/2022/246).
    
### 5. Conclusion

In the course of producing this tutorial, we were able to demonstrate that Rosenpass can be used to achieve hybrid post-quantum security with both a TLS 1.2 and a TLS 1.3 channel. Although we have made our scripts available in [rosenpass/openssl-tutorial](https://github.com/rosenpass/openssl-tutorial), it is worth noting that this is meant as a proof-of-concept. The reader should be aware that this tutorial's implentation is not as secure as it should be for production use. The immediately known flaws in this method are:

1) We were only able to reach hybrid confidentiality. As explained in the tutorial, we were not able to do the same for authentication which, rather than being hybrid, is only post-quantum secure. 
2) Ephemeral keys are not freshly sampled random values, as mentioned above.
3) The pre-shared key is leaked in the process list, as reported in a feature request to OpenSSL.
4) There should be a binding of the Rosenpass key exchange to information about the TLS peers, ideally the server certificate. For this, we would need to add an interface to Rosenpass that accepts such an additional input to be incorporated into the key exchange.

This work was supported by [the NLnet foundation](https://nlnet.nl/project/Rosenpass-API/).

We would love to hear from you if you have questions or comments, and also if you would like to explore working together on Rosenpass-related projects. Feel free to [reach out to us](https://rosenpass.eu/contributors/)!
