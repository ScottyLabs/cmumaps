import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { $api } from "@/api/client";
import restroomIcon from "@/assets/icons/quick_search/restroom.svg";
import { useLocationParams } from "@/hooks/useLocationParams.ts";
import { useNavigateLocationParams } from "@/hooks/useNavigateLocationParams.ts";
import { useUser } from "@/hooks/useUser.ts";
import { CardStates } from "@/store/cardSlice";
import { useBoundStore } from "@/store/index.ts";
import { isPublicBuilding } from "@/utils/authUtils";
import { zoomOnPoint } from "@/utils/zoomUtils";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const BestBathroomsCard = ({ mapRef }: Props) => {
  const navigate = useNavigateLocationParams();
  const { buildingCode, roomName, coordinate } = useLocationParams();
  const infoCardVisible = Boolean(buildingCode || roomName || coordinate);
  const [listPeekOpen, setListPeekOpen] = useState(false);
  const hideSearch = useBoundStore((state) => state.hideSearch);
  const setCardStatus = useBoundStore((state) => state.setCardStatus);
  const focusFloor = useBoundStore((state) => state.focusFloor);
  const setIsZooming = useBoundStore((state) => state.setIsZooming);
  const showLogin = useBoundStore((state) => state.showLogin);
  const user = useUser();

  useEffect(() => {
    if (infoCardVisible) {
      setListPeekOpen(false);
    }
  }, [infoCardVisible]);

  const showLeaderboardList = !infoCardVisible || listPeekOpen;

  const { data: leaderboard } = $api.useQuery(
    "get",
    "/restroom-ratings/leaderboard",
    { params: { query: { limit: 10 } } },
  );

  const { data: buildings } = $api.useQuery("get", "/buildings");

  if (!leaderboard || leaderboard.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Top rated restrooms"
      className="z-40 mb-2 overflow-hidden rounded-lg bg-white shadow-[1px_4px_4px_0_rgba(0,0,0,0.15)]"
    >
      {infoCardVisible ? (
        <button
          type="button"
          className="flex w-full items-start gap-2 border-gray-100 border-b px-3 py-2 text-left transition-colors hover:bg-gray-50"
          onClick={() => {
            setListPeekOpen((open) => !open);
          }}
          aria-expanded={listPeekOpen}
          aria-label={
            listPeekOpen
              ? "Hide best bathrooms list"
              : "Show best bathrooms list"
          }
        >
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-gray-800 text-sm">
              Best bathrooms
            </h2>
            <p className="text-gray-500 text-xs">
              Ranked by average star rating
            </p>
          </div>
          <span className="shrink-0 text-gray-500">
            {listPeekOpen ? (
              <IoIosArrowUp size={22} aria-hidden={true} />
            ) : (
              <IoIosArrowDown size={22} aria-hidden={true} />
            )}
          </span>
        </button>
      ) : (
        <div className="border-gray-100 border-b px-3 py-2">
          <h2 className="font-semibold text-gray-800 text-sm">
            Best bathrooms
          </h2>
          <p className="text-gray-500 text-xs">Ranked by average star rating</p>
        </div>
      )}
      {showLeaderboardList ? (
        <ol className="max-h-[min(50vh,16rem)] list-none overflow-y-auto py-1">
          {leaderboard.map((entry, index) => {
            const buildingName =
              entry.buildingCode && buildings?.[entry.buildingCode]?.name;
            const titleLine = buildingName
              ? `${buildingName} · ${entry.name}`
              : `${entry.buildingCode ?? "?"} ${entry.name}`;

            const handleClick = () => {
              if (!(entry.buildingCode && entry.floorLevel)) {
                return;
              }
              const canAccess =
                Boolean(user) || isPublicBuilding(entry.buildingCode);
              if (!canAccess) {
                showLogin();
                return;
              }
              navigate(`/${entry.buildingCode}-${entry.name}`);
              setCardStatus(CardStates.COLLAPSED);
              focusFloor({
                buildingCode: entry.buildingCode,
                level: entry.floorLevel,
              });
              hideSearch();
              if (mapRef.current) {
                zoomOnPoint(
                  mapRef.current,
                  new mapkit.Coordinate(
                    entry.labelLatitude,
                    entry.labelLongitude,
                  ),
                  0.0005,
                  setIsZooming,
                );
              }
            };

            return (
              <li key={entry.roomId}>
                <button
                  type="button"
                  onClick={() => {
                    handleClick();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 active:bg-[#F5F5F5]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 font-semibold text-gray-600 text-xs tabular-nums">
                    {index + 1}
                  </span>
                  <div className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white">
                    <img width={20} src={restroomIcon} alt="" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-gray-900">
                      {titleLine}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {entry.ratingCount}{" "}
                      {entry.ratingCount === 1 ? "rating" : "ratings"}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5 text-amber-500">
                    <FaStar className="text-base" aria-hidden={true} />
                    <span className="font-medium text-amber-700 text-xs tabular-nums">
                      {entry.averageStars.toFixed(1)}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}
    </section>
  );
};

export { BestBathroomsCard };
