import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const InfiniteScrollWrapper = () => {
  const [items, setItems] = useState<{ id: string; value: string }[]>([]);
  const [hasMoreTop, _setHasMoreTop] = useState(true);
  const [hasMoreBottom, _setHasMoreBottom] = useState(true);

  // Initial data load
  useEffect(() => {
    const initialItems = Array.from({ length: 15 }, (_, i) => ({
      id: `item-${i}`,
      value: `Item ${i + 1}`,
    }));

    setItems(initialItems);
  }, []);

  const fetchMoreTop = () => {
    console.log("fetchMoreTop");
  };

  const fetchMoreBottom = () => {
    console.log("fetchMoreBottom");
  };

  return (
    <div>
      <h2 className="py-4 text-xl font-bold">Bidirectional Infinite Scroll</h2>
      <div
        id="top-scrollableDiv"
        className="flex h-30 flex-col-reverse overflow-auto"
      >
        <div
          id="bottom-scrollableDiv"
          className="flex h-full flex-col overflow-auto"
        >
          <InfiniteScroll
            scrollableTarget="top-scrollableDiv"
            dataLength={items.length}
            next={fetchMoreTop}
            hasMore={hasMoreTop}
            className="flex flex-col-reverse"
            loader={
              <h4 className="py-2 text-center">Loading more items above...</h4>
            }
            inverse={true}
            endMessage={
              <p className="py-2 text-center font-semibold">
                This is the beginning of time
              </p>
            }
          >
            <InfiniteScroll
              scrollableTarget="bottom-scrollableDiv"
              dataLength={items.length}
              next={fetchMoreBottom}
              hasMore={hasMoreBottom}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="my-2 h-12 rounded border border-blue-500 bg-gray-100 p-2"
                >
                  {item.value}
                </div>
              ))}
            </InfiniteScroll>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default InfiniteScrollWrapper;
