import { useState } from "react";

import { throttledHandleScroll } from "@/components/carnival/events/displays/handleScroll";
import { useGetEventsInfiniteQuery } from "@/store/features/api/eventApiSlice";

// Custom hook for better scroll handling
const InfiniteScrollWrapper = () => {
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const {
    data,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useGetEventsInfiniteQuery({ filter: [] });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    throttledHandleScroll(
      e,
      fetchNextPage,
      fetchPreviousPage,
      lastScrollTop,
      setLastScrollTop,
    );
  };

  if (!data) {
    return <></>;
  }

  const events = data.pages.map((page) => page.events).flat();

  return (
    <div className="flex h-72 flex-col overflow-auto" onScroll={handleScroll}>
      {/* Loading indicators */}
      {hasPreviousPage && (
        <div className="py-2 text-center">
          <h4>Loading more items above...</h4>
        </div>
      )}

      {/* End messages */}
      {!hasPreviousPage && (
        <p className="py-2 text-center font-semibold">
          This is the beginning of time
        </p>
      )}

      {/* Display your items directly without the InfiniteScroll components */}
      {events.map((event) => (
        <div
          key={event}
          className="my-2 h-12 rounded border border-blue-500 bg-gray-100 p-2"
        >
          {event}
        </div>
      ))}

      {hasNextPage && (
        <div className="py-2 text-center">
          <h4>Loading more items below...</h4>
        </div>
      )}

      {!hasNextPage && (
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      )}
    </div>
  );
};

export default InfiniteScrollWrapper;
