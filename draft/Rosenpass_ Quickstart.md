# Rosenpass: Quickstart

Rosenpass is a deamon, that given a private key and a list of peers performs a key exchange with each peer. The resulting keys are given to WireGuard using it's PSK feature – WireGuard remains as secure as it was, Rosenpass adds protection against quantum computers. Rosenpass can also write the keys to files; this can be used to integrate Rosenpass with tools other than WireGuard.

The `rp` bash program is used to build a VPN with WireGuard and Rosenpass. You can inspect how the tool integrates the `wg` WireGuard frontend and the `rosenpass` tool that implements our cryptography using the `explain` flag. 

```sh
$ rp explain genkey mykey
#! /bin/bash
set -e
umask 077
mkdir -p mykey
wg genkey > mykey/wgsk
rosenpass keygen \
  private-key mykey/pqsk \
  public-key  mykey/pqpk
```

We provide packages on debian-==TODO==, nix, and arch linux. On other system the rust package manager `cargo` can be used. If none of these methods are suitable, you can download one of our prebuilt ==[static binaries TODO]().==

```shell
    (debian) $ apt install rosenpass
      (arch) $ pacman -S rosenpass
(nix-legacy) $ nix-env -iA nixos.rosenpass
 (nix-flake) $ nix profile install github:rosenpass/rosenpass#rosenpass
     (cargo) $ cargo install rosenpass
```

To get more information about command line parameters used by the tools, you can ask the tools for help:

```sh
rp help
rosenpass help
```

To create a VPN connection, start by generating secret keys on both hosts.

    ```sh
    rp genkey server.rosenpass-secret
    rp genkey client.rosenpass-secret
    ```

Extract the public keys:

    ```sh
    rp pubkey server.rosenpass-secret server.rosenpass-public
    rp pubkey client.rosenpass-secret client.rosenpass-public
    ```

Copy the `-public` directories to the other peers and then start the vpn. On the server:

    ```sh
    sudo rp exchange server.rosenpass-secret dev rosenpass0 listen 192.168.0.1:9999 \
        peer client.rosenpass-public allowed-ips fe80::/64
    ```

On the client:

    ```sh
    sudo rp exchange server.rosenpass-secret dev rosenpass0 \
        peer client.rosenpass-public endpoint 192.168.0.1:9999 allowed-ips fe80::/64
    ```

Assign ip addresses:

    ```sh
    sudo ip a add fe80::1/64 dev rosenpass0 # Server
    sudo ip a add fe80::2/64 dev rosenpass0 # Client
    ```

Test the connection by pinging the server on the client machine:

    ```sh
    ping fe80::1%rosenpass0 # Client
    ```

You can watch how Rosenpass replaces the WireGuard PSK with the following command:

    ```sh
    watch -n 0.2 'wg show all; wg show all preshared-keys'
    ```
