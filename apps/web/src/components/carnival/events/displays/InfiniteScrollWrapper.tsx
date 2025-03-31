import { useEffect, useRef, useState } from "react";

import { throttledHandleScroll } from "@/components/carnival/events/displays/handleScroll";
import { useGetEventsInfiniteQuery } from "@/store/features/api/eventApiSlice";

// Custom hook for better scroll handling
const InfiniteScrollWrapper = () => {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [prevHeight, setPrevHeight] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    data,
    hasNextPage,
    hasPreviousPage,
    isFetchingPreviousPage,
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

  useEffect(() => {
    if (data?.pages.length === 0) {
      return;
    }

    // trigger after finishing fetching previous page
    if (isFetchingPreviousPage) {
      return;
    }

    if (!scrollContainerRef.current) {
      return;
    }

    // Get the height difference between the new and old scroll height
    const scrollContainer = scrollContainerRef.current;
    const newScrollHeight = scrollContainer.scrollHeight;
    const heightDifference = newScrollHeight - prevHeight;

    // Adjust scroll position by the height difference to maintain view position
    requestAnimationFrame(() => {
      scrollContainer.scrollTop += heightDifference;
    });

    // Store current values for next comparison
    setPrevHeight(scrollContainer.scrollHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingPreviousPage]);

  if (!data) {
    return <></>;
  }

  const events = data.pages.map((page) => page.events).flat();

  return (
    <div
      className="flex h-72 flex-col overflow-auto"
      onScroll={handleScroll}
      ref={scrollContainerRef}
    >
      {hasPreviousPage && (
        <div className="py-2 text-center">
          <h4>Loading more items above...</h4>
        </div>
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
    </div>
  );
};

export default InfiniteScrollWrapper;
