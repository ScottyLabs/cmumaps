import { useQueryClient } from "@tanstack/react-query";
import { FaRegStar, FaStar } from "react-icons/fa";
import { $api } from "@/api/client";
import { useUser } from "@/hooks/useUser.ts";

interface Props {
  roomId: string;
}

const RestroomStarRating = ({ roomId }: Props) => {
  const user = useUser();
  const queryClient = useQueryClient();

  const pathInit = { params: { path: { roomId } } } as const;

  const { data: summary } = $api.useQuery(
    "get",
    "/restroom-ratings/{roomId}/summary",
    pathInit,
  );

  const { data: mine } = $api.useQuery(
    "get",
    "/restroom-ratings/{roomId}/mine",
    pathInit,
    { enabled: Boolean(user) },
  );

  const { mutate: saveRating, isPending } = $api.useMutation(
    "put",
    "/restroom-ratings/{roomId}",
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["get", "/restroom-ratings/{roomId}/summary"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["get", "/restroom-ratings/{roomId}/mine"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["get", "/restroom-ratings/leaderboard"],
        });
      },
    },
  );

  const myStars = mine?.stars ?? 0;
  const count = summary?.count ?? 0;
  const average = summary?.average;

  const averageLine =
    count === 0
      ? "No ratings yet"
      : `Avg ${average?.toFixed(1) ?? "—"} · ${count} ${count === 1 ? "rating" : "ratings"}`;

  const setStars = (n: number) => {
    if (!user || isPending) {
      return;
    }
    saveRating({
      params: { path: { roomId } },
      body: { stars: n },
    });
  };

  return (
    <fieldset className="mt-3 border-0 border-gray-200 border-t p-0 pt-3">
      <legend className="mb-2 px-0 font-medium text-gray-700 text-sm">
        Rate this restroom
        <span className="mt-0.5 block font-normal text-gray-500 text-xs">
          {averageLine}
        </span>
      </legend>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={!user || isPending}
            title={user ? undefined : "Sign in to rate"}
            className="rounded p-0.5 transition-opacity enabled:active:opacity-60 enabled:hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`${n} out of 5 stars`}
            onClick={() => setStars(n)}
          >
            {n <= myStars ? (
              <FaStar className="text-amber-400 text-xl" aria-hidden={true} />
            ) : (
              <FaRegStar className="text-gray-400 text-xl" aria-hidden={true} />
            )}
          </button>
        ))}
      </div>
    </fieldset>
  );
};

export { RestroomStarRating };
