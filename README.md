# rosenpass-website
Website for project Rosenpass (quantum secure VPN key exchange)

# Getting started with Nix

Due to a quirk in the handling of submodules, building the website requires some magic:

```console
nix build '.?submodules=1#website'
```

A development shell can be started using `nix develop`. It contains NodeJS and Hugo,
plus a couple of handy commands, the list of which can be shown by invoking `menu`.
