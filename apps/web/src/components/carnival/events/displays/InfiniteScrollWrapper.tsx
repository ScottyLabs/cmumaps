import { useCallback, useEffect, useRef } from "react";

import {
  throttledHandleScroll,
  throttleFetchPrevious,
} from "@/components/carnival/events/displays/handleScroll";
import { useGetEventsInfiniteQuery } from "@/store/features/api/eventApiSlice";

const InfiniteScrollWrapper = () => {
  const scrollTop = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    data,
    hasPreviousPage,
    hasNextPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useGetEventsInfiniteQuery({ filter: [] });

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
  console.log(events);

  return (
    <div
      className="flex flex-col overflow-auto"
      onScroll={handleScroll}
      ref={scrollContainerRef}
    >
      {/* Display your items directly without the InfiniteScroll components */}
      {events.map((event) => (
        <div
          key={event.eventId}
          className="my-2 h-12 rounded border border-blue-500 bg-gray-100 p-2"
        >
          {event.name}
        </div>
      ))}
    </div>
  );
};

export default InfiniteScrollWrapper;
