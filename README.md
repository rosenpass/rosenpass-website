# rosenpass-website
Website for project Rosenpass (quantum secure VPN key exchange)


## Information

### Google Analytics
As we use the Docsy theme with Hugo, which is produced by Google, the Docsy submodule has files relating to data gathering for Google Analytics. We have taken care to ensure that these components cannot be called in the built website.

## Website Components

### Hugo
The website is built with Hugo, which generates a static site.

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

### Initialising
One nix package manager is installed:
- clone the repo (if not already)
- git submodule init (if not already)
- git submodule update

### Everyday Use

- A development shell can be started using `nix develop`. It contains NodeJS and Hugo,
plus a couple of handy commands, the list of which can be shown by invoking `menu`.
```nix develop```

- Serve the website to a localhost, usually 1313
```serve```

- Build the website
```website```
    - Note that the "build" command on its own does not work. The website command inputs "nix build 'submodules=1#website'" which is necessary to function

- The built files are located in the "result" folder

### Debugging
If the result folder is not accessible, try:

- Find the path info
``` nix path-info 'submodules=1#website' ```

- Using the path from the last command's output, manually add the root:
``` nix-store --realise --add-root [output of last command]```

Even if required, these steps should only need to be used once, and may have just been a quirk of my (Alice) set up.


