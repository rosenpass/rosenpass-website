{
  description = "Rosenpass website";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    self.submodules = true; # the website depends on the Docsy, Rosenpass and slides submodules – submodules supported by Nix >= 2.27.
  };

  outputs =
    { self, nixpkgs }:
    let
      inherit (nixpkgs) lib;

      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = lib.genAttrs systems;
      package_json_file = lib.importJSON ./package.json;
      perSystem = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          nodejs = pkgs.nodejs;

          nodeModules = pkgs.importNpmLock.buildNodeModules {
            npmRoot = ./.;
            inherit nodejs;
          };

          website = pkgs.stdenvNoCC.mkDerivation {
            pname = package_json_file.name;
            inherit (package_json_file) version;
            src = self.outPath;
            strictDeps = true;
            nativeBuildInputs = [
              nodejs
              pkgs.groff
              pkgs.hugo
            ];
            buildPhase = ''
              runHook preBuild
              ln -s ${nodeModules}/node_modules node_modules

              # Docsy expects these placeholder module directories when it is used as a
              # theme/submodule instead of as a Hugo module. Its npm postinstall hook
              # normally creates them.
              mkdir -p \
                themes/github.com/twbs/bootstrap \
                themes/github.com/FortAwesome/Font-Awesome

              export HUGO_CACHEDIR="$TMPDIR/hugo-cache"
              hugo
              runHook postBuild
            '';
            installPhase = ''
              runHook preInstall
              mkdir -p "$out"
              cp -r public/. "$out/"
              runHook postInstall
            '';
            meta = {
              inherit (package_json_file) description;
              homepage = "https://rosenpass.eu";
            };
          };
          server = pkgs.writeShellApplication {
            name = "rosenpass-website-server";
            runtimeInputs = [
              nodejs
              pkgs.coreutils
              pkgs.git
              pkgs.groff
              pkgs.hugo
            ];
            text = ''
              if [[ ! -f flake.nix || ! -f config.toml ]]; then
                echo >&2 "error: server must be run from the repository root"
                exit 1
              fi

              # Make sure all Git submodules, including nested ones, are available in
              # the working tree used by the development server.
              git submodule sync --recursive
              git submodule update --init --recursive

              # Use exactly the node dependencies pinned by package-lock.json.
              if [[ -e node_modules && ! -L node_modules ]]; then
                echo >&2 "error: ./node_modules exists but is not managed by Nix"
                echo >&2 "remove it before running the development server"
                exit 1
              fi
              ln -sfn ${nodeModules}/node_modules node_modules

              # Docsy normally creates these in its npm postinstall hook when used
              # as a Git submodule.
              mkdir -p \
                themes/github.com/twbs/bootstrap \
                themes/github.com/FortAwesome/Font-Awesome

              export HUGO_CACHEDIR="''${XDG_CACHE_HOME:-$HOME/.cache}/hugo/rosenpass-website"
              mkdir -p "$HUGO_CACHEDIR"
              exec hugo server "$@"
            '';
          };
        in
        {
          inherit
            pkgs
            nodejs
            nodeModules
            website
            server
            ;
        }
      );
    in
    {
      packages = forAllSystems (system: {
        inherit (perSystem.${system}) website;
        default = perSystem.${system}.website;
      });
      checks = forAllSystems (system: {
        website = perSystem.${system}.website;
      });
      apps = forAllSystems (system: {
        server = {
          type = "app";
          program = "${perSystem.${system}.server}/bin/rosenpass-website-server";
          meta.description = "run the Rosenpass website development server";
        };
      });
      devShells = forAllSystems (
        system:
        let
          inherit (perSystem.${system})
            pkgs
            nodejs
            nodeModules
            ;
        in
        {
          default = pkgs.mkShell {
            packages = [
              nodejs

              pkgs.git
              pkgs.go
              pkgs.groff
              pkgs.hugo
              pkgs.prettier
              pkgs.which

              pkgs.importNpmLock.hooks.linkNodeModulesHook
            ];

            npmDeps = nodeModules;
          };
        }
      );
      formatter = forAllSystems (
        system: perSystem.${system}.pkgs.nixfmt
      );
    };
}