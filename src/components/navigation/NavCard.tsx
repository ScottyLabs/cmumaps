import indoorsIcon from '@icons/indoors.svg';
import swapIcon from '@icons/nav/swap.svg';
import endIcon from '@icons/path/end.svg';
import startIcon from '@icons/path/start.svg';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

import React, { useEffect } from 'react';
import { BsFillLightningChargeFill } from 'react-icons/bs';
// import { FaRegSnowflake } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { toast } from 'react-toastify';

import useClerkToken from '@/hooks/useClerkToken';
import {
  setChoosingRoomMode,
  setSelectedPathNum,
  setEndLocation,
  setIsNavOpen,
  setRecommendedPath,
  setStartLocation,
  setStartedNavigation,
  setCurFloorIndex,
} from '@/lib/features/navSlice';
import { setIsSearchOpen } from '@/lib/features/uiSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Waypoint } from '@/types';

// import CardWrapper from '../infocard/CardWrapper';
import NavDirections from './NavDirections';

const pathNumToIcon = [
  <BsFillLightningChargeFill key="fast" size={25} />,
  <Image key="indoors" alt={'Indoors Icon'} src={indoorsIcon} />,
];
const pathNumToName = ['Fastest', 'Indoor'];

interface Props {
  map: mapkit.Map | null;
}

