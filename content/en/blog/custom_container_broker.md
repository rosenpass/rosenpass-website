---
title: "Rosenpass PSK Broker with Custom Container"
linkTitle: "Showcasing the PSK Broker Architecture with a Custom Rosenpass Container"
description: "Proof-of-concept of the PSK broker architecture, where one of the Rosenpass peers runs inside a custom-built Podman container"
author: "Benjamin Lipp"
date: 2025-01-10
blogpost: "true"
shortBlerb: "Using Rosenpass inside a container and with a PSK broker"
---

One key strength of Rosenpass used together with WireGuard is that this setup leaves WireGuard itself unchanged – the WireGuard protocol does not change, the WireGuard implementation does not change, and the flow of packets transmitted via the WireGuard tunnel does not change. The only thing that changes is WireGuard's pre-shared key: it changes from an all-zero-by-default value to a uniformly random value calculated by Rosenpass. This means that if you trust the implementation of WireGuard, not much trust in Rosenpass is needed. In this tutorial, we show how to reduce this footprint even more. We demonstrate how to move the majority of Rosenpass into a Linux container, and only leave a tiny portion of code running on the host machine. This code is a PSK broker that acts as agent between Rosenpass and WireGuard, only handing over the pre-shared key. This broker has a small code base that can be audited much easier than the entire Rosenpass code base.

In the following, we walk through the setup of two Rosenpass peers and two WireGuard peers. For the sake of simplicity of this proof-of-concept, both WireGuard peers are set up directly on the host machine, as well as one of the Rosenpass peers. The second Rosenpass peer runs inside of a Podman container, and communicates its pre-shared key to the WireGuard peer running on the host via a PSK broker that also runs on the host.

