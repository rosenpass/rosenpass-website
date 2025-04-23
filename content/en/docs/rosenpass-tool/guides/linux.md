---
aliases: [/docs/compilation, /docs/rosenpass-tool/compilation]
title: "Rosenpass Installation and Usage on Linux"
linkTitle: "Generic Linux"
weight: 5
menu: false
hideLead: true
type: docs
shortBlerb: "Manually set up Rosenpass"
blerb: "A guide on how to install Rosenpass via pre-compiled binary files or manual compilation. This can be used on Linux systems for which Rosenpass does not yet provide a dedicated guide, nor a package."
---

{{< blocks/lead color="secondary" class="title-box" >}}
## Rosenpass Installation and Usage on Linux
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets package" %}}

Below is a guide on how to install Rosenpass via pre-compiled binary files or manual compilation.
This can be used on Linux systems for which Rosenpass does not yet provide a dedicated guide, nor a package.
Currently, most users should start with the [Installation via the Binary Files](#installation-via-binary-files).
If you are using [Ubuntu](ubuntu) or [Debian](debian), please follow our dedicated guides for these distributions.

Table of Contents:
* [Installation via the Binary Files](#installation-via-binary-files): Most users can start here.
* [Compile Rosenpass from Source](#compile-it-from-source): Some users might need to go the manual way.
* [Set up a Rosenpass-enhanced WireGuard VPN](#set-up-a-rosenpass-enhanced-wireguard-vpn): After installation, you can proceed here.

<span class="spacer"></span>
{{% /blocks/section %}}

{{< blocks/lead color="secondary" class="title-box" >}}
## Compile it from source
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets compilation" %}}


<span class="spacer"></span>

- You can compile Rosenpass yourself. This gives you the advantage of ensuring that you use Rosenpass as exactly as the source code is in Git.

1. Install the dependencies. Under Debian, you can do this with the following command: 

<span class="codebox">

```sh
sudo apt-get --yes install libsodium-dev libclang-dev cmake pkg-config git build-essential
```

</span>

2. If you want to use Rosenpass with WireGuard, install WireGuard. On Debian, you can do this with the following command: 

<span class="codebox">

```sh 
sudo apt-get --yes install wireguard
```
</span>

3. Install Rust >= 1.64.0 (as of 2023-07-01). This can be achieved using [Rustup](https://rustup.rs/), for example.
<span class="spacer"></span>
4. Clone the Git Repository: 

<span class="codebox">

```sh
git clone https://github.com/rosenpass/rosenpass.git
```

</span>

5. Change to the Rosenpass directory: 

<span class="codebox">

```sh
cd rosenpass
```

</span>

6. Switch to the version you want to install. Without switching, you will install and compile the dev version. Find the name of the version that you would like to install on the [releases page](https://github.com/rosenpass/rosenpass/releases), or [find the name of the latest release](https://github.com/rosenpass/rosenpass/releases/latest). Use the following command to switch to version, e.g., 0.2.2: 

<span class="codebox">

```sh
git checkout v0.2.2
```

</span>

7. Compile Rosenpass, this may take a while:

<span class="codebox">

```sh
cargo build --release
```

</span>

8. Install Rosenpass: 

<span class="codebox">

```sh
sudo install target/release/rosenpass /usr/local/bin
```

</span>

9. If you want the Rosenpass helper:

<span class="codebox">

```sh
rp
```

</span>

It can be installed it with: 

<span class="codebox">

```sh
sudo install rp /usr/local/bin
```

</span>
<span class="spacer"></span>

**That's it! You have now downloaded, compiled, and installed Rosenpass.**

<span class="spacer"></span>

{{< /blocks/section >}}

{{< blocks/lead color="secondary" class="title-box" >}}
## Installation via binary files
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets compilation" %}}

<span class="spacer"></span>

- If Rosenpass is not yet available for your distribution, you can attempt to download it manually.

1. Download the desired version for your operating system from the [releases page](https://github.com/rosenpass/rosenpass/releases/), or directly jump to the [latest version](https://github.com/rosenpass/rosenpass/releases/latest).
<span class="spacer"></span>
2. Unzip the file. On Linux you can use tar for this: 

<span class="codebox">

```sh
tar xf rosenpass-x86_64-linux-0.2.2.tar
```

</span>

3. Install Rosenpass: 

<span class="codebox">

```sh
sudo install bin/rosenpass /usr/local/bin
```

</span>

4. If you want the Rosenpass helper:

<span class="codebox">

```sh
rp
``` 

</span>

It can be installed it with: 

<span class="codebox">

```sh
sudo install bin/rp /usr/local/bin
```

</span>

5. Delete the downloaded files:

<span class="codebox">

```sh
rm -r rosenpass-x86_64-linux-0.2.2.tar bin/
```

</span>

<span class="spacer"></span>

**That's it! You have now downloaded and installed Rosenpass.**

<span class="spacer"></span>

{{< /blocks/section >}}

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

```sh{class="starter-code-server command-user"}
scp -r server.rosenpass-public user@client:/path/to/directory
```
```sh{class="starter-code-client command-user"}
scp -r client.rosenpass-public user@server:/path/to/directory
```

**Congrats! This completes the setup of the key pairs.**


### Launch your Rosenpass-enhanced WireGuard VPN

#### 4. Start the VPN

**Note:** This may conflict with your firewall. In that case, you will need to configure your firewall to give Rosenpass access to the port number explicitly mentioned in these commands, `9999` in this example, as well as give WireGuard access to this port number incremented by one, `10000` in this example.

```sh{class="starter-code-server-root"}
rp exchange server.rosenpass-secret dev rosenpass0 listen 127.0.0.1:9999 \
peer client.rosenpass-public allowed-ips fe80::/64
```
```sh{class="starter-code-client-root"}
rp exchange client.rosenpass-secret dev rosenpass0 \
peer server.rosenpass-public endpoint 127.0.0.1:9999 allowed-ips fe80::/64
```

#### 5. Assign IP addresses

```sh{class="starter-code-server-root"}
ip a add fe80::1/64 dev rosenpass0
```
```sh{class="starter-code-client-root"}
ip a add fe80::2/64 dev rosenpass0
```

### Just to be sure: Verify the magic!

#### 6. Test the connection

You can test the connection by pinging the server from the client peer and vice versa:

```sh{class="starter-code-client command-user"}
ping fe80::1%rosenpass0
```
```sh{class="starter-code-server command-user"}
ping fe80::2%rosenpass0
```

#### 7. Watch how Rosenpass replaces the WireGuard PSK

You can watch how Rosenpass replaces the WireGuard PSK with the following command:

```sh{class="command-root"}
watch -n 2 'wg show all; wg show all preshared-keys'
```

**All done!**

Rosenpass will now generate a new PSK key for WireGuard about every two minutes and keep your VPN connection secure against post-quantum computer attacks.


{{< /blocks/section >}}