{ config, inputs, lib, ricochet, ... }:
{
  imports = [ inputs.scottylabs.devenvModules.default ];

  scottylabs = {
    enable = true;
    project.name = "maps";

    garage = {
      enable = true;
      # Public local-only credentials in Garage's required key format.
      accessKey = "GK000000000000000000000001";
      secretKey = builtins.hashString "sha256" "maps-local-garage";
    };

    ricochet = {
      enable = true;
      appUrl = "http://localhost";
    };

    claude.enable = false;
    conventionalCommits.enable = false;
    secrets.enable = false;
    security.osvScanner.enable = false;
    security.semgrep.enable = false;
    kennel.previewDeployments = false;
  };

  services.garage = {
    # Docker forwards the host's loopback port to this container interface.
    s3Address = lib.mkForce "0.0.0.0:9000";

    # The shared module imports unconditionally, which fails on restart.
    afterStart = lib.mkForce ''
      if ! garage key info ${lib.escapeShellArg config.scottylabs.garage.accessKey} >/dev/null 2>&1; then
        garage key import --yes \
          -n ${lib.escapeShellArg config.scottylabs.project.name} \
          ${lib.escapeShellArg config.scottylabs.garage.accessKey} \
          ${lib.escapeShellArg config.scottylabs.garage.secretKey}
      fi
      garage bucket allow --read --write --owner \
        ${lib.escapeShellArg config.scottylabs.project.name} \
        --key ${lib.escapeShellArg config.scottylabs.garage.accessKey}
    '';
  };

  # Use Kennel's pinned relay package, listening on the Docker interface.
  # Compose publishes it only on the host's loopback address.
  processes.ricochet.exec = lib.mkForce
    "RICOCHET_DEV=1 RICOCHET_BIND=0.0.0.0:8090 ${ricochet}/bin/ricochet";

  # Enable only the services needed for local development.
  treefmt.enable = lib.mkForce false;
  git-hooks.enable = lib.mkForce false;
  cachix = {
    enable = false;
    pull = lib.mkForce [ ];
    push = lib.mkForce null;
  };
}
