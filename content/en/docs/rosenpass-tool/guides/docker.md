---
title: "Rosenpass inside a Docker container"
linkTitle: "Docker"
weight: 20
menu: false
hideLead: true
type: docs
shortBlerb: "Set up and use Rosenpass with Docker"
blerb: "A guide on running Rosenpass+WireGuard inside a Docker container, using Docker images provided by Rosenpass."
---

{{< blocks/lead color="secondary" class="title-box" >}}
## Running Rosenpass inside a Docker Container
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets package" %}}

This page provides you with a usage guide for running Rosenpass and WireGuard inside a Docker container, and shows how to route the host's traffic through the VPN that the container provides.

Table of Contents:
* [WireGuard on the hosts, Rosenpass in containers](#wireguard-on-the-hosts-rosenpass-in-containers)
* [Rosenpass and WireGuard both in containers (on the same host)](#rosenpass-and-wireguard-both-in-containers-on-the-same-host)
* [Further reading](#further-reading)

{{% /blocks/section %}}

{{< blocks/lead color="secondary" class="title-box" >}}
## WireGuard on the hosts, Rosenpass in containers
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets compilation" %}}

This example assumes that you want to connect two hosts `server` and `client` via a Rosenpass-enhanced WireGuard VPN,
and that you want to run WireGuard directly on the hosts, and Rosenpass in a container, respectively. This can make sense when you trust WireGuard because it is integrated into the Linux kernel, and do not want to run Rosenpass directly on your host.

### Preparations

#### Create Directories

```sh{class="starter-code-server-user"}
mkdir -p ./workdir-server
```
```sh{class="starter-code-client-user"}
mkdir -p ./workdir-client
```

#### Export environment variables

We will use the following environment variables, please export them on both server and client:

```sh{class="code-block-list command-user"}
export NET=rp            # Docker network name
```
```sh{class="code-block-list command-user"}
export SERVERIP=a.b.c.d  # insert the IP under which the client can reach the server
```
```sh{class="code-block-list command-user"}
export CLIENTIP=a.b.c.d  # insert the IP under which the server can reach the client
```

#### Create a Docker Bridge Network

On both server and client, create a Docker network:
```sh{class="command-user"}
docker network create -d bridge $NET
```

### Prepare the Key Pairs

#### 1. Start by generating secret keys for both peers

**Note:** These will be stored in newly created `server.rosenpass-secret` and `client.rosenpass-secret` directories.

We run one command for the server:
```sh{class="starter-code-server-user"}
docker run -it --rm -v ./workdir-server:/workdir \
    ghcr.io/rosenpass/rosenpass:edge \
    gen-keys --public-key=workdir/server-public --secret-key=workdir/server-secret
```
```sh{class="starter-code-server-user"}
wg genkey | \
    tee ./workdir-server/wg-server-secret | \
    wg pubkey > ./workdir-server/wg-server-public
```




and one for the client:
```sh{class="starter-code-client-user"}
docker run -it --rm -v ./workdir-client:/workdir \
    ghcr.io/rosenpass/rosenpass:edge \
    gen-keys --public-key=workdir/client-public --secret-key=workdir/client-secret
```
```sh{class="starter-code-client-user"}
wg genkey | \
    tee ./workdir-client/wg-client-secret | \
    wg pubkey > ./workdir-client/wg-client-public
```


#### 2. Copy each `-public` directory to the other peer

Both peers need the `-public` directory of other peer, respectively, and it needs to be placed next to the `-secret` and `-public` directories that already exist:

Copy the server's public key to the client's working directory:
```sh{class="starter-code-client-user"}
scp \
    user@server:workdir-server/server-public \
    user@server:workdir-server/wg-server-public \
    workdir-client/
```
and the client's public key to the server's working directory:
```sh{class="starter-code-client-user"}
scp \
    workdir-client/client-public \
    workdir-client/wg-client-public \
    user@server:workdir-server/
```



### Launch Rosenpass

#### 4. Start Rosenpass

Make sure that the environment variable `$SERVERIP` is set to the IP address under which the
client can reach the server, `$CLIENTIP` to the IP address under which the server can reach
the client.

Make sure that UDP packets are left through by your firewall on port 9999 on both server and client.
You can find guidance for this in our [Ubuntu](/docs/rosenpass-tool/guides/ubuntu/#7-configure-your-firewall), [Debian](/docs/rosenpass-tool/guides/debian/#7-configure-your-firewall), and [Arch Linux](/docs/rosenpass-tool/guides/arch/#7-configure-your-firewall) guides.



Start the server container:
```sh{class="starter-code-server-user"}
docker run  --name "rpserver" --network ${NET} \
    -p ${SERVERIP}:9999:9999/udp \
    -it -d --rm -v ./workdir-server:/workdir ghcr.io/rosenpass/rosenpass:edge \
    exchange \
    private-key workdir/server-secret \
    public-key  workdir/server-public \
    listen ${SERVERIP}:9999 \
    peer public-key workdir/client-public \
    outfile workdir/server-sharedkey
```

If you get the error message `… rosenpass] Cannot assign requested address (os error 99)`, try with `listen 0.0.0.0:9999`.

Run the client container and perform the key exchange. 
```sh{class="starter-code-client-user"}
docker run --name "rpclient"  --network ${NET} \
    -p ${CLIENTIP}:9999:9999/udp \
    -it -d --rm -v ./workdir-client:/workdir ghcr.io/rosenpass/rosenpass:edge \
    exchange \
    private-key workdir/client-secret \
    public-key  workdir/client-public \
    peer public-key workdir/server-public endpoint ${SERVERIP}:9999 \
    outfile workdir/client-sharedkey
```

Now the containers will exchange shared keys and each put them into their respective outfile.

#### 5. Start WireGuard

```sh{class="starter-code-server-user"}
sudo ip link add dev rosenpass0 type wireguard
```
```sh{class="starter-code-server-user"}
sudo ip a add dev rosenpass0 192.168.21.1 peer 192.168.21.2
```
```sh{class="starter-code-server-user"}
sudo wg set rosenpass0 listen-port 10000 private-key ./workdir-server/wg-server-secret peer $(cat ./workdir-server/wg-client-public) allowed-ips 192.168.21.0/24 persistent-keepalive 25 preshared-key ./workdir-server/server-sharedkey
```
```sh{class="starter-code-server-user"}
sudo ip link set up dev rosenpass0
```



```sh{class="starter-code-client-user"}
sudo ip link add dev rosenpass0 type wireguard
```
```sh{class="starter-code-client-user"}
sudo ip a add dev rosenpass0 192.168.21.2 peer 192.168.21.1
```
```sh{class="starter-code-client-user"}
sudo wg set rosenpass0 listen-port 10000 private-key ./workdir-client/wg-client-secret peer $(cat ./workdir-client/wg-server-public) allowed-ips 192.168.21.0/24 endpoint $SERVER_IP:10000 persistent-keepalive 25 preshared-key ./workdir-client/client-sharedkey
```
```sh{class="starter-code-client-user"}
sudo ip link set up dev rosenpass0
```

### Steps to verify your setup


Comparing the outfiles shows that these shared keys equal:

```sh{class="starter-code-server-user"}
cat workdir-server/server-sharedkey
```
```sh{class="starter-code-client-user"}
cat workdir-client/client-sharedkey
```

It is now possible to set this key as pre-shared key within a WireGuard interface. For example as the server,

```sh{class="command-user"}
PREKEY=$(cat workdir-server/server-sharedkey)
wg set <server-interface> peer <client-peer-public-key> preshared-key <(echo "$PREKEY")
```






{{% /blocks/section %}}

{{< blocks/lead color="secondary" class="title-box" >}}
## Rosenpass and WireGuard both in containers (on the same host)
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets compilation" %}}

If you want to move the containers to separate hosts, you can try Docker overlay networks and swarm.

### Preparations

#### Create Directories

```sh{class="code-block-list command-user"}
mkdir -p ./workdir-server
```
```sh{class="code-block-list command-user"}
mkdir -p ./workdir-client
```

#### Create a Docker Bridge Network
```sh{class="code-block-list command-user"}
docker network create -d bridge rp
```
We will use the following environment variable to reuse the network's name:
```sh{class="code-block-list command-user"}
export NET=rp
```

### Prepare the Key Pairs

#### 1. Start by generating secret keys for both peers

**Note:** These will be stored in newly created `server.rosenpass-secret` and `client.rosenpass-secret` directories.

We run one command for the server:
```sh{class="command-user"}
docker run -it --rm -v ./workdir-server:/workdir \
    ghcr.io/rosenpass/rp:edge \
    genkey workdir/server.rosenpass-secret
```
and one for the client:
```sh{class="command-user"}
docker run -it --rm -v ./workdir-client:/workdir \
    ghcr.io/rosenpass/rp:edge \
    genkey workdir/client.rosenpass-secret
```

#### 2. Extract the public keys

**Note:** As above, these will be stored in newly created `server.rosenpass-public` and `client.rosenpass-public directories`.

Again once for the server:
```sh{class="command-user"}
docker run -it --rm -v ./workdir-server:/workdir \
    ghcr.io/rosenpass/rp:edge \
    pubkey workdir/server.rosenpass-secret workdir/server.rosenpass-public
```
and once for the client:
```sh{class="command-user"}
docker run -it --rm -v ./workdir-client:/workdir \
    ghcr.io/rosenpass/rp:edge \
    pubkey workdir/client.rosenpass-secret workdir/client.rosenpass-public
```

#### 3. Copy each `-public` directory to the other peer

Both peers need the `-public` directory of other peer, respectively, and it needs to be placed next to the `-secret` and `-public` directories that already exist:

Copy the server's public key to the client's working directory:
```sh{class="command-user"}
cp -r workdir-server/server.rosenpass-public \
    workdir-client/server.rosenpass-public
```
and the client's public key to the server's working directory:
```sh{class="command-user"}
cp -r workdir-client/client.rosenpass-public \
    workdir-server/client.rosenpass-public
```

**Congrats! This completes the setup of the key pairs.**

### Launch your Rosenpass-enhanced WireGuard VPN

#### 4. Start the VPN

Start the VPN server container:
```sh{class="ccommand-user"}
docker run  --name "rpserver" --network ${NET} -it -d --rm -v ./workdir-server:/workdir \
    --cap-add=NET_ADMIN \
    ghcr.io/rosenpass/rp:edge \
    exchange workdir/server.rosenpass-secret dev rosenpass0 \
    listen 0.0.0.0:9999 peer workdir/client.rosenpass-public allowed-ips 10.0.0.0/8
```
We note down some values we need to start the VPN client container:
```sh{class="ccommand-user"}
SERVER_CONTAINER="rpserver"
```
```sh{class="ccommand-user"}
EP=$(docker inspect --format '{{ .NetworkSettings.Networks.rp.IPAddress }}' $SERVER_CONTAINER)
```
and finally start the VPN client container:
```sh{class="command-user"}
docker run --name "rpclient"  --network ${NET} -it -d --rm -v ./workdir-client:/workdir \
    --cap-add=NET_ADMIN --cap-add=NET_RAW \
    ghcr.io/rosenpass/rp:edge \
    exchange workdir/client.rosenpass-secret dev rosenpass0 \
    peer workdir/server.rosenpass-public endpoint ${EP}:9999 allowed-ips 10.0.0.1
```


#### 5. Assign IP addresses
for the server:
```sh{class="command-user"}
docker exec -it rpserver \
    ip a add 10.0.0.1/24 dev rosenpass0
```

for the client:
```sh{class="command-user"}
docker exec -it rpclient \
    ip a add 10.0.0.2/24 dev rosenpass0
```

### Steps to verify your setup

#### 6. Test the WireGuard connection

Test the connection by starting a shell inside the client container, and ping the server through the VPN:

For the client:
```sh{class="code-block-list command-user"}
docker exec -it rpclient bash
```
```sh{class="code-block-list command-root"}
apt update; apt install iputils-ping
```
```sh{class="code-block-list command-root"}
ping 10.0.0.1
```
<span class="spacer"></span>

The ping command should continuously show ping logs:

```
PING 10.0.0.1 (10.0.0.1) 56(84) bytes of data.
64 bytes from 10.0.0.1: icmp_seq=1 ttl=64 time=0.119 ms
64 bytes from 10.0.0.1: icmp_seq=2 ttl=64 time=0.132 ms
64 bytes from 10.0.0.1: icmp_seq=3 ttl=64 time=0.394 ms
...
```

While the ping is running, you may stop the server container, and verify that the ping-log halts. In another terminal do:

```sh{class="code-block-list command-user"}
docker stop -t 1 rpserver
```


{{% /blocks/section %}}

{{< blocks/lead color="secondary" class="title-box" >}}
## Other Ideas
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets compilation" %}}




{{% /blocks/section %}}

{{< blocks/lead color="secondary" class="title-box" >}}
## Further Reading
{{< /blocks/lead >}}

{{% blocks/section color="light" class="no-flex contains-code-snippets compilation" %}}

[Test case: Client and server inside Docker on the same host](https://github.com/rosenpass/rosenpass/blob/main/docker/USAGE.md)

{{% /blocks/section %}}

{{% blocks/section color="light" class="no-flex contains-code-snippets package" %}}

<small>Version notice: This guide was last tested on May 21, 2025, under Ubuntu 24.10 Mantic Minotaur.</small>

{{% /blocks/section %}}