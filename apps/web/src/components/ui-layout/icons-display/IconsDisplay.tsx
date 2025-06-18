import coursesButtonDeselected from "@/assets/icons/plus_button_menu/courses-button-deselected.svg";
import coursesButtonSelected from "@/assets/icons/plus_button_menu/courses-button-selected.svg";
import plusButtonDeselected from "@/assets/icons/plus_button_menu/plus-button-deselected.svg";
import plusButtonSelected from "@/assets/icons/plus_button_menu/plus-button-selected.svg";
import questionMarkButtonDeselected from "@/assets/icons/plus_button_menu/question-mark-button-deselected.svg";
import questionMarkButtonSelected from "@/assets/icons/plus_button_menu/question-mark-button-selected.svg";
import settingsIcon from "@/assets/icons/plus_button_menu/settings.svg";
import signInIcon from "@/assets/icons/plus_button_menu/sign-in.svg";
import signOutIcon from "@/assets/icons/plus_button_menu/sign-out.svg";
import userButtonDeselected from "@/assets/icons/plus_button_menu/user-button-deselected.svg";
import userButtonSelected from "@/assets/icons/plus_button_menu/user-button-selected.svg";
import questionMarkIcon from "@/assets/icons/question-mark.png";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";
import { UserButton, useClerk, useUser } from "@clerk/clerk-react";
import { motion } from "motion/react";
import { useState } from "react";
import AboutMenu from "./AboutMenu";
import CoursesMenu from "./CoursesMenu";

enum PlusButtonMenuState {
  CLOSED = 0,
  OPEN = 1,
  COURSES_SELECTED = 2,
  QUESTION_MARK_SELECTED = 3,
  USER_SELECTED = 4,
}

interface MenuButtonData {
  deselectedIcon: string;
  selectedIcon: string;
  altText: string;
  selectedMenuState: PlusButtonMenuState;
  menu: () => React.ReactElement;
}

interface PlusButtonProps {
  isMenuOpen: boolean;
  isPlusButtonSelected: boolean;
  onClick: () => void;
}

const PlusButton = ({
  isMenuOpen,
  isPlusButtonSelected,
  onClick,
}: PlusButtonProps) => {
  return (
    <div
      className={`${
        isMenuOpen ? "btn-shadow-dark " : "btn-shadow "
      }fixed right-3 bottom-3 z-50 rounded-full sm:right-3.5 sm:bottom-3.5`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClick();
        }
      }}
    >
      <motion.div
        animate={{
          rotate: isMenuOpen ? 0 : 45,
          transition: {
            bounce: 0,
          },
        }}
      >
        <img
          alt="Plus Button"
          src={isPlusButtonSelected ? plusButtonSelected : plusButtonDeselected}
          height={43}
          width={43}
        />
      </motion.div>
    </div>
  );
};

