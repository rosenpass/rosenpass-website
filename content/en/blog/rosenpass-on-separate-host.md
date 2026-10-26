---
title: "Rosenpass: Increase WireGuard security without increasing the TCB"
linkTitle: "Increate WireGuard security without increasing the TCB"
description: "A tutorial about using Rosenpass key exchange security while running Rosenpass on different hosts to avoid an increased TCB"
author: "Jacek Galowicz"
blogpost: "true"
pubDate: 2025-02-14
---


This article provides a comprehensive guide to setting up a highly secure WireGuard VPN enhanced with Rosenpass post-quantum secure key exchange, all within a NixOS environment.
By leveraging separate devices for Rosenpass, we minimize the attack surface on your critical WireGuard hosts while ensuring your VPN remains secure against potential future threats from [quantum computers](https://www.ibm.com/topics/quantum-computing).
This step-by-step tutorial, complete with NixOS configurations, empowers you to implement this robust security solution with ease, making it essential reading for anyone prioritizing privacy and forward-thinking security in their VPN infrastructure.

## WireGuard

{{< blocks/blog-image src="img/blog/2025/rosenpass-on-separate-host/wireguard.svg" alt="The logo of the WireGuard project" subtitle="The logo of the WireGuard project" >}}

[WireGuard](https://www.wireguard.com/) is a modern, open-source [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) protocol that prioritizes speed, simplicity, and strong cryptography.
Unlike older, more complex VPN protocols, WireGuard has a lean codebase, making it easier to audit, deploy, and maintain.
It utilizes cutting-edge cryptographic primitives like [Curve25519](https://en.wikipedia.org/wiki/Curve25519), [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20), [Poly1305](https://en.wikipedia.org/wiki/Poly1305), and [BLAKE2](https://en.wikipedia.org/wiki/BLAKE_(hash_function)), ensuring data confidentiality and integrity.
WireGuard's minimized design and focus on performance have contributed to its rapid adoption across [various platforms](https://www.wireguard.com/install/) and its [integration into the Linux kernel](https://www.wireguard.com/papers/wireguard.pdf).

## Rosenpass

{{< blocks/blog-image src="img/blog/2025/rosenpass-on-separate-host/rosenpass-darklogo.svg" alt="The logo of the Rosenpass project" subtitle="The logo of the Rosenpass project" >}}

Rosenpass is a free and open-source software project that enhances the security of VPNs, particularly WireGuard, against the potential threat of quantum computers.
It achieves this by adding a [post-quantum secure](https://csrc.nist.gov/Projects/post-quantum-cryptography) [key exchange](https://en.wikipedia.org/wiki/Key_exchange) mechanism to the VPN setup process.
Essentially, Rosenpass generates encryption keys using algorithms that are, by current scientific standards, believed to be resistant to attacks from both classical and quantum computers, ensuring your VPN connection remains secure even in the face of upcoming technological advancements.

What makes Rosenpass awesome is its combination of practicality and forward-thinking security.
It seamlessly integrates with the widely-used WireGuard, leveraging its speed and efficiency while adding a crucial layer of quantum-resistant protection.
This means you don't have to sacrifice performance for security.
Moreover, Rosenpass is built with transparency and verifiability in mind.
Its code is open for anyone to inspect and audit, ensuring trust and accountability in its security claims.
By proactively addressing the potential threat of quantum computing, Rosenpass provides peace of mind and future-proofs your online privacy.

## Rosenpass on a Separate Device: A Tutorial

In high-security environments, minimizing the number of software components installed on critical systems is often essential.
This tutorial demonstrates how to set up Rosenpass on a separate device to enhance the security of your WireGuard VPN connection without requiring any additional software installation on your WireGuard hosts.

{{< blocks/blog-image src="img/blog/2025/rosenpass-on-separate-host/rosenpass-network.png" alt="Rosenpass can secure the WireGuard connection between two hosts without being installed on them" subtitle="Rosenpass can secure the WireGuard connection between two hosts without being installed on them" >}}

We will use a four-host configuration:

- **2 WireGuard hosts**: These hosts establish the actual VPN connection and communicate over the encrypted WireGuard tunnel.
- **2 Rosenpass hosts**: These hosts are responsible for the secure key exchange. They generate the post-quantum keys and transmit them to the WireGuard hosts.

The key here is that the WireGuard hosts only need SSH to receive the keys – a tool that is already present in most high-security environments.
The Rosenpass app is installed exclusively on the separate Rosenpass hosts, minimizing the attack surface on your WireGuard hosts.

In the following sections, we will walk you through the setup step-by-step and show you how to use Rosenpass with the outfile option to securely transfer keys via SSH.

Please note that we manage private and public keys in files that need to be stored on disk of the respective machines, and NixOS will not manage this for us.
There are tools for automated and secure secret management, but the setup of these would blow the scope of this article.

### WireGuard setup

The NixOS setup for the WireGuard host that we call "WireGuard Host 1" in the diagram, the configuration looks like this:

```nix
{
    networking.wireguard.interfaces.mywg = {
        listenPort = 51820;
        ips = [ "10.100.0.1/24" ];
        privateKeyFile = "/secrets/wireguard.sk";
        peers = [
            {
                publicKey = "ZErZhjoSTiLCfPXl3TcnWyfvUtjP1mIQUH+2sRxI/wE=";
                allowedIPs = [ "10.100.0.2/32" ];
                presharedKey = "6o/L9WcKi5BMC1233PctFy0ieha0ATwkE+z7Tm6g/XQ=";
            }
        ];
    };
    networking.firewall.allowedUDPPorts = [ 51820 ];
}
```

The private key file and its matching public key need to be generated using the `wg genkey` tool, which is also [described in the WireGuard documentation](https://www.wireguard.com/quickstart/):

```console
# umask 077
# mkdir /var/secret/
# wg genkey > /var/secret/wireguard.sk
# wg pubkey < /var/secret/wireguard.sk > /var/secret/wireguard.pk
```

After running these commands, the private or secret key is the one with the `.sk` suffix and the public key is the `.pk` file.
It is important to run these commands on both WireGuard hosts individually, so that each has their key pair.
As `publicKey` in the config, use the `.pk` content of the *other* host.

The NixOS configuration of the host "WireGuard Host 2" will now look the same apart from the keys and IP addresses.
In this example, WireGuard Host 1 has the VPN IP `10.100.0.1` and the second host gets `10.100.0.2`, which both configurations should also reflect accordingly.

The `presharedKey` option is special:
In this guide, we add a *different key* for both hosts, so that **it doesn't work** right from the start.
The connection that we are about to set up will work *after* we injected the pre-shared key that Rosenpass generates for us.

### Key Exchange

To perform the key exchange between "Rosenpass Host 1" and "Rosenpass Host 2", we need to run Rosenpass as a system service on both hosts.
Generally, [NixOS already provides a NixOS module to run Rosenpass](https://github.com/NixOS/nixpkgs/tree/master/nixos/modules/services/networking/rosenpass.nix),
but we are going to use the `key_out` feature to store the new pre-shared key for further distribution.

Let's create a new file `rosenpass-key-exchange.nix` that encapsulates our service as a nicely configurable NixOS module, and put it next to the NixOS configuration of both Rosenpass Host 1 and 2:

```nix
{ lib, pkgs, config, ... }:

let
  cfg = config.services.rosenpassKeyExchange;
in
{
  options.services.rosenpassKeyExchange = {
    enable = lib.mkEnableOption "rosenpass key-exchange";
    config = lib.mkOption {
      type = lib.types.path;
      description = "Path to rosenpass configuration";
    };
  };

  config = lib.mkIf cfg.enable {
    systemd.services.rp-exchange = {
      description = "Rosenpass Key Exchanger";
      wantedBy = [ "multi-user.target" ];
      requires = [ "network-online.target" ];
      script = ''
        ${pkgs.rosenpass}/bin/rosenpass exchange-config ${cfg.config}
      '';
      serviceConfig = {
        Restart = "always";
        RestartSec = 1;
      };
    };
  };
}
```

This module looks like some boiler plate code that, due to its configurability, will not lead to the shortest configuration possible.
However, the NixOS modules that we create in this article are suitable for reuse across multiple hosts, which is generally what NixOS users aim for.

The NixOS configuration of "Rosenpass Host 1" that then uses this module looks like this:

```nix
{
    imports = [
        ./rosenpass-key-exchange.nix
    ];
    services.rosenpassKeyExchange = {
        enable = true;
        config = builtins.toFile "server.toml" ''
            public_key = "/var/secrets/self.pk"
            secret_key = "/var/secrets/self.sk"
            listen = ["[::]:51821"]
            verbosity = "Verbose"

            [[peers]]
            public_key = "/var/secret/peer.pk"
            endpoint = "clientkeyexchanger:51821"
            key_out = "/root/peer.osk"
        '';
      };
      networking.firewall.allowedUDPPorts = [ 51821 ];
}
```

The key pair files of `self` and `peer` as mentioned in the config - similar to the WireGuard key pair - need to be generated at first.
The `rp genkey` command does this, as [documented in the Rosenpass documentation](https://rosenpass.eu/docs/rosenpass-tool/start/):

```console
# umask 077
# mkdir /var/secrets
# rp genkey /var/secrets/self.sk
# rp pubkey /var/secrets/self.sk /var/secrets/self.pk
```

Again, it is important to run these commands on both Rosenpass hosts individually.
Copy both public key files `self.pk` from the respective host to the other host while naming it `/var/secret/peer.pk`.

The hostname `clientkeyexchanger` is the one of "Rosenpass Host 2".
The configurations on both sides are allowed to look completely symmetrical apart from the host name, where the second host would use `serverkeyexchanger`.

### Key Synchronization

Now we have NixOS configuration in place for:

- WireGuard Host 1 and 2: These are set up to connect to each other with an intentionally broken pre-shared key.
- Rosenpass Host 1 and 2: These are set up to connect to each other and recurringly create new pre-shared keys.

These parts of the setup model the vertical arrows in the diagram.

What we don't have, yet, is that WireGuard Host 1 and respectively 2 obtains the latest pre-shared key from Rosenpass Host 1 and respectively 2.
These will model the horizontal arrows in the diagram.

As new keys are created periodically, we will need to periodically download them from the Rosenpass hosts.

Let's create another new configurable NixOS with the name `rosenpass-key-sync.nix`:

```nix
{ pkgs, lib, config, ... }:

let
  cfg = config.services.rosenpassKeySync;
in
{
  options.services.rosenpassKeySync = {
    enable = lib.mkEnableOption "rosenpass externally generated key sync";
    wgInterface = lib.mkOption {
      type = lib.types.str;
      description = "WireGuard interface name";
    };
    rpHost = lib.mkOption {
      type = lib.types.str;
      description = "network address of the host that runs rosenpass";
    };
    peerPubkey = lib.mkOption {
      type = lib.types.str;
      description = "Public key of WireGuard peer";
    };
    remoteKeyPath = lib.mkOption {
      type = lib.types.path;
      description = "Location of the .osk file on the key exchange server";
    };
  };

  config = lib.mkIf cfg.enable {
    systemd.services.rp-key-sync = {
      description = "Rosenpass Key Downloader";
      wantedBy = [ "multi-user.target" ];
      requires = [ "network-online.target" ];
      script = ''
        set -euo pipefail
        ${pkgs.openssh}/bin/ssh ${cfg.rpHost} "cat ${cfg.remoteKeyPath}" \
          | ${pkgs.wireguard-tools}/bin/wg \
            set ${cfg.wgInterface} \
            peer ${cfg.peerPubkey} \
            preshared-key /dev/stdin
      '';
      serviceConfig = {
        Restart = "always";
        RestartSec = 10;
      };
    };

    systemd.timers.rp-key-sync-timer = {
      wantedBy = [ "timers.target" ];
      timerConfig = {
        requires = [ "network-online.target" ];
        OnUnitActiveSec = "1m";
        Unit = "rp-key-sync.service";
      };
    };
  };
}
```

This service is restarted every minute and logs into the Rosenpass host to download the latest pre-shared key and inject it into the WireGuard connection using
the command `wg set <interface> peer <peer name> preshared-key ...`.

For this interaction to work, the WireGuard host needs to be able to log into the Rosenpass host without a password.
This can be set up by installing the WireGuard host user's public key into the known hosts setting of the Rosenpass host's SSH configuration.

```nix
{
    services.rosenpassKeySync = {
        enable = true;
        wgInterface = "mywg";
        rpHost = "clientkeyexchanger";
        peerPubkey = "...<peer public key>...";
        remoteKeyPath = "/root/peer.osk";
    };
}
```

Again, this configuration turns out to be the same on both WireGuard hosts, apart from the host name in `rpHost` and the peer's public key (the one from *WireGuard*, not Rosenpass).

The whole interaction assumes that the `root` user from the WireGuard host can login via SSH on the Rosenpass host.
To set this up, note down the WireGuard host's `root` user public SSH key and insert it on the Rosenpass host with the NixOS configuration line:

```nix
users.users.root.openssh.authorizedKeys.keys = [ "<ssh pubkey...>" ];
```
