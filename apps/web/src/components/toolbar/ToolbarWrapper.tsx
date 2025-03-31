import React from "react";

import useIsMobile from "@/hooks/useIsMobile";

interface Props {
  children: React.ReactNode;
}

const ToolbarWrapper = ({ children }: Props) => {
  const isMobile = useIsMobile();

  const mobileRender = () => {
    return (
      <div
        style={{ maxHeight: `calc(100vh)` }}
        className="fixed flex w-full px-2"
      >
        <div className="flex w-full flex-col overflow-hidden py-2">
          {children}
        </div>
      </div>
    );
  };

  const desktopRender = () => {
    // need box content so the width of the search bar match the card
    return (
      <>
        <div
          style={{ maxHeight: `calc(100vh - 2.5rem)` }}
          className="fixed top-2 left-2 box-content flex w-96"
        >
          <div className="flex w-full flex-col overflow-hidden">{children}</div>
        </div>
      </>
    );
  };

  return (
    <div className="absolute z-10">
      {isMobile ? mobileRender() : desktopRender()}
    </div>
  );
};

export default ToolbarWrapper;
