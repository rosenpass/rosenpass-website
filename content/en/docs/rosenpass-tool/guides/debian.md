---
title: "Rosenpass Installation and Usage on Debian"
linkTitle: "Debian"
weight: 4
menu: false
hideLead: true
type: docs
shortBlerb: "Set up and use Rosenpass on Debian"
blerb: "A guide on different options to install the Rosenpass tool on Debian (including installation via binary files and manual compilation), and a usage example as enhancement of WireGuard."
---

{{< blocks/lead color="secondary" class="title-box" >}}
## Rosenpass Installation and Usage on Debian
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets package" %}}

Rosenpass is ready for use on Debian. This page provides you with installation and usage guides to get started with Rosenpass on Debian. Currently, most users should start with the [Installation via the Binary Files](#installation-via-binary-files).

Table of Contents:
* [Installation via the Binary Files](#installation-via-binary-files): Most users can start here.
* [Compile Rosenpass from Source](#compile-it-from-source): Some users might need to go the manual way.
* [Set up a Rosenpass-enhanced WireGuard VPN](#set-up-a-rosenpass-enhanced-wireguard-vpn): After installation, you can proceed here.
* [Installation via the Package Manager](#installation-via-the-package-manager): A short note only, because this is not yet ready for use.

This guide was last tested on March 10, 2025, under Debian 12.9 Bookworm.
<span class="spacer"></span>
{{% /blocks/section %}}

{{< blocks/lead color="secondary" class="title-box" >}}
## Installation via Binary Files
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets compilation" %}}

<span class="spacer"></span>

Rosenpass provides pre-built binary files for 64-bit Debian. This is the most common architecture. If you need something else, you are advised to [compile Rosenpass from source](#compile-it-from-source).

1. **Download** the Rosenpass binary. The following command gets you the [latest version](https://github.com/rosenpass/rosenpass/releases/latest). If you need a different one, have a look at the [releases page](https://github.com/rosenpass/rosenpass/releases/).

<span class="codebox">

```sh{class="command-user"}
wget https://github.com/rosenpass/rosenpass/releases/download/v0.2.2/rosenpass-x86_64-linux-0.2.2.tar
```

</span>

2. **Unzip** the file. You can use the following command, or use the file explorer and “Extract Here” (or similar) from the context menu.

The archive contains a directory `bin` with the two binaries `rosenpass` and `rp`.

<span class="codebox">

```sh{class="command-user"}
tar xf rosenpass-x86_64-linux-0.2.2.tar
```

</span>

3. **Install** Rosenpass by copying its binaries to `/usr/local/bin` **with root privileges**:

```sh{class="code-block-list command-root"}
install bin/rosenpass /usr/local/bin
```
```sh{class="code-block-list command-root"}
install bin/rp /usr/local/bin
```
<span class="spacer"></span>
The second binary, `rp`, is the Rosenpass helper. You can skip this step if you do not want to use it. The [setup guide](#set-up-a-rosenpass-enhanced-wireguard-vpn) uses `rp`, though, so we recommend installing it.

4. **Delete**: You can delete the downloaded archive and the extracted `bin` directory, if you like:

```sh{class="code-block-list command-user"}
rm -r rosenpass-x86_64-linux-0.2.2.tar bin/rosenpass bin/rp
```
```sh{class="code-block-list command-user"}
rmdir bin
```
<span class="spacer"></span>

5. **Test**: As a quick test that the installation succeeded, run both tools with the `help` command to show a short usage hint:

```sh{class="code-block-list command-user"}
rosenpass help
```
```sh{class="code-block-list command-user"}
rp help
```
<span class="spacer"></span>

**Note:** In version the current version v0.2.2, `rp` shows an error message if Git is not installed. You can safely use `rp` without Git.
<span class="spacer"></span>

**That's it! You have now downloaded and installed Rosenpass.** You can now proceed to [set up a Rosenpass-enhanced WireGuard VPN](#set-up-a-rosenpass-enhanced-wireguard-vpn).


{{% /blocks/section %}}

{{< blocks/lead color="secondary" class="title-box" >}}
## Compile it from Source
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets compilation" %}}


<span class="spacer"></span>

If you cannot or do not want to use the pre-build binaries, you can compile Rosenpass from source.

1. **Install the build dependencies** necessary for compiling Rosenpass. Also, install WireGuard, if you want to use Rosenpass with WireGuard.

The following command installs WireGuard and the build dependencies. You can remove WireGuard from this list if you do not want it to be installed.

The command also install `curl` in preparation of the Rustup installation in the next point.

<span class="codebox">

```sh{class="command-root"}
apt --yes install libsodium-dev libclang-dev cmake pkg-config git build-essential curl wireguard
```

</span>

2. **Install** Rust. The preferred way to do this is by using [Rustup](https://rustup.rs/) (the website should show a straightforward command to install Rustup). During installation, Rustup asks you about your installation preferences; if you are unsure you can just proceed with the standard installation. If possible, install the latest release. In July 2023, the minimum required Rust version for Rosenpass was 1.64.0.
<span class="spacer"></span>

3. **Clone** the Rosenpass Git repository, change to the `rosenpass` directory, and switch to the branch of the latest release:

```sh{class="code-block-list command-user"}
git clone https://github.com/rosenpass/rosenpass.git
```
```sh{class="code-block-list command-user"}
cd rosenpass
```
```sh{class="code-block-list command-user"}
git checkout v0.2.2
```

<span class="spacer"></span>
Without switching to a different branch, you will install and compile the development version. If you would like to compile an ancient version, find its Git tag name by browsing the [releases page](https://github.com/rosenpass/rosenpass/releases) and use `git checkout` accordingly.
<span class="spacer"></span>

4. **Compile:** This is the actual compilation step and may take a while:

<span class="codebox">

```sh{class="command-user"}
cargo build --release
```

</span>

5. **Install:** If the compilation succeeded, proceed to install Rosenpass by copying its binaries to `/usr/local/bin` **with root privileges**:

```sh{class="code-block-list command-root"}
install target/release/rosenpass /usr/local/bin
```
```sh{class="code-block-list command-root"}
install rp /usr/local/bin
```
<span class="spacer"></span>
The second binary, `rp`, is the Rosenpass helper. You can skip this step if you do not want to use it.
<span class="spacer"></span>

6. **Test**: As a quick test that the installation succeeded, run both tools with the `help` command to show a short usage hint:

```sh{class="code-block-list command-user"}
rosenpass help
```
```sh{class="code-block-list command-user"}
rp help
```
<span class="spacer"></span>
**That's it! You have downloaded, compiled, and installed Rosenpass.** You can now proceed to [set up a Rosenpass-enhanced WireGuard VPN](#set-up-a-rosenpass-enhanced-wireguard-vpn).

<span class="spacer"></span>

{{% /blocks/section %}}


{{< blocks/lead color="secondary" class="title-box" >}}
## Set up a Rosenpass-enhanced WireGuard VPN
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets compilation" %}}

In this section, we set up a Rosenpass-enhanced WireGuard connection between two peers. Technically, there's no difference between the two peers. However, for clarity, we name them <span class="primary-highlight"><strong>server</strong> (pink)</span> and <span class="secondary-highlight"><strong>client</strong> (orange)</span>.

### Prepare the Key Pairs

#### 1. Start by generating secret keys for both peers

**Note:** These will be stored in newly created `server.rosenpass-secret` and `client.rosenpass-secret` directories.

```sh{class="starter-code-server command-user"}
rp genkey server.rosenpass-secret
```
```sh{class="starter-code-client command-user"}
rp genkey client.rosenpass-secret
```

#### 2. Extract the public keys

**Note:** As above, these will be stored in newly created `server.rosenpass-public` and `client.rosenpass-public directories`.

```sh{class="starter-code-server command-user"}
rp pubkey server.rosenpass-secret server.rosenpass-public
```
```sh{class="starter-code-client command-user"}
rp pubkey client.rosenpass-secret client.rosenpass-public
```

#### 3. Copy each `-public` directory to the other peer

Both peers need the `-public` directory of other peer, respectively, and it needs to be placed next to the `-secret` and `-public` directories that already exist. If you have SSH access to both machines, you can use the following commands:

```sh{class="starter-code-server command-user"}
scp -r server.rosenpass-public user@client:/path/to/directory
```
```sh{class="starter-code-client command-user"}
scp -r client.rosenpass-public user@server:/path/to/directory
```

**Congrats! This completes the setup of the key pairs.**


### Launch your Rosenpass-enhanced WireGuard VPN

In the following two commands, replace `$SERVERIP` with the IP address under which the client can reach the server. This might be a publicly routable IP address, an IP address within your local network, or even the loopback address `127.0.0.1`.

Equally, replace `$DEVICE` by the name of the network device on which the server receives packets for the `$SERVERIP`.

You can find information about the network device and IP addresses using the command:

```sh{class="starter-code-server command-user"}
ip a
```


#### 4. Start the VPN

Start the Rosenpass and WireGuard processes on both server and client. This creates a WireGuard network interface named `rosenpass0`, which allows us, in the next step, to assign an internal IP address and to add a route for the internal network.

In the following two commands, remember to replace `$SERVERIP` with the IP address under which the client can reach the server.

```sh{class="starter-code-server-root"}
rp exchange server.rosenpass-secret dev rosenpass0 listen $SERVERIP:9999 \
peer client.rosenpass-public allowed-ips 192.168.21.0/24
```
```sh{class="starter-code-client-root"}
rp exchange client.rosenpass-secret dev rosenpass0 \
peer server.rosenpass-public endpoint $SERVERIP:9999 allowed-ips 192.168.21.0/24
```

If you like, you can already check if Rosenpass manages to exchange a shared secret by skipping to [Step 8 “Test the Rosenpass handshake”](#8-test-the-rosenpass-handshake), and coming back to Step 5 and following afterwards.

#### 5. Assign IP addresses

In this example, we use addresses from the internal network `192.168.21.0/24` within the VPN. Feel free to try something else, but make sure to adapt IP addresses and networks in all command where necessary.

```sh{class="starter-code-server-root"}
ip a add 192.168.21.1 dev rosenpass0
```
```sh{class="starter-code-client-root"}
ip a add 192.168.21.2 dev rosenpass0
```

#### 6. Add routes for the WireGuard network

Verify that the routing table containes an entry for the internal network `192.168.21.0/24`. You can do so with the following command:

```sh{class="command-user"}
ip route
```
Its output should contain a line about the `192.168.21.0/24` network, mentioning the interface `rosenpass0`:
```bash
…
192.168.21.0/24 dev rosenpass0 scope link
…
```
If such a line is not present, you can add a route using:
```sh{class="command-root"}
ip route add 192.168.21.0/24 dev rosenpass0
```
Remember to verify and do this on both server and client.


#### 7. Configure your firewall

**Not sure if you are behind a firewall?** You can skip this step and come back in case you cannot get a connection to work.

In this example, the server needs to be reachable on two ports: `9999` for the Rosenpass connection, and `10000` for the WireGuard connection. Port `9999` is explicitly configured in the command used in the next step. The WireGuard port is implicitly set by the `rp` tool to the Rosenpass port number incremented by one, `10000` in this example.

**Configure your firewall(s)** such that incoming UDP packets on ports `9999` and `10000` are allowed.

If you use `ufw`, you can follow the [firewall guidance in our Ubuntu guide](ubuntu/#7-configure-your-firewall).

If you use `nft`/nftables, you can use the following command to add a rule that satisfies Rosenpass' requirements. This command assumes that the appropriate firewall table and chain are called `filter` and `input`; both are the standard names used in nftables' example configuration. Remember to replace `$SERVERIP` with the IP address under which the client can reach the server, and `$DEVICE` by the name of the network device on which the server receives packets for the `$SERVERIP`.

```sh{class="starter-code-server-root"}
nft add rule inet filter input iif $DEVICE udp dport { 9999, 10000 } ip daddr $SERVERIP accept
```

Make sure to save this rule such that it persists across reboots. One way is to add it to `/etc/nftables.conf`.

### Just to be sure: Verify the magic!

#### 8. Test the Rosenpass handshake

As a first test, check if Rosenpass manages to exchange a shared secret and to hand it over to WireGuard.
You could also already check this when you finished Step 4, but skipped Steps 5, 6, and possibly 7. If you skipped Step 7 and the Rosenpass handshake does not work, make sure to go back to [Step 7 and check your firewall settings](#7-configure-your-firewall).

On both the server and the client, you can run the following command to see which pre-shared key WireGuard is using for the connection:

```sh{class="command-root"}
wg show rosenpass0 preshared-keys
```

The output should show one line consisting of two base64-encoded strings, separated by a space. The second string is the pre-shared key. This should be the same on both machines. It changes approximately every two minutes:

```bash
q1ySvWXjsS2l0Apu2f9YZLw7pLT4+QXfIZVTpMBO01I=    (redacted)
```

Likewise on both server and client, you can display the state of the WireGuard connection:

```sh{class="command-root"}
wg show rosenpass0
```

On the client, you should see an output like this, where `$SERVERIP` matches the IP address configured earlier:

```bash
interface: rosenpass0
  public key: 1NQJ1iObOnkkWlqDU6bhqGPEjCIIvKTKjI10XE0t7DA=
  private key: (hidden)
  listening port: 52922

peer: q1ySvWXjsS2l0Apu2f9YZLw7pLT4+QXfIZVTpMBO01I=
  preshared key: (hidden)
  endpoint: $SERVERIP:10000
  allowed ips: 192.168.21.0/24
```

And on the server, you should see an output like this, with WireGuard listening port `10000`:

```bash
interface: rosenpass0
  public key: q1ySvWXjsS2l0Apu2f9YZLw7pLT4+QXfIZVTpMBO01I=
  private key: (hidden)
  listening port: 10000

peer: 1NQJ1iObOnkkWlqDU6bhqGPEjCIIvKTKjI10XE0t7DA=
  preshared key: (hidden)
  allowed ips: 192.168.21.0/24
```

The public key and the peer should match each other, respectively.


You can watch how Rosenpass continuously replaces the WireGuard PSK with the following command that combines the two above commands and repeats them every 2 seconds:

```sh{class="command-root"}
watch -n 2 'wg show all; wg show all preshared-keys'
```

#### 9. Test the WireGuard connection

You can test the WireGuard connection by pinging the server's internal IP address from the client peer and vice versa:

```sh{class="starter-code-server command-user"}
ping 192.168.21.2
```
```sh{class="starter-code-client command-user"}
ping 192.168.21.1
```


**All done and the ping test works?**

Rosenpass will now generate a new PSK key for WireGuard about every two minutes and keep your WireGuard VPN connection secure against post-quantum computer attacks.


{{% /blocks/section %}}

{{< blocks/lead color="secondary" class="title-box" >}}
## Installation via the Package Manager
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets package" %}}

**This is not ready, yet!** In the meanwhile, **you are advised to use the [installation via binary files](#installation-via-binary-files)**.

For the current version v0.2.2, we unfortunately do not yet provide .deb packages. As of the next Rosenpass release, you will be able to download a .deb package and install Rosenpass via your package manager.

For the technically inclined user, the work preparing for this has already been done with a [Nix package](https://github.com/rosenpass/rosenpass/blob/main/pkgs/package-deb.nix) and a [CI workflow](https://github.com/rosenpass/rosenpass/blob/main/pkgs/package-deb.nix).

{{% /blocks/section %}}
