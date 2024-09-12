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

  outputs = { self, nixpkgs, flake-utils, devshell, npmlock2nix, ... }@inputs:
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
      rec {
        packages.node_modules = pkgs.npmlock2nix.v2.node_modules {
          src = ./.;  # This should point to your source folder
          packageJson = ./package.json;
          packageLockJson = ./package-lock.json;
          nodejs = pkgs.nodejs_20;  # Explicitly use Node.js 20
        };

        packages.website = pkgs.stdenvNoCC.mkDerivation {
          name = "rosenpass-website";
          src = ./.;
          nativeBuildInputs = with pkgs; [ hugo groff packages.node_modules go git which ];
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

        packages.default = packages.website;

        devShells.default = (pkgs.devshell.mkShell {
          imports = [ "${devshell}/extra/git/hooks.nix" ];
          name = "rosenpass-website-dev-shell";
          packages = with pkgs; [
            groff
            hugo
            nodejs_20
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
              name = "website";
              command = ''
                ./changelog-check.sh
                git submodule update --init --recursive
                npm ci
                hugo $@
              '';
              help = "Build the website with submodules included and export to the result folder.";
            }
            {
              name = "build";
              command = ''
                git submodule update --init --recursive
                npm ci
                hugo $@
              '';
              help = "build the website";
            }
            {
              name = "serve";
              command = ''
                ./changelog-check.sh
                npm ci
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
