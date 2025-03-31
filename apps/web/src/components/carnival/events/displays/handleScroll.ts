// Create separate event handlers for top and bottom scrolling
import { throttle } from "lodash";

import { RefObject } from "react";

// need to be separate functions for throttle to work
const handleScroll = (
  event: React.UIEvent<HTMLDivElement>,
  fetchNext: () => void,
  fetchPrevious: () => void,
  scrollTop: RefObject<number>,
) => {
  const container = event.target as HTMLDivElement;
  const scrollDirection =
    container.scrollTop > scrollTop.current ? "down" : "up";

  if (container.scrollTop <= 200 && scrollDirection === "up") {
    fetchPrevious();
  }

  if (
    container.scrollHeight - container.scrollTop <=
      container.clientHeight + 200 &&
    scrollDirection === "down"
  ) {
    fetchNext();
  }

  scrollTop.current = container.scrollTop;
};

export const throttledHandleScroll = throttle(handleScroll, 500);
