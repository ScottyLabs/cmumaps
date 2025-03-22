import React, { useState } from 'react';

import { COLLAPSED, getIsCardOpen } from '@/lib/features/uiSlice';
import { useAppSelector } from '@/lib/hooks';

import FloorSwitcher from '../buildings/FloorSwitcher';
import CardWrapper from '../infocard/CardWrapper';
import InfoCard from '../infocard/InfoCard';
import NavCard from '../navigation/NavCard';
import SearchBar from '../searchbar/SearchBar';
import SearchModeSelector from '../searchbar/SearchModeSelector';
import Schedule from './Schedule';

interface Props {
  map: mapkit.Map | null;
}

const ToolBar = ({ map }: Props) => {
  const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);
  const searchMode = useAppSelector((state) => state.ui.searchMode);
  const isCardOpen = useAppSelector((state) => getIsCardOpen(state.ui));
  const isNavOpen = useAppSelector((state) => state.nav.isNavOpen);
  const focusedFloor = useAppSelector((state) => state.ui.focusedFloor);
  const choosingRoomMode = useAppSelector(
    (state) => state.nav.choosingRoomMode,
  );
  const isMobile = useAppSelector((state) => state.ui.isMobile);

  const isCardWrapperCollapsed = useAppSelector(
    (state) => state.ui.cardWrapperStatus == COLLAPSED,
  );

  let showSearchModeSelector =
    !isCardOpen && !isNavOpen && searchMode === 'rooms';
  if (isMobile && isSearchOpen) {
    showSearchModeSelector = false;
  }

  // first only show floor switcher if there is focused floor
  let showFloorSwitcher = !!focusedFloor;

  // mobile cases
  if (isMobile) {
    if (isCardOpen && !isCardWrapperCollapsed) {
      showFloorSwitcher = false;
    }

    if (isSearchOpen) {
      showFloorSwitcher = false;
    }
  }

  const showSearchBar = () => {
    if (isNavOpen && !choosingRoomMode) {
      return false;
    }

    return true;
  };

  const [snapPoint, setSnapPoint] = useState(340);

  const initSnapPoint = (sp) => {
    if (sp != snapPoint) {
      setSnapPoint(sp);
    }
  };

  const [cardVisible, setCardVisibile] = useState(true);

  const mobileRender = () => {
    return (
      <div
        style={{ maxHeight: `calc(100vh)` }}
        className="fixed flex w-full px-2"
      >
        <div className="flex w-full flex-col space-y-2 overflow-hidden py-2">
          {showSearchBar() && <SearchBar map={map} />}
          {showSearchModeSelector && <SearchModeSelector />}

          {!isSearchOpen && !isCardOpen && <Schedule />}

          {!isNavOpen && !isSearchOpen && (
            <CardWrapper snapPoint={snapPoint} isOpen={cardVisible}>
              <InfoCard
                map={map}
                setCardVisibility={setCardVisibile}
                initSnapPoint={initSnapPoint}
              />
            </CardWrapper>
          )}
          {isNavOpen && isCardOpen && !choosingRoomMode && (
            <CardWrapper snapPoint={snapPoint} isOpen={cardVisible}>
              <NavCard map={map} />
            </CardWrapper>
          )}
        </div>
      </div>
    );
  };

  const desktopRender = () => {
    // need box content so the width of the search bar match the card
    return (
      <>
        <div
          style={{ maxHeight: `calc(100vh)` }}
          className="fixed box-content flex w-96 px-2"
        >
          <div className="flex w-full flex-col space-y-2 overflow-hidden py-2">
            {showSearchBar() && <SearchBar map={map} />}

            {!isSearchOpen && !isCardOpen && <Schedule />}

            <div className="flex w-96 flex-col overflow-hidden rounded-lg bg-white shadow-lg shadow-gray-400">
              {!isNavOpen && !isSearchOpen && <InfoCard map={map} />}
              {isNavOpen && isCardOpen && !choosingRoomMode && (
                <NavCard map={map} />
              )}
            </div>
          </div>
        </div>
        <div className="fixed left-[25rem] my-4">
          {showSearchModeSelector && <SearchModeSelector />}
        </div>
      </>
    );
  };

  return (
    <>
      {isMobile ? mobileRender() : desktopRender()}
      {showFloorSwitcher && focusedFloor && (
        <FloorSwitcher focusedFloor={focusedFloor} />
      )}
    </>
  );
};

export default ToolBar;
