import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import booths from "@/assets/carnival/json/booth.json";
import useIsMobile from "@/hooks/useIsMobile";

const BoothCarousel = () => {
  const isMobile = useIsMobile();

  if (Object.keys(booths).length === 0) {
    return <></>;
  }

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 30,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomDot = ({ onClick, active }: any): React.ReactElement => {
    return (
      <button
        className={
          "h-2 w-2 rounded-full " +
          `${active ? "bg-[#8e8e8e]" : "bg-[#f1f1f1]"}`
        }
        onClick={() => onClick()}
      />
    );
  };

  const renderBooths = () =>
    Object.entries(booths).map(([boothName, booth]) => (
      <div
        key={boothName}
        className="rounded-lg border border-gray-200 bg-white p-2 shadow"
      >
        <div className="mb-1 ml-2">
          <h3 className="text-lg font-semibold">{boothName}</h3>
          <div className="text-sm font-medium text-black">
            <p>Theme: {booth.theme}</p>
            <div className="mt-1.5 block font-normal">
              <div className="flex gap-2">
                <div className="rounded-3xl bg-red-100 p-1 pr-3 pl-3 font-medium text-red-500">
                  {booth.orgType}
                </div>
                <div className="rounded-3xl bg-green-100 p-1 pr-3 pl-3 font-medium text-green-700">
                  {booth.boothType}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));

  const renderMobile = () => {
    return <div className="grid grid-cols-1 gap-3">{renderBooths()}</div>;
  };

  return (
    <div className="mt-4 px-4">
      <h3 className="mb-2 font-bold">All Booths</h3>
      {isMobile ? (
        <Carousel
          responsive={responsive}
          showDots={true}
          customDot={<CustomDot />}
          partialVisible={true}
          itemClass="px-2"
          infinite={true}
        >
          {renderBooths()}
        </Carousel>
      ) : (
        renderMobile()
      )}
    </div>
  );
};

export default BoothCarousel;
