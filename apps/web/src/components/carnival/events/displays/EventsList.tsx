import { useCallback, useEffect, useRef } from "react";

import Event from "@/components/carnival/events/displays/Event";
import {
  throttledHandleScroll,
  throttleFetchPrevious,
} from "@/components/carnival/events/displays/handleScroll";
import Loader from "@/components/shared/Loader";
import { useGetEventsInfiniteQuery } from "@/store/features/api/eventApiSlice";
import { useAppSelector } from "@/store/hooks";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
  timestamp: number;
}

const EventsList = ({ mapRef, timestamp }: Props) => {
  const scrollTop = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tracks = useAppSelector((state) => state.event.selectedTracks);
  const reqs = useAppSelector((state) => state.event.selectedReqs);
  const {
    data,
    isFetchingPreviousPage,
    isFetchingNextPage,
    hasPreviousPage,
    hasNextPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useGetEventsInfiniteQuery(
    { tracks, reqs, timestamp },
    { initialPageParam: { timestamp } },
  );

  const fetchNext = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const fetchPrevious = useCallback(() => {
    if (hasPreviousPage) {
      fetchPreviousPage();
    }
  }, [hasPreviousPage, fetchPreviousPage]);

  // Continue to fetch previous page if the user is on the top with a throttle
  useEffect(() => {
    if (data?.pages && data.pages.length !== 1 && scrollTop.current === 0) {
      throttleFetchPrevious(fetchPrevious);
    }
  }, [fetchPrevious, data?.pages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    throttledHandleScroll(e, fetchNext, fetchPrevious, scrollTop);
  };

  if (!data) {
    return <></>;
  }

  const events = data.pages.map((page) => page.events).flat();
  return (
    <div
      className="flex flex-col overflow-auto"
      onScroll={handleScroll}
      ref={scrollContainerRef}
    >
      <div className="flex justify-center">
        {isFetchingPreviousPage && <Loader />}
      </div>
      {events.map((event) => (
        <Event key={event.id} mapRef={mapRef} event={event} />
      ))}
      <div className="flex justify-center">
        {isFetchingNextPage && <Loader />}
      </div>
    </div>
  );
};

export default EventsList;
