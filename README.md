# rosenpass-website
website for project [Rosenpass](https://rosenpass.eu/) (quantum-secure VPN key exchange)

## 🛠️ Build and Run
As prerequisites, you have to:
1. [install Nix](https://nixos.org/download/)
2. use extra Nix features by running: `export NIX_CONFIG="experimental-features = nix-command flakes"` ([documentation](https://nixos.wiki/wiki/flakes#Enable_flakes_temporarily))
3. clone the [repository](https://github.com/rosenpass/rosenpass-website.git)

Now, you can:
- **build** the website by running `nix build`
- **run** the website locally by running `nix run .#server`
- **install** a development environment by running `nix develop`

You do *not* need to worry about this repo's git submodules – they are already handled by Nix.

## Information

### Deactivated Google Analytics
As we use the Docsy theme with Hugo, which is produced by Google, the Docsy submodule has files relating to data gathering for Google Analytics. We have taken care to ensure that these components cannot be called in the built website.

## Website Components

### Hugo
The website is built with Hugo, which generates a static site.

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
- The website is hosted at Flokinet.
- The rollout is automated via GitHub Actions: every push to `main` (or `beta`) builds the site with Nix and uploads it via FTPS.
- The website runs on nginx instead of apache for security reasons, so no .htaccess etc.
- **CAUTION**: Don't delete the folders "whitepaper" and "kaffeepause", as they are not in the github repository!


## CI/CD Pipeline
The website is built and deployed via GitHub Actions workflows. Therefore, any push to the main branch will trigger a rebuild of the website. Instead, please open a pull request for anything other than small content updates. If you are working on something larger than that, you can merge/push to the `beta` branch, which will build and deploy to https://beta.rosenpass.eu where you can test your output before trying to merge into the main branch.

### beta.rosenpass.eu
This beta subdomain is protected by a HTTP authentication request. This is purely to prevent search engine scrapers from noticing a (near) duplicate website and tanking our ranking as a result.
Username: website
Password: pleaseletmein
