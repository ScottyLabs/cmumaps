// Create separate event handlers for top and bottom scrolling
import { throttle } from "lodash";

// need to be separate functions for throttle to work
const handleScroll = (
  event: React.UIEvent<HTMLDivElement>,
  fetchNextPage: () => void,
  fetchPreviousPage: () => void,
  lastScrollTop: number,
  setLastScrollTop: (scrollTop: number) => void,
) => {
  const container = event.target as HTMLDivElement;
  const scrollDirection = container.scrollTop > lastScrollTop ? "down" : "up";

  if (container.scrollTop <= 100 && scrollDirection === "up") {
    fetchPreviousPage();
  }

  if (
    container.scrollHeight - container.scrollTop <=
      container.clientHeight + 100 &&
    scrollDirection === "down"
  ) {
    fetchNextPage();
  }

  setLastScrollTop(container.scrollTop);
};

export const throttledHandleScroll = throttle(handleScroll, 1000);
