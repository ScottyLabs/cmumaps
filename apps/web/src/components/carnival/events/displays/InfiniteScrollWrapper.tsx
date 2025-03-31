import { useState } from "react";

import { useGetEventsInfiniteQuery } from "@/store/features/api/eventApiSlice";

// Custom hook for better scroll handling
const InfiniteScrollWrapper = () => {
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const {
    data: events,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useGetEventsInfiniteQuery();

  const fetchMoreTop = () => {
    fetchPreviousPage();
  };

  const fetchMoreBottom = () => {
    fetchNextPage();
  };

  // Create separate event handlers for top and bottom scrolling
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.target as HTMLDivElement;
    const scrollDirection = container.scrollTop > lastScrollTop ? "down" : "up";

    if (container.scrollTop <= 100 && scrollDirection === "up") {
      fetchMoreTop();
    }

    if (
      container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100 &&
      scrollDirection === "down"
    ) {
      fetchMoreBottom();
    }

    setLastScrollTop(container.scrollTop);
  };

  if (!events) {
    return <></>;
  }

  return (
    <div
      className="flex h-30 flex-col overflow-auto"
      onScroll={(e) => handleScroll(e)}
    >
      {/* Display your items directly without the InfiniteScroll components */}
      {events.pages.map((events) =>
        events.map((event) => (
          <div
            key={event}
            className="my-2 h-12 rounded border border-blue-500 bg-gray-100 p-2"
          >
            {event}
          </div>
        )),
      )}

      {/* Loading indicators */}
      {hasPreviousPage && (
        <div className="py-2 text-center">
          <h4>Loading more items above...</h4>
        </div>
      )}

      {hasNextPage && (
        <div className="py-2 text-center">
          <h4>Loading more items below...</h4>
        </div>
      )}

      {/* End messages */}
      {!hasPreviousPage && (
        <p className="py-2 text-center font-semibold">
          This is the beginning of time
        </p>
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
