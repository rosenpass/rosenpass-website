# rosenpass-website
Website for project Rosenpass (quantum secure VPN key exchange)


## Website ressources

### Hugo
The website is built with Hugo, which generates a static site.
There is a Github Action (= CI) is triggered every time there is a commit to the **main** branch, which generates the static files. 

Commands to remember: 
**Mullana (Windows)**
In Powershell 7(+) (with npm, node and chocolatey):
- npm update (after git pull)
- hugo server (serve site on localhost)
- hugo (generate static files)

**Alice**
- ...

### Whitepaper
**TODO**: The Whitepaper is currently not automatically pulled from the repo anymore. 
- it comes from https://github.com/rosenpass/rosenpass/blob/papers-pdf/whitepaper.pdf
- and goes into the website root (htdocs/rosenpass on servercow)

### Manuals
**TODO**: Manuals are are currently not automatically pulled from the repo anymore. 
- Source?
- They go into the website main branch at rosenpass\content\en\docs\manuals

### Conference Presentations
- Conference PDFs are added manually. 
- They're in https://github.com/rosenpass/slides
- They need a title image (e.g. Screenshot from Conference banner or from slides) in 4:1, e.g 400x100px

### Release Notes
- **TODO**: Release notes need to be added (automatically).

## Hosting
- The website is hosted on servercow. 
- There is currently no automated rollout. You have to move the files via FTP. 
- The website runs on nginx instead of apache for security reasons, so no .htaccess etc.
- **CAUTION**: Don't delete the folders "whitepaper" and "kaffeepause", as they are not in the github repository!

## Tips and Tricks

### ...


## Getting started with Nix

Due to a quirk in the handling of submodules, building the website requires some magic:

```console
nix build '.?submodules=1#website'
```

A development shell can be started using `nix develop`. It contains NodeJS and Hugo,
plus a couple of handy commands, the list of which can be shown by invoking `menu`.
