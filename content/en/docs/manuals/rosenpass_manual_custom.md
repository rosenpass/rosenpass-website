---
linkTitle: ""
weight: 100
menu: false
type: docs
---

{{% blocks/section color="light" class="no-flex" %}}
<div class="manpage">

## **General Commands Manual**

### Name
Rosenpass - builds post-quantum secure VPNs

### Synopsis

```sh
rosenpass [COMMAND] [OPTIONS ...] [ARGS ...]
```

### Description
Rosenpass performs cryptographic key exchanges, that are secure against quantum computers, and outputs the keys. These keys can then be passed to various services, such as WireGuard or other VPN services, as pre-shared keys to achieve security against attackers with quantum computers.

This is a research project and quantum computers are not thought to become practical in less than ten years. If you are not specficially tasked with developing post-quantum secure systems, you probably do not need this tool.

### Commands

```sh
keygen private-key <file-path> public-key <file-path>
```

Generate a keypair to use in the exchange command later. Send the public-key file to your communication partner and keep the private-key file secret!

```sh
exchange private-key <file-path> public-key <file-path> [OPTIONS] PEERS
```

Start a process to exchange keys with the specified peers. You should specify at least one peer.

- Its options are as follows:

<span class="indented-boxes"> 

```sh
listen <ip>[:<port>]
```
Instruct rosenpass to listen on the specified interface and port. By default, rosenpass will listen on all interfaces and select a random port.

```sh
verbose
```
Extra logging.

</span>

### Peer

Each PEER is defined as follows: 

```sh
peer public-key <file-path> [endpoint <ip>[:<port>]] [preshared-key <file-path>] [outfile <file-path>] [wireguard <dev> <peer> <extra_params>]
```

Providing a PEER instructs rosenpass to exchange keys with the given peer and write the resulting PSK into the given output file. You must either specify the outfile or wireguard output option.

- The parameters of PEER are as follows:

<span class="indented-boxes"> 

```sh
endpoint <ip>[:<port>]
```
Specifies the address where the peer can be reached. This will be automatically updated after the first successful key exchange with the peer. If this is unspecified, the peer must initiate the connection.

```sh
preshared-key <file-path>
```
You may specify a file to write the exchanged keys to. If this option is specified, rosenpass will write a notification to standard out every time the key is updated.

```sh
wireguard <dev> <peer> <extra_params>
```
This allows you to directly specify a wireguard peer to deploy the pre-shared-key to. You may specify extra parameters you would pass to "wg set" besides the preshared-key parameter which is used by rosenpass. This makes it possible to add peers entirely from rosenpass.

</span>

### Exit Status
The rosenpass utlity exits 0 on success, and >0 if an error occurs.

### See Also
rp(1), wg(1)

### Standards 
This tool is the reference implementation of the Rosenpass protocol, written by Karolin Varner, Benjamin Lipp, Wanja Zaeske, and Lisa Schmidt.

### Authors
Rosenpass was created by Karolin Varner, Benjamin Lipp, Wanja Zaeske, Marei Peischl, Stephan Ajuvo, and Lisa Schmidt.

This manual page was written by Emil Engler

### Bugs
The bugs are tracked at https://github.com/rosenpass/rosenpass/issues.
</div>
{{% /blocks/section %}}