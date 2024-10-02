---
title: "Compilation and Installation"
linkTitle: "Compilation and Installation"
weight: 4
menu: false
type: docs
shortBlerb: "Manually set up Rosenpass"
blerb: "A guide on how to compile the Rosenpass tool yourself, including installation via the binary files. This is useful if you want to use the Rosenpass tool on systems we do not currently provide packages for."
---

Below is a guide on how to compile Rosenpass yourself, including via the binary files. This can be used to compile Rosenpass for systems not yet fully supported, such as Debian, and provides a more customised experience.


{{% blocks/comp-nav %}} 


{{< blocks/lead color="secondary" class="title-box" >}}
## Compile it yourself
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