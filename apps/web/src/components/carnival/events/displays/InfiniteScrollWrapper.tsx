import { useRef } from "react";

import { throttledHandleScroll } from "@/components/carnival/events/displays/handleScroll";
import { useGetEventsInfiniteQuery } from "@/store/features/api/eventApiSlice";

// Custom hook for better scroll handling
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

  const fetchNext = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const fetchPrevious = () => {
    if (hasPreviousPage) {
      fetchPreviousPage();
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    throttledHandleScroll(e, fetchNext, fetchPrevious, scrollTop);
  };

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
      {/* Display your items directly without the InfiniteScroll components */}
      {events.map((event) => (
        <div
          key={event}
          className="my-2 h-12 rounded border border-blue-500 bg-gray-100 p-2"
        >
          {event}
        </div>
      ))}
    </div>
  );
};

export default InfiniteScrollWrapper;
