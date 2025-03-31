import { useEffect, useState } from "react";

// Custom hook for better scroll handling
const InfiniteScrollWrapper = () => {
  const [hasMoreTop, _setHasMoreTop] = useState(true);
  const [hasMoreBottom, _setHasMoreBottom] = useState(true);
  const [items, setItems] = useState<{ id: string; value: string }[]>([]);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const items = [];
    for (let i = 0; i < 10; i++) {
      items.push({ id: i.toString(), value: `Item ${i}` });
    }
    setItems(items);
  }, []);

  const fetchMoreTop = () => {
    const newItems = [];
    for (let i = 0; i < 10; i++) {
      newItems.push({
        id: (items.length + i).toString(),
        value: `Item -${items.length + i}`,
      });
    }
    setItems([...newItems, ...items]);
  };

  const fetchMoreBottom = () => {
    const newItems = [];
    for (let i = 0; i < 10; i++) {
      newItems.push({
        id: (items.length + i).toString(),
        value: `Item ${items.length + i}`,
      });
    }
    setItems([...items, ...newItems]);
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

  return (
    <div
      className="flex h-30 flex-col overflow-auto"
      onScroll={(e) => handleScroll(e)}
    >
      {/* Display your items directly without the InfiniteScroll components */}
      {items.map((item) => (
        <div
          key={item.id}
          className="my-2 h-12 rounded border border-blue-500 bg-gray-100 p-2"
        >
          {item.value}
        </div>
      ))}

      {/* Loading indicators */}
      {hasMoreTop && (
        <div className="py-2 text-center">
          <h4>Loading more items above...</h4>
        </div>
      )}

      {hasMoreBottom && (
        <div className="py-2 text-center">
          <h4>Loading more items below...</h4>
        </div>
      )}

      {/* End messages */}
      {!hasMoreTop && (
        <p className="py-2 text-center font-semibold">
          This is the beginning of time
        </p>
      )}

      {!hasMoreBottom && (
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      )}
    </div>
  );
};

export default InfiniteScrollWrapper;
