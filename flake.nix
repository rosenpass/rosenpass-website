{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    devshell.url = "github:numtide/devshell";
    devshell.inputs.nixpkgs.follows = "nixpkgs";
    npmlock2nix = {
      url = "github:nix-community/npmlock2nix";
      flake = false;
    };
  };

  outputs = { self, nixpkgs, flake-utils, devshell, ... }@inputs:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            devshell.overlays.default
            (final: prev: {
              npmlock2nix = import inputs.npmlock2nix { pkgs = prev; };
            })
          ];
        };
      in
      rec
      {
        # build node_modules including bin/ from the npm json files
        packages.node_modules = pkgs.npmlock2nix.v2.node_modules {
          src = "dummy";
          packageJson = ./package.json;
          packageLockJson = ./package-lock.json;
        };

        # build the actual website
        packages.website = pkgs.stdenvNoCC.mkDerivation {
          name = "rosenpass-website";
          src = ./.;
          nativeBuildInputs = with pkgs; [ hugo groff packages.node_modules ];
          buildPhase = ''
            runHook preBuild
            ln --symbolic -- ${packages.node_modules}/node_modules ./
            hugo
            runHook postBuild
          '';
          installPhase = ''
            runHook preInstall
            cp --recursive -- public $out/
            runHook postInstall
          '';
        };

        devShells.default = (pkgs.devshell.mkShell {
          imports = [ "${devshell}/extra/git/hooks.nix" ];
          name = "rosenpass-website-dev-shell";
          packages = with pkgs; [
            groff
            hugo
            nodejs
            nodePackages.prettier
          ];
          git.hooks = {
            enable = true;
            pre-commit.text = ''
              nix flake check
            '';
          };
          commands = [
            {
              name = "build";
              # dev dependencies include "hugo-extended", which fails to
              # install on NixOS due to shipping a not runnable hugo binary
              command = ''
                npm ci --omit=dev
                hugo $@
              '';
              help = "build the website";
            }
            {
              name = "serve";
              command = ''
                npm ci --omit=dev
                hugo server $@
              '';
              help = "run hugo in server mode";
            }
            {
              name = "clean";
              command = ''
                cd "$PRJ_ROOT"
                rm --force --recursive -- node_modules public
              '';
              help = "remove public/ and node_modules/";
            }
          ];
        });
      }
    );
}
