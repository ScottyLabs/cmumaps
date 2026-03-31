import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { $api } from "@/api/client";
import { useUser } from "@/hooks/useUser.ts";

const VOTES_NEEDED = 2;

interface Props {
  roomId: string;
  floorCode: string;
  /** From floorplan cache — used to detect stale UI vs server */
  localRoomType: string;
}

const IsRestroomVote = ({ roomId, floorCode, localRoomType }: Props) => {
  const user = useUser();
  const queryClient = useQueryClient();
  const pathInit = { params: { path: { roomId } } } as const;

  const { data: status } = $api.useQuery(
    "get",
    "/restroom-type-votes/{roomId}/status",
    pathInit,
  );

  const { data: mine } = $api.useQuery(
    "get",
    "/restroom-type-votes/{roomId}/mine",
    pathInit,
    { enabled: Boolean(user) },
  );

  useEffect(() => {
    if (
      localRoomType === "Default" &&
      status &&
      !status.eligible &&
      floorCode
    ) {
      queryClient
        .invalidateQueries({
          queryKey: [
            "get",
            "/floors/{floorCode}/floorplan",
            { params: { path: { floorCode } } },
          ],
        })
        .catch((): undefined => undefined);
    }
  }, [status, localRoomType, floorCode, queryClient]);

  const { mutate: castVote, isPending } = $api.useMutation(
    "put",
    "/restroom-type-votes/{roomId}",
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["get", "/restroom-type-votes/{roomId}/status"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["get", "/restroom-type-votes/{roomId}/mine"],
        });
        await queryClient.invalidateQueries({
          queryKey: [
            "get",
            "/floors/{floorCode}/floorplan",
            { params: { path: { floorCode } } },
          ],
        });
        await queryClient.invalidateQueries({
          queryKey: ["get", "/restroom-ratings/leaderboard"],
        });
      },
    },
  );

  if (!status?.eligible) {
    return null;
  }

  const { voteCount } = status;
  const hasVoted = mine?.voted ?? false;
  const progress = `${Math.min(voteCount, VOTES_NEEDED)}/${VOTES_NEEDED} confirmations`;

  return (
    <div className="mt-3 flex items-center justify-between gap-3 border-gray-200 border-t pt-3">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground-neutral-primary text-sm">
          Community labeling
        </p>
        <p className="text-foreground-neutral-secondary text-xs">
          {progress}
          {hasVoted ? " · You confirmed" : ""}
        </p>
      </div>
      <button
        type="button"
        disabled={!user || hasVoted || isPending}
        title={
          user
            ? hasVoted
              ? "You already confirmed"
              : undefined
            : "Sign in to confirm"
        }
        className="shrink-0 rounded-full border border-stroke-neutral-1 bg-white px-3 py-1.5 text-foreground-neutral-primary text-xs leading-tight transition-colors enabled:active:bg-blue-grey enabled:hover:bg-background-brand-secondary-pressed disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => {
          if (!user || hasVoted || isPending) {
            return;
          }
          castVote({ params: { path: { roomId } } });
        }}
      >
        Is this a restroom?
      </button>
    </div>
  );
};

export { IsRestroomVote };
