let initialized = false;

/**
 * Initializes the Google Maps JavaScript API using the recommended bootstrap
 * loader pattern. After calling this, google.maps.importLibrary() is
 * immediately available as a stub that queues requests until the API loads.
 */
export function initGoogleMapsBootstrap(apiKey: string): void {
  // #region debug log
  console.log(
    "[GMapsLoader DEBUG] initGoogleMapsBootstrap called, initialized:",
    initialized,
  );
  // #endregion

  if (initialized) return;
  initialized = true;

  const config: Record<string, string> = { key: apiKey, v: "alpha" };
  const c = "google";
  const l = "importLibrary";
  const q = "__ib__";

  const b = window as unknown as Record<string, Record<string, unknown>>;
  const googleNs = b[c] ?? {};
  b[c] = googleNs;
  const mapsNs = (googleNs["maps"] as Record<string, unknown>) ?? {};
  googleNs["maps"] = mapsNs;

  const requested = new Set<string>();
  const params = new URLSearchParams();

  let loaderPromise: Promise<void> | null = null;
  const ensureLoaded = (): Promise<void> => {
    if (loaderPromise !== null) {
      // #region debug log
      console.log("[GMapsLoader DEBUG] ensureLoaded: reusing existing promise");
      // #endregion
      return loaderPromise;
    }
    loaderPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      params.set("libraries", [...requested].join(","));
      for (const k of Object.keys(config)) {
        const snakeKey = k.replace(
          /[A-Z]/g,
          (ch) => `_${ch[0]?.toLowerCase()}`,
        );
        params.set(snakeKey, config[k] ?? "");
      }
      params.set("callback", `${c}.maps.${q}`);
      script.src = `https://maps.${c}apis.com/maps/api/js?${params.toString()}`;

      // #region debug log
      console.log("[GMapsLoader DEBUG] script.src =", script.src);
      // #endregion

      mapsNs[q] = () => {
        // #region debug log
        console.log(
          "[GMapsLoader DEBUG] callback fired — API script loaded successfully",
        );
        // #endregion
        resolve();
      };
      script.onerror = () => {
        // #region debug log
        console.error(
          "[GMapsLoader DEBUG] script.onerror fired — API script failed to load",
        );
        // #endregion
        loaderPromise = null;
        reject(new Error("Google Maps JavaScript API could not load."));
      };
      const nonceEl = document.querySelector("script[nonce]");
      if (nonceEl) {
        script.nonce = (nonceEl as HTMLScriptElement).nonce;
      }
      document.head.append(script);

      // #region debug log
      console.log("[GMapsLoader DEBUG] script tag appended to <head>");
      // #endregion
    });
    return loaderPromise;
  };

  if (typeof mapsNs[l] === "function") {
    // #region debug log
    console.log(
      "[GMapsLoader DEBUG] importLibrary already exists, skipping stub setup",
    );
    // #endregion
    return;
  }

  // #region debug log
  console.log("[GMapsLoader DEBUG] installing importLibrary stub");
  // #endregion

  mapsNs[l] = (library: string): Promise<unknown> => {
    // #region debug log
    console.log("[GMapsLoader DEBUG] importLibrary stub called for:", library);
    // #endregion
    requested.add(library);
    return ensureLoaded().then(() => {
      // #region debug log
      console.log(
        "[GMapsLoader DEBUG] ensureLoaded resolved, delegating importLibrary for:",
        library,
      );
      // #endregion
      return (mapsNs[l] as (lib: string) => Promise<unknown>)(library);
    });
  };
}
