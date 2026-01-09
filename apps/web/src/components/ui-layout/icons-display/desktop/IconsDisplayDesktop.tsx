import { useState } from "react";
import userMenuIcon from "@/assets/icons/plus_button_menu/mobile/settings.svg";
import UserMenu from "@/components/ui-layout/icons-display/UserMenu";
import PlusButton from "../PlusButton";

enum PlusButtonMenuState {
  CLOSED = 0,
  OPEN = 1,
  COURSES_SELECTED = 2,
  QUESTION_MARK_SELECTED = 3,
  USER_SELECTED = 4,
}

interface MenuButtonProps {
  icon: string;
  altText: string;
  selectedMenuState: PlusButtonMenuState;
  menu: () => React.ReactElement;
}

const IconsDisplayDesktop = () => {
  const [plusButtonMenuState, setPlusButtonMenuState] = useState(
    PlusButtonMenuState.CLOSED,
  );

  // if (isSearchOpen || isCardOpen || isNavOpen) {
  //   return;
  // }

  const menuButtons: MenuButtonProps[] = [
    {
      icon: userMenuIcon,
      altText: "User Menu",
      selectedMenuState: PlusButtonMenuState.USER_SELECTED,
      menu: UserMenu,
    },
  ];

  const renderMenuButton = (
    { icon, altText, selectedMenuState, menu }: MenuButtonProps,
    index: number,
  ) => {
    const handleClick = (event: React.MouseEvent) => {
      if (plusButtonMenuState === selectedMenuState) {
        setPlusButtonMenuState(PlusButtonMenuState.OPEN);
      } else if (plusButtonMenuState !== PlusButtonMenuState.CLOSED) {
        setPlusButtonMenuState(selectedMenuState);
      }
      console.log("clicked");
      event.stopPropagation();
    };

    const style = {
      transform:
        plusButtonMenuState === PlusButtonMenuState.CLOSED
          ? ""
          : `translateY(${-68 * (menuButtons.length - index)}px)`,
    };

    return (
      <div key={index}>
        <button
          type="button"
          onClick={handleClick}
          className={`${
            plusButtonMenuState === PlusButtonMenuState.CLOSED
              ? ""
              : "btn-shadow-dark"
          } ${plusButtonMenuState === selectedMenuState ? "bg-background-brand-primary-enabled" : "bg-blue-gray-500"} fixed right-14 bottom-16 flex h-14 w-14 rounded-full transition-transform duration-500 ease-in-out`}
          style={style}
        >
          <img className="m-auto" alt={altText} src={icon} />
        </button>
        {plusButtonMenuState === selectedMenuState && (
          <div
            className="absolute right-0 bottom-0 w-[350px]"
            style={{
              transform: `translateY(-${68 * (menuButtons.length) + 88}px)`,
            }}
          >
            {menu()}
          </div>
        )}
      </div>
    );
  };

  const renderPlusButton = () => {
    const handleClick = () => {
      setPlusButtonMenuState(
        plusButtonMenuState === PlusButtonMenuState.CLOSED
          ? PlusButtonMenuState.OPEN
          : PlusButtonMenuState.CLOSED,
      );
      console.log("CLICKED");
    };

    return (
      <div className="fixed right-14 bottom-16">
        <PlusButton
          isMenuOpen={plusButtonMenuState !== PlusButtonMenuState.CLOSED}
          isPlusButtonSelected={
            plusButtonMenuState === PlusButtonMenuState.CLOSED ||
            plusButtonMenuState === PlusButtonMenuState.OPEN
          }
          onClick={handleClick}
          onBlur={() => setPlusButtonMenuState(PlusButtonMenuState.CLOSED)}
        >
          {menuButtons.map(renderMenuButton)}
        </PlusButton>
      </div>
    );
  };

  return <>{renderPlusButton()}</>;
};

export default IconsDisplayDesktop;