const IconsDisplay = () => {
  const isMobile = useIsMobile();
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);
  const { isCardOpen } = useLocationParams();

  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, openUserProfile, openSignIn } = useClerk();

  const [plusButtonMenuState, setPlusButtonMenuState] = useState(
    PlusButtonMenuState.CLOSED,
  );

  if (isMobile && (isSearchOpen || isCardOpen)) {
    return <></>;
  }

  // UserMenu is defined here since it uses the useUser and useClerk hooks
  const UserMenu = () => {
    const text = isLoaded
      ? isSignedIn
        ? `Signed in as ${user.firstName} ${user.lastName}`
        : "Not signed in"
      : "Loading user...";

    if (!isLoaded || !isSignedIn)
      return (
        <div className="btn-shadow-dark fixed inset-x-5 bottom-57 z-50 rounded-lg border border-gray-200 bg-white px-4 pt-4 pb-1 font-sans shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <div>
              <div className="text-center font-semibold text-gray-800 text-sm">
                {text}
              </div>
            </div>
          </div>

          {isLoaded && (
            <>
              <hr className="-mx-4 my-1 border-gray-200" />
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md bg-white px-3 py-2 text-gray-700 text-sm active:bg-gray-100"
                onClick={() => openSignIn()}
              >
                <img
                  src={signInIcon}
                  alt="Sign In Button"
                  width={24}
                  height={24}
                />
                <span>Sign In</span>
              </button>
            </>
          )}
        </div>
      );

    const avatarUrl = user.imageUrl;
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    const email = user.primaryEmailAddress?.emailAddress;

    return (
      <div className="btn-shadow-dark fixed inset-x-5 bottom-57 z-50 rounded-lg border border-gray-200 bg-white px-4 pt-4 pb-1 font-sans shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="h-12 w-12 rounded-full"
          />
          <div>
            <div className="font-semibold text-gray-800 text-sm">
              {fullName || "No name"}
            </div>
            <div className="text-gray-500 text-sm">{email || "No email"}</div>
          </div>
        </div>

        <hr className="-mx-4 my-1 border-gray-200" />

        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md bg-white px-3 py-2 text-gray-700 text-sm active:bg-gray-100"
          onClick={() => openUserProfile()}
        >
          <img
            src={settingsIcon}
            alt="User Settings Button"
            width={24}
            height={24}
          />
          <span>Manage Account</span>
        </button>

        <hr className="-mx-4 my-1 border-gray-200" />

        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md bg-white px-3 py-2 text-gray-700 text-sm focus:bg-gray-100"
          onClick={() => signOut()}
        >
          <img src={signOutIcon} alt="Sign Out Button" width={24} height={24} />
          <span>Sign Out</span>
        </button>
      </div>
    );
  };

  const menuButtons: MenuButtonData[] = [
    {
      deselectedIcon: userButtonDeselected,
      selectedIcon: userButtonSelected,
      altText: "User Menu",
      selectedMenuState: PlusButtonMenuState.USER_SELECTED,
      menu: UserMenu,
    },
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
    }: MenuButtonData,
    index: number,
  ) => {
    const onClick = () => {
      if (plusButtonMenuState === selectedMenuState) {
        setPlusButtonMenuState(PlusButtonMenuState.OPEN);
      } else if (plusButtonMenuState !== PlusButtonMenuState.CLOSED) {
        setPlusButtonMenuState(selectedMenuState);
      }
    };

    return (
      <>
        <motion.div
          animate={{
            y:
              plusButtonMenuState === PlusButtonMenuState.CLOSED
                ? 0
                : -54 * (menuButtons.length - index),
            transition: {
              bounce: 0,
            },
          }}
          className={`${
            plusButtonMenuState === PlusButtonMenuState.CLOSED
              ? ""
              : "btn-shadow-dark "
          }fixed right-3 bottom-3 z-50 rounded-full sm:right-3.5 sm:bottom-3.5`}
          onClick={onClick}
        >
          <img
            alt={altText}
            src={
              plusButtonMenuState === selectedMenuState
                ? selectedIcon
                : deselectedIcon
            }
            height={43}
            width={43}
          />
        </motion.div>
        {plusButtonMenuState === selectedMenuState && menu()}
      </>
    );
  };

  const renderClerkIcon = () => {
    return (
      <div className="fixed right-3 bottom-[7.5rem] flex items-center justify-center rounded-full bg-[#4b5563] p-2">
        <UserButton />
      </div>
    );
  };

  const renderQuestionMarkIcon = () => {
    return (
      <div className="btn-shadow-dark fixed right-3 bottom-[4.5rem] rounded-full sm:right-3.5 sm:bottom-16">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://docs.google.com/document/d/1jZeIij72ovf3K2J1J57rlD4pz3xnca3BfPedg9Ff1sc/edit"
        >
          <img
            alt="Question Mark"
            src={questionMarkIcon}
            height={50}
            width={50}
          />
        </a>
      </div>
    );
  };

  const onClickBackground = () => {
    if (plusButtonMenuState === PlusButtonMenuState.OPEN)
      setPlusButtonMenuState(PlusButtonMenuState.CLOSED);
    else setPlusButtonMenuState(PlusButtonMenuState.OPEN);
  };

  if (isMobile) {
    return (
      <>
        {plusButtonMenuState !== PlusButtonMenuState.CLOSED && (
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md"
            onClick={onClickBackground}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onClickBackground();
              }
            }}
          />
        )}
        {menuButtons.map(renderMenuButton)}
        <PlusButton
          isMenuOpen={plusButtonMenuState !== PlusButtonMenuState.CLOSED}
          isPlusButtonSelected={
            plusButtonMenuState === PlusButtonMenuState.CLOSED ||
            plusButtonMenuState === PlusButtonMenuState.OPEN
          }
          onClick={() => {
            setPlusButtonMenuState(
              plusButtonMenuState === PlusButtonMenuState.CLOSED
                ? PlusButtonMenuState.OPEN
                : PlusButtonMenuState.CLOSED,
            );
          }}
        />
      </>
    );
  }

  return (
    <>
      {renderClerkIcon()}
      {renderQuestionMarkIcon()}
    </>
  );
};

export default IconsDisplay;