The tutorial consists of the following parts:
* First, we compile Rosenpass and create an OCI container image. For the PSK broker feature, we need to use the unreleased development version.
* Second, we configure the Rosenpass and WireGuard peers.
* Finally, we start the peers and observe a successful handshake.
## Build Requirements
Before proceeding with the compilation, please make sure that your machine meets the [prerequisites for building Rosenpass](https://rosenpass.eu/docs/rosenpass-tool/compilation/): that's the build dependencies and Rust. Additionally, you need to install WireGuard, Podman (or Docker, if you prefer), and the Nix package manager.
## Compiling the Development Version of Rosenpass
We start by cloning the Rosenpass Git repository:
```sh
git clone https://github.com/rosenpass/rosenpass.git
```

For the build with the broker API, a small modification to the Nix-based build comes in handy. For convenience, simply check out a branch that we prepared accordingly:
```sh
git checkout dev/blipp/build_with_experiment_api
```
If you are curious, you can look at the [single line that was added](https://github.com/rosenpass/rosenpass/commit/bf67344e86a2d25a362ad3077dc21be0c057affa) in this branch, compared to the `main` branch.

For the Rosenpass peers and the broker that runs directly on the host, we compile Rust binaries with the appropriate feature flag:
```sh
cargo build --release --features experiment_api
```
This creates a few binaries in the directory `target/release`. Make sure that they are in your `PATH`, e.g., by executing `export PATH=$PATH:$REPO/target/release` in all terminals that you use in the following, or by including it into your shell's config file, e.g., `.bashrc`. Here, `$REPO` must contain the absolute path to the cloned Rosenpass Git repository.

The binary `rosenpass-wireguard-broker-privileged` needs to be set up with the capability to manage the WireGuard network interface, to be able to hand over the pre-shared keys:
```sh
sudo setcap CAP_NET_ADMIN=+eip target/release/rosenpass-wireguard-broker-privileged
```
This way, the broker can be run without `sudo`, later.

Next, we create the OCI container image using a build via our Nix flake:
```sh
nix build .#rosenpass-oci-image
```
This creates a file `result` in the root of the repository. Load it into Podman as follows:
```sh
podman load -i result
```
  and note the image's name, which should start with `localhost/rosenpass-oci:` followed by a base64 hash.

## Configuring Rosenpass and WireGuard Peers
We call the first peer `rp0` and it will run directly on the host. The second peer, `rp1`, will have his Rosenpass part run in the container. Because the container needs to access the configuration files of `rp1`, we place them in a subdirectory `rp1_mount` that we will mount into the container later. 

We place the config files for `rp0` in the main directory of the experiment. With the following three commands, we prepare the `rp0` WireGuard peer:
```sh
wg genkey > rp0.wg.sk`
wg pubkey < rp0.wg.sk > rp0.wg.pk`
wg genpsk > rp0_invalid.psk`
```

Similarly, we prepare the `rp1` WireGuard peer:
```sh
mkdir rp1_mount
cd rp1_mount
wg genkey > rp1.wg.sk`
wg pubkey < rp1.wg.sk > rp1.wg.pk`
wg genpsk > rp1_invalid.psk`
```

The pre-shared keys will be different, and this is on purpose: This way, the WireGuard handshake will fail until the first Rosenpass handshake is successfull, and thus, a hybrid post-quantum-secure channel can be established.

Now, we prepare the Rosenpass config files. For `rp0`, we use the contents of `rp1_mount/rp1.wg.pk` as WireGuard `peer`, and vice versa. In the code listings, we use our example keys; replace them by your own values when you run the experiment, or just use [our example files that we provide in a repository](https://github.com/rosenpass/container-tutorial).

rp0.toml:
```toml
public_key = "rp0.rp.pk"
secret_key = "rp0.rp.sk"
listen = ["127.0.0.1:9998"]
verbosity = "Verbose"

[[peers]]
public_key = "rp1.rp.pk"
endpoint = "127.0.0.1:10000"

key_out = "rp0-key-out"
device = "rp0"
peer = "MFKkyDTjFsiIaIJKcYR9jYk7Wre3I0KkY5V8HzveNHg="
```

rp1_mount/rp1.toml:
```toml
public_key = "rp1.rp.pk"
secret_key = "rp1.rp.sk"
listen = ["127.0.0.1:10000"]
verbosity = "Verbose"

[[peers]]
public_key = "rp0.rp.pk"
endpoint = "127.0.0.1:9998"

key_out = "rp1-key-out"
device = "rp1"
peer = "SCceTmI5B3uLr+5fid18zbUGQruJYIZKeoSJiZLd8Ak="
```

In the main directory, run the following command to generate the Rosenpass keys:
```sh
rosenpass gen-keys rp0.toml
```
And in `rp1_mount`, respectively:
```sh
rosenpass gen-keys rp1.toml
````

The file `rp1.toml` will be mounted into the container, so we edit it to contain absolute paths working within the container:

rp1_mount/rp1.toml:
```toml
public_key = "/etc/rosenpass/rp1.rp.pk"
secret_key = "/etc/rosenpass/rp1.rp.sk"
listen = ["127.0.0.1:10000"]
verbosity = "Verbose"

[[peers]]
public_key = "/etc/rosenpass/rp0.rp.pk"
endpoint = "127.0.0.1:9998"

key_out = "/etc/rosenpass/rp1-key-out"
device = "rp1"
peer = "SCceTmI5B3uLr+5fid18zbUGQruJYIZKeoSJiZLd8Ak="
```

To finish the setup of the config files, we need to make the public keys available to the other peer, respectively. In the main directory, run the following commands:
```sh
mv rp0.rp.pk rp0.wg.pk rp1_mount
ln -s rp1_mount/rp{0,1}.{rp,wg}.pk .
```
This moves all public keys into the directory `rp1_mount` and places symbolic links in the main directory. We do this to prevent issues with the container mount, later.

This concludes the preparation of the config files, and we can proceed to create the two network interfaces for the two WireGuard peers:
```sh
sudo ip link add dev rp0 type wireguard
sudo ip link add dev rp1 type wireguard
```

Next, we set the configuration of the WireGuard peers:
```sh
sudo wg set rp0 listen-port 9999 private-key rp0.wg.sk peer MFKkyDTjFsiIaIJKcYR9jYk7Wre3I0KkY5V8HzveNHg= preshared-key rp0_invalid.psk endpoint 'localhost:10001' persistent-keepalive 10 allowed-ips fe80::/64

sudo wg set rp1 listen-port 10001 private-key rp1_mount/rp1.wg.sk peer SCceTmI5B3uLr+5fid18zbUGQruJYIZKeoSJiZLd8Ak= preshared-key rp1_mount/rp1_invalid.psk endpoint 'localhost:9999' allowed-ips fe80::/64
```
The option `persistent-keepalive 10` instructs WireGuard to send a keep-alive packet every 10 seconds. This is useful for us, because it triggers a WireGuard handshake. Otherwise, as both WireGuard network interfaces live on the same host, we would not see any handshakes happening, because a standard `ping` in the terminal would not go through the WireGuard tunnel but be directly routed.

We bring the network interfaces up as follows:
```sh
sudo ip link set rp0 up
sudo ip link set rp1 up
```

In this example with both interfaces living on the same host, we could do without assigning IP addresses, but in case you are using a more elaborate setup, this would be the time to assign IP addresses to the WireGuard interfaces:
```sh
sudo ip a add fe80::1/64 dev rp0
sudo ip a add fe80::2/64 dev rp1
```

This concludes the setup up of the Rosenpass and WireGuard peers.

## Starting the Peers and Observing a Handshake

For the final demonstration of the proof-of-concept, it is convenient to have 4 terminals open. In Terminal 1, we start Rosenpass peer `rp0` directly on the host:
```sh
sudo rosenpass -v exchange-config rp0.toml
```

In Terminal 2, we start a PSK broker for Rosenpass peer `rp1`. Note that it can be started as the current user, without `sudo`. It spawns a priviledged process using the network admin capabilities that we granted earlier.
```sh
rosenpass-wireguard-broker-socket-handler --listen-path rp1_mount/broker.sock
```
When you run this again later, make sure to delete the broker file `rp1_mount/broker.sock`. Otherwise, you risk getting an error message along the lines of an address already being in use.

In Terminal 3, we start the Rosenpass peer `rp1` in a Podman container:
```sh
podman run -it --rm --name rp --volume ./rp1_mount/:/etc/rosenpass/ --network pasta -p=10000:10000/udp rosenpass-oci:x48rnzwv7a584a0w7pl2lb46acic3j1f rosenpass -v --psk-broker-path /etc/rosenpass/broker.sock exchange-config /etc/rosenpass/rp1.toml
```
With this command, we mount the directory `rp1_mount` into the container at location `/etc/rosenpass`, and connect port `10000` between host and container, as this is the port on which Rosenpass peer `rp1` listens for incoming packets. We use Podman's `pasta` network mode, as it made the host–container networking work for us, immediately. In the container, we run `rosenpass` with the option `psk-broker-path`, indicating the socket file `broker.sock` that the PSK broker is listening to on the host. Notice that both the PSK broker and the Podman container run as the current user, which allows the Podman container to write to it.

If all goes well, we can now observe an output in Terminal 3 that looks similar to the following:
```
[2025-01-09T23:32:09Z INFO  rosenpass::app_server] Exchanged key with peer 7CL/qpfqsX6SStberHTZJ7D1qjC27hQv7M15/eg1RR8=
output-key peer 7CL/qpfqsX6SStberHTZJ7D1qjC27hQv7M15/eg1RR8= key-file "rp1-key-out" exchanged
```
Terminal 1 should show a similar output, as well. This indicates that the two Rosenpass peers conducted a handshake and agreed on a shared key.

In Terminal 4, you can run
```sh
sudo wg show all
```
to see the state of the two WireGuard interfaces. If a line with `latest handshake` shows up, you know that the PSK has been exchanged and set successfully on both WireGuard peers:
```       
interface: rp0
  public key: SCceTmI5B3uLr+5fid18zbUGQruJYIZKeoSJiZLd8Ak=
  private key: (hidden)
  listening port: 9999

peer: MFKkyDTjFsiIaIJKcYR9jYk7Wre3I0KkY5V8HzveNHg=
  preshared key: (hidden)
  endpoint: 127.0.0.1:10001
  allowed ips: fe80::/64
  latest handshake: 19 seconds ago
  transfer: 1.08 KiB received, 157.88 KiB sent
  persistent keepalive: every 10 seconds

interface: rp1
  public key: MFKkyDTjFsiIaIJKcYR9jYk7Wre3I0KkY5V8HzveNHg=
  private key: (hidden)
  listening port: 10001

peer: SCceTmI5B3uLr+5fid18zbUGQruJYIZKeoSJiZLd8Ak=
  preshared key: (hidden)
  endpoint: 127.0.0.1:9999
  allowed ips: fe80::/64
  latest handshake: 19 seconds ago
  transfer: 157.88 KiB received, 95.32 KiB sent
```

You can use
```sh
sudo wg show all preshared-keys
```
to display the plaintext pre-shared keys of both WireGuard peers and compare that they are indeed the same.

Finally, you can can stop the container using the following command:
```sh
podman container kill rp
```
and kill the processes in Terminal 1 and 2 using `Ctrl+C`.

## Conclusion
In this tutorial, we have shown that Rosenpass can be run in an OCI container, with only a small PSK broker process running directly on the host. You could also use the outfile option of Rosenpass to write the PSK to a file on the host, and use your own script to hand the PSK to WireGuard.

Thanks to Paul for helping with setting up and debugging this proof-of-concept. Thanks to Wanja for helping build the container image with the `experiment_api` feature.

The work on this write-up has been funded by the [Sovereign Tech Agency](https://www.sovereign.tech).

We would love to hear from you if you have questions or comments, and also if you would like to explore working together on Rosenpass-related projects. Feel free to [reach out to us](https://rosenpass.eu/contributors/)!
