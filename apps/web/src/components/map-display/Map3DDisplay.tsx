/** biome-ignore-all lint/style/useNamingConvention: 3D naming convention is intentional */
import { INITIAL_REGION } from "@cmumaps/ui";
import { useCallback, useEffect, useRef, useState } from "react";

import { $api } from "@/api/client";
import { env } from "@/env.ts";
import { useNavigateLocationParams } from "@/hooks/useNavigateLocationParams.ts";
import { CardStates } from "@/store/cardSlice";
import { useBoundStore } from "@/store/index.ts";
import { initGoogleMapsBootstrap } from "@/utils/googleMapsLoader";

const cmuCenter = {
  lat: INITIAL_REGION.centerLatitude,
  lng: INITIAL_REGION.centerLongitude,
  altitude: 200,
};

const defaultTilt = 60;
const defaultHeading = 25;
const defaultRange = 800;

const apiKey = env.VITE_GOOGLE_MAPS_API_KEY;

const noop = () => {
  /* intentionally empty */
};

const Map3DDisplay = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapElementRef = useRef<google.maps.maps3d.Map3DElement | null>(null);
  const markersRef = useRef<HTMLElement[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: buildings } = $api.useQuery("get", "/buildings");
  const selectBuilding = useBoundStore((state) => state.selectBuilding);
  const setCardStatus = useBoundStore((state) => state.setCardStatus);
  const selectedBuilding = useBoundStore((state) => state.selectedBuilding);
  const navigate = useNavigateLocationParams();

  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API key not configured");
      return;
    }

    // #region debug log
    console.log("[Map3D DEBUG] useEffect fired, apiKey present");
    // #endregion

    initGoogleMapsBootstrap(apiKey);

    // #region debug log
    console.log("[Map3D DEBUG] initGoogleMapsBootstrap called");
    // #endregion

    if (!containerRef.current) {
      // #region debug log
      console.log("[Map3D DEBUG] containerRef.current is null, bailing out");
      // #endregion
      return;
    }

    // #region debug log
    console.log("[Map3D DEBUG] containerRef ready, starting initMap");
    // #endregion

    let didTimeout = false;
    const timeoutId = setTimeout(() => {
      didTimeout = true;
      if (!mapElementRef.current) {
        console.error("[Map3D DEBUG] 15s timeout reached — map never loaded");
        setError(
          "3D map took too long to load. importLibrary('maps3d') may be hanging, or WebGL may be unavailable in this environment.",
        );
      }
    }, 15_000);

    const initMap = async () => {
      // #region debug log
      console.log("[Map3D DEBUG] before importLibrary('maps3d')");
      console.log(
        "[Map3D DEBUG] google.maps available keys:",
        Object.keys(google.maps),
      );
      // #endregion

      const lib = (await google.maps.importLibrary(
        "maps3d",
      )) as google.maps.Maps3DLibrary;

      // #region debug log
      console.log(
        "[Map3D DEBUG] importLibrary resolved, lib keys:",
        Object.keys(lib),
      );
      // #endregion

      if (didTimeout) {
        console.warn("[Map3D DEBUG] importLibrary resolved AFTER timeout");
      }

      if (mapElementRef.current) {
        // #region debug log
        console.log(
          "[Map3D DEBUG] mapElementRef already set, skipping creation",
        );
        // #endregion
        return;
      }

      const { Map3DElement } = lib;

      // #region debug log
      console.log("[Map3D DEBUG] creating new Map3DElement");
      // #endregion

      const map = new Map3DElement({
        center: cmuCenter,
        tilt: defaultTilt,
        heading: defaultHeading,
        range: defaultRange,
      });

      // #region debug log
      console.log("[Map3D DEBUG] Map3DElement created:", map.tagName);
      // #endregion

      map.style.width = "100%";
      map.style.height = "100%";

      containerRef.current?.appendChild(map);

      // #region debug log
      console.log("[Map3D DEBUG] Map3DElement appended to container");
      // #endregion

      mapElementRef.current = map;
      clearTimeout(timeoutId);
      setIsReady(true);

      // #region debug log
      console.log("[Map3D DEBUG] isReady set to true");
      // #endregion
    };

    initMap().catch((err) => {
      // #region debug log
      console.error("[Map3D DEBUG] initMap catch handler:", err);
      // #endregion
      clearTimeout(timeoutId);
      setError("Failed to initialize 3D map");
    });

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleBuildingClick = useCallback(
    (buildingCode: string) => {
      if (!buildings) return;
      const building = buildings[buildingCode];
      if (building) {
        selectBuilding(building);
        setCardStatus(CardStates.HALF_OPEN);
        navigate(`/${building.code}`);
      }
    },
    [buildings, selectBuilding, setCardStatus, navigate],
  );

  useEffect(() => {
    if (!(isReady && mapElementRef.current && buildings)) return;

    for (const marker of markersRef.current) {
      marker.remove();
    }
    markersRef.current = [];

    const addMarkers = async () => {
      const { Marker3DInteractiveElement } = (await google.maps.importLibrary(
        "maps3d",
      )) as google.maps.Maps3DLibrary;

      const map = mapElementRef.current;
      if (!map) return;

      for (const building of Object.values(buildings)) {
        const marker = new Marker3DInteractiveElement({
          position: {
            lat: building.labelLatitude,
            lng: building.labelLongitude,
            altitude: 20,
          },
          altitudeMode: "RELATIVE_TO_GROUND",
          label: building.code,
        });

        marker.addEventListener("gmp-click", () => {
          handleBuildingClick(building.code);
        });

        map.append(marker);
        markersRef.current.push(marker);
      }
    };

    addMarkers().catch(noop);
  }, [isReady, buildings, handleBuildingClick]);

  useEffect(() => {
    if (!(isReady && mapElementRef.current && selectedBuilding)) return;

    const map = mapElementRef.current;
    map.flyCameraTo({
      endCamera: {
        center: {
          lat: selectedBuilding.labelLatitude,
          lng: selectedBuilding.labelLongitude,
          altitude: 100,
        },
        range: 400,
        tilt: 55,
      },
      durationMillis: 1000,
    });
  }, [isReady, selectedBuilding]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-6 text-center shadow-lg">
          <p className="font-semibold text-gray-800 text-lg">
            3D Map Unavailable
          </p>
          <p className="mt-2 text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          Google Maps API key required for 3D view
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full">
      {!isReady && (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            <p className="text-gray-500 text-sm">Loading 3D Map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export { Map3DDisplay };
