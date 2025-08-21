import { useState } from "react";
import coursesButtonDeselected from "@/assets/icons/plus_button_menu/courses-button-deselected.svg";
import coursesButtonSelected from "@/assets/icons/plus_button_menu/courses-button-selected.svg";
import questionMarkButtonDeselected from "@/assets/icons/plus_button_menu/question-mark-button-deselected.svg";
import questionMarkButtonSelected from "@/assets/icons/plus_button_menu/question-mark-button-selected.svg";
import useLocationParams from "@/hooks/useLocationParams";
import useNavigationParams from "@/hooks/useNavigationParams";
import useBoundStore from "@/store";
import AboutMenu from "./AboutMenu";
import CoursesMenu from "./CoursesMenu";
import PlusButton from "./PlusButton";

enum PlusButtonMenuState {
  CLOSED = 0,
  OPEN = 1,
  COURSES_SELECTED = 2,
  QUESTION_MARK_SELECTED = 3,
  USER_SELECTED = 4,
}

interface MenuButtonProps {
  deselectedIcon: string;
  selectedIcon: string;
  altText: string;
  selectedMenuState: PlusButtonMenuState;
  menu: (props: { lowerHeight: number }) => React.ReactElement;
}

const IconsDisplayMobile = () => {
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);
  const { isCardOpen } = useLocationParams();
  const { isNavOpen } = useNavigationParams();

  const [plusButtonMenuState, setPlusButtonMenuState] = useState(
    PlusButtonMenuState.CLOSED,
  );

  if (isSearchOpen || isCardOpen || isNavOpen) {
    return;
  }

  const menuButtons: MenuButtonProps[] = [
    // {
    //   deselectedIcon: userButtonDeselected,
    //   selectedIcon: userButtonSelected,
    //   altText: "User Menu",
    //   selectedMenuState: PlusButtonMenuState.USER_SELECTED,
    //   menu: () => {
    //     return UserMenu({ userProps, clerkFunctions });
    //   },
    // },
    {
      deselectedIcon: questionMarkButtonDeselected,
      selectedIcon: questionMarkButtonSelected,
      altText: "About",
      selectedMenuState: PlusButtonMenuState.QUESTION_MARK_SELECTED,
      menu: AboutMenu,
    },
    {
      deselectedIcon: coursesButtonDeselected,
      selectedIcon: coursesButtonSelected,
      altText: "Courses",
      selectedMenuState: PlusButtonMenuState.COURSES_SELECTED,
      menu: CoursesMenu,
    },
  ];

  const renderMenuButton = (
    {
      deselectedIcon,
      selectedIcon,
      altText,
      selectedMenuState,
      menu,
    }: MenuButtonProps,
    index: number,
  ) => {
    const handleClick = () => {
      if (plusButtonMenuState === selectedMenuState) {
        setPlusButtonMenuState(PlusButtonMenuState.OPEN);
      } else if (plusButtonMenuState !== PlusButtonMenuState.CLOSED) {
        setPlusButtonMenuState(selectedMenuState);
      }
    };

    const style = {
      transform:
        plusButtonMenuState === PlusButtonMenuState.CLOSED
          ? ""
          : `translateY(${-68 * (menuButtons.length - index)}px)`,
    };

    const icon =
      plusButtonMenuState === selectedMenuState ? selectedIcon : deselectedIcon;

    return (
      <div key={index}>
        <button
          type="button"
          onClick={handleClick}
          className={`${
            plusButtonMenuState === PlusButtonMenuState.CLOSED
              ? ""
              : "btn-shadow-dark"
          } fixed bottom-8 left-5 z-50 rounded-full transition-transform duration-500 ease-in-out`}
          style={style}
        >
          <img className="h-14 w-14" alt={altText} src={icon} />
        </button>
        {plusButtonMenuState === selectedMenuState &&
          menu({ lowerHeight: 104 + 68 * menuButtons.length })}
      </div>
    );
  };

  const renderBackground = () => {
    const handleClick = () => {
      if (plusButtonMenuState === PlusButtonMenuState.OPEN)
        setPlusButtonMenuState(PlusButtonMenuState.CLOSED);
      else setPlusButtonMenuState(PlusButtonMenuState.OPEN);
    };

    return (
      plusButtonMenuState !== PlusButtonMenuState.CLOSED && (
        <button
          type="button"
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md"
          onClick={handleClick}
        />
      )
    );
  };

  const renderPlusButton = () => {
    const handleClick = () => {
      setPlusButtonMenuState(
        plusButtonMenuState === PlusButtonMenuState.CLOSED
          ? PlusButtonMenuState.OPEN
          : PlusButtonMenuState.CLOSED,
      );
    };

    return (
      <PlusButton
        isMenuOpen={plusButtonMenuState !== PlusButtonMenuState.CLOSED}
        isPlusButtonSelected={
          plusButtonMenuState === PlusButtonMenuState.CLOSED ||
          plusButtonMenuState === PlusButtonMenuState.OPEN
        }
        onClick={handleClick}
      />
    );
  };

  return (
    <>
      {renderBackground()}

      {menuButtons.map(renderMenuButton)}

      {renderPlusButton()}
    </>
  );
};

export default IconsDisplayMobile;