const NavCard = ({ map }: Props) => {
  const dispatch = useAppDispatch();

  const startLocation = useAppSelector((state) => state.nav.startLocation);
  const endLocation = useAppSelector((state) => state.nav.endLocation);
  const recommendedPath = useAppSelector((state) => state.nav.recommendedPath);
  const selectedPathNum = useAppSelector((state) => state.nav.selectedPathNum);
  const startedNavigation = useAppSelector(
    (state) => state.nav.startedNavigation,
  );
  const token = useClerkToken();

  // calculate path from start to end
  useEffect(() => {
    if (startLocation && endLocation) {
      dispatch(setRecommendedPath(null));
      fetch(
        process.env.NEXT_PUBLIC_SEARCH_ENDPOINT +
          process.env.NODE_ENV +
          '/find-path',
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ waypoints: [startLocation, endLocation] }),
        },
      )
        .then((r) => {
          try {
            return r.json();
          } catch {
            return null;
          }
        })
        .catch(() => {
          return null;
        })
        .then((j) => {
          if (!j || j.error || j.message == 'Internal Server Error') {
            toast.error('Sorry, these rooms are not connected (yet) 😢');
            return;
          } else {
            dispatch(setRecommendedPath(j));
            dispatch(setSelectedPathNum(Object.keys(j)[0]));
          }
        });
    }
  }, [startLocation, endLocation, dispatch, token]);

  const renderTop = () => {
    return (
      <div className="ml-4 flex items-center gap-1 py-2 sm:ml-0">
        <IoIosArrowBack
          size={20}
          className="cursor-pointer text-gray-500"
          onClick={() => {
            if (startedNavigation) {
              dispatch(setCurFloorIndex(-1));
              dispatch(setStartedNavigation(false));
            } else {
              dispatch(setRecommendedPath(null));
              dispatch(setIsNavOpen(false));
              dispatch(setEndLocation(null));
              dispatch(setStartLocation(null));
            }
          }}
        />
        <h1 className="font-bold">Navigation</h1>
      </div>
    );
  };

  const renderRoomInput = (
    navLocation: Waypoint | null,
    placeHolder: string,
    icon: StaticImport,
    handleClick: () => void,
  ) => {
    const renderText = () => {
      if (navLocation) {
        if ('floor' in navLocation) {
          if (navLocation.alias) {
            return <p>{navLocation.alias}</p>;
          }

          return (
            <p>{navLocation.floor?.buildingCode + ' ' + navLocation.name}</p>
          );
        } else if ('name' in navLocation) {
          return <p>{navLocation.name}</p>;
        } else if ('userPosition' in navLocation) {
          return <p>Your Location</p>;
        } else if ('waypoint' in navLocation) {
          return <p>Waypoint</p>;
        }
      } else {
        return <p className="text-[gray]">{placeHolder}</p>;
      }
    };

    return (
      <div className="flex w-fit items-center gap-2 border p-1">
        <Image src={icon} alt="icon" height={20} />
        <button
          className="w-72 text-left"
          onClick={() => {
            if (!startedNavigation) {
              handleClick();
              dispatch(setIsSearchOpen(true));
            }
          }}
        >
          {renderText()}
        </button>
      </div>
    );
  };

  const renderStartRoomInput = () => {
    const placeHolder = 'Choose your starting location...';

    const handleClick = () => {
      dispatch(setChoosingRoomMode('start'));
    };

    return renderRoomInput(startLocation, placeHolder, startIcon, handleClick);
  };

  const renderEndRoomInput = () => {
    const placeHolder = 'Choose your destination...';

    const handleClick = () => {
      dispatch(setChoosingRoomMode('end'));
    };

    return renderRoomInput(endLocation, placeHolder, endIcon, handleClick);
  };
  const renderPathInfo = (pathNum: number, distanceMeters: number) => {
    return (
      <div key={String(pathNum)} className="flex w-full justify-center">
        <button
          className={`w-[22.5rem] rounded-lg border py-2 ${pathNum == selectedPathNum ? 'bg-[#1e86ff] text-white' : 'text-gray-600'}`}
          onClick={() => dispatch(setSelectedPathNum(pathNum))}
        >
          <div className="mx-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {pathNumToIcon[pathNum]}
              <div>
                <p
                  className={`text-lg ${pathNum == selectedPathNum ? 'text-gray-800"' : 'text-gray-600'}`}
                >
                  {pathNumToName[pathNum]}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p>{((distanceMeters / 1609) * 20).toFixed(1)} mins.</p>
              <p>{(distanceMeters / 1609).toFixed(2)} mi.</p>
            </div>
          </div>
        </button>
      </div>
    );
  };

  const renderPathWrapper = () => {
    console.log(recommendedPath);
    return (
      recommendedPath && (
        <div className="my-2 space-y-2">
          {recommendedPath.map(({ distance }, pathNum) =>
            renderPathInfo(pathNum, distance),
          )}
        </div>
      )
    );
  };

  const renderNavInfo = () => {
    const renderGoButton = () => {
      return (
        <div className="flex w-full justify-center">
          <button
            className="btn-shadow w-[22.5rem] rounded-lg bg-[#31B777] py-2"
            onClick={() => {
              dispatch(setCurFloorIndex(0));
              dispatch(setStartedNavigation(true));
            }}
          >
            <p className="text-white">GO</p>
          </button>
        </div>
      );
    };

    const renderCancelButton = () => {
      return (
        <div className="flex w-full justify-center">
          <button
            className="btn-shadow w-[22.5rem] rounded-lg bg-[#c41230] py-2"
            onClick={() => {
              dispatch(setCurFloorIndex(-1));
              dispatch(setStartedNavigation(false));
            }}
          >
            <p className="text-white">Cancel</p>
          </button>
        </div>
      );
    };

    return (
      <>
        {!startedNavigation ? renderGoButton() : renderCancelButton()}
        {!startedNavigation
          ? renderPathWrapper()
          : recommendedPath &&
            map && (
              <NavDirections
                path={recommendedPath[selectedPathNum].path}
                map={map}
              />
            )}
      </>
    );
  };

  const renderSwapButton = () => {
    return (
      <button
        onClick={() => {
          dispatch(setStartLocation(endLocation));
          dispatch(setEndLocation(startLocation));
        }}
      >
        <Image src={swapIcon} alt="Swap Icon" />
      </button>
    );
  };

  return (
    //<CardWrapper isOpen={true} snapPoint={0.4}>
    <>
      <div>
        {renderTop()}
        <div className="flex gap-4">
          <div className="space-y-2 pb-2 pl-4">
            {renderStartRoomInput()}
            {renderEndRoomInput()}
          </div>
          {renderSwapButton()}
        </div>
        {!!startLocation &&
          !!endLocation &&
          !!recommendedPath &&
          renderNavInfo()}
      </div>
    </>
    //</CardWrapper>
  );
};

export default NavCard;
