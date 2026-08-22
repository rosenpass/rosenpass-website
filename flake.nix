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
        # "aarch64-linux"
        # "x86_64-darwin"
        # "aarch64-darwin"
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
              bash ./scripts/changelog-check.sh
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
        in
        {
          inherit
            pkgs
            nodejs
            nodeModules
            website
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