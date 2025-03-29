import booths from "@public/assets/carnival/json/booth.json";

import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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
        <h3>{boothName}</h3>
        <p className="text-sm text-gray-500">
          {booth.type} - {booth.theme}
        </p>
      </div>
    ));

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
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {renderBooths()}
        </div>
      )}
    </div>
  );
};

export default BoothCarousel;
