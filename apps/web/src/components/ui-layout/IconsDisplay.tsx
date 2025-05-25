import { UserButton, UserProfile } from "@clerk/clerk-react";

import questionMarkIcon from "@/assets/icons/question-mark.png";
import plusButtonSelected from "@/assets/icons/plus_button_menu/plus-button-selected.svg";
import plusButtonDeselected from "@/assets/icons/plus_button_menu/plus-button-deselected.svg";
import coursesButtonSelected from "@/assets/icons/plus_button_menu/courses-button-selected.svg";
import coursesButtonDeselected from "@/assets/icons/plus_button_menu/courses-button-deselected.svg";
import questionMarkButtonSelected from "@/assets/icons/plus_button_menu/question-mark-button-selected.svg";
import questionMarkButtonDeselected from "@/assets/icons/plus_button_menu/question-mark-button-deselected.svg";
import userButtonSelected from "@/assets/icons/plus_button_menu/user-button-selected.svg";
import userButtonDeselected from "@/assets/icons/plus_button_menu/user-button-deselected.svg";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";
import { AnimationControls, motion, TargetAndTransition, useAnimation, VariantLabels } from "motion/react";
import { ReactElement, useRef, useState } from "react";

const IconsDisplay = () => {
  const isMobile = useIsMobile();
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);
  const { isCardOpen } = useLocationParams();

  const plusButtonControls = useAnimation();
  const coursesButtonControls = useAnimation();
  const questionMarkButtonControls = useAnimation();
  const userButtonControls = useAnimation(); 

  const userButtonRef = useRef<HTMLDivElement | null>(null);

  enum PlusButtonMenuState {
    CLOSED = 0,
    OPEN = 1,
    COURSES_SELECTED = 2,
    QUESTION_MARK_SELECTED = 3,
    USER_SELECTED = 4,
  }

  const [plusButtonMenuState, setPlusButtonMenuState] = useState(PlusButtonMenuState.CLOSED);
  // const [isRenderingButtons, setIsRenderingButtons] = useState(false);

  // Don't show icons in mobile
  // if either the card is open or the search is open
  if (isMobile && (isSearchOpen || isCardOpen)) {
    return <></>;
  }

  const plusButtonOnClick = () => {
    // if (!isPlusButtonMenuOpen) {
    //   setIsRenderingButtons(true);
    // }
    plusButtonControls.start({
      rotate: plusButtonMenuState == PlusButtonMenuState.CLOSED ? 0 : 45,
      transition: {
        bounce: 0
      },
    });
    ([coursesButtonControls, questionMarkButtonControls, userButtonControls]).forEach((control, i) => {
      control?.start({
        y: plusButtonMenuState == PlusButtonMenuState.CLOSED ? -54 * (i+1) : 0,
        transition: {
          bounce: 0
        }
      })
    });
    setPlusButtonMenuState(plusButtonMenuState == PlusButtonMenuState.CLOSED ? PlusButtonMenuState.OPEN : PlusButtonMenuState.CLOSED);
  }

  const renderPlusButton = (children : ReactElement[]) => {
    return (
      <div className="btn-shadow fixed right-3 bottom-3 sm:right-3.5 sm:bottom-3.5 rounded-full" onClick={plusButtonOnClick}>
        {children}
        <motion.div 
        animate={plusButtonControls} 
        initial={{ rotate: 45 }}
        // onAnimationComplete={() => {if (!isPlusButtonMenuOpen) {setIsRenderingButtons(false); console.log("CLOSING");}}}
        >
            <img
              alt="Plus Button"
              src={(plusButtonMenuState == PlusButtonMenuState.CLOSED || plusButtonMenuState == PlusButtonMenuState.OPEN) ? plusButtonSelected : plusButtonDeselected}
              height={isMobile ? 43 : 50}
              width={isMobile ? 43 : 50}
            />
        </motion.div>
        
      </div>
    );
  };

  // const renderButton1 = () => {
  //   return (
  //     <motion.div animate={button1Controls} className="btn-shadow fixed">
  //       <UserButton />
  //     </motion.div>
  //   );
    
  // };

  const renderQuestionMarkButton = () => {
    return (
      <motion.div 
        animate={questionMarkButtonControls} 
        className="btn-shadow fixed right-3 bottom-3 sm:right-3.5 sm:bottom-3.5 rounded-full"
        // hidden={!isRenderingButtons
        >
          <img
            alt="Question Mark"
            src={(plusButtonMenuState == PlusButtonMenuState.QUESTION_MARK_SELECTED) ? questionMarkButtonSelected : questionMarkButtonDeselected}
            height={isMobile ? 43 : 50}
            width={isMobile ? 43 : 50}
          />
      </motion.div>
    );
  };

  const renderCoursesButton = () => {
    return (
      <motion.div 
        animate={coursesButtonControls} 
        className="btn-shadow fixed right-3 bottom-3 sm:right-3.5 sm:bottom-3.5 rounded-full"
        // hidden={!isRenderingButtons
        >
          <img
            alt="Question Mark"
            src={(plusButtonMenuState == PlusButtonMenuState.COURSES_SELECTED) ? coursesButtonSelected : coursesButtonDeselected}
            height={isMobile ? 43 : 50}
            width={isMobile ? 43 : 50}
          />
      </motion.div>
    );
  };

  const renderUserButton = () => {
    
    const handleClick = () => {
      if (plusButtonMenuState == PlusButtonMenuState.USER_SELECTED) {
        setPlusButtonMenuState(PlusButtonMenuState.OPEN);
        return;
      } else {
        setPlusButtonMenuState(PlusButtonMenuState.USER_SELECTED);
      }

      // Find the button inside the Clerk UserButton and click it
      const internalButton = userButtonRef.current?.querySelector('button');
      internalButton?.click();
    };

    return (
      <motion.div 
        animate={userButtonControls} 
        className="btn-shadow fixed flex right-3 bottom-3 sm:right-3.5 sm:bottom-3.5 rounded-full"
        // hidden={!isRenderingButtons
        >
          {/* <div className="fixed right-3 bottom-3 sm:right-3.5 sm:bottom-3.5"> */}
      {/* Hidden UserButton (still renders menu logic) */}
      <div ref={userButtonRef} className="absolute right-[4px] -z-10 opacity-0 pointer-events-none">
        <UserButton />
      </div>

      {/* Custom Button */}
      <div
        onClick={handleClick}
        // className="w-[43px] h-[43px] rounded-full flex items-center justify-center bg-white shadow-md"
      >
        {/* Replace with your own SVG */}
        <img
          alt="Question Mark"
          src={(plusButtonMenuState == PlusButtonMenuState.USER_SELECTED) ? userButtonSelected : userButtonDeselected}
          height={isMobile ? 43 : 50}
          width={isMobile ? 43 : 50}
        />
      </div>
    {/* </div> */}
          {/* <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 43, height: 43 } } }} /> */}
          {/* <UserButton
          
    
            appearance={{
              elements: {
                userButtonAvatarBox: { 
                  display: 'none',
                },
                userButtonBox: {
                  width: 43,
                  height: 43,

                  // backgroundColor: 'transparent',
                  // position: 'absolute',
                  inset: 0,
                },
              },
            }}
          />
        <img
            className="fixed"
            style={{pointerEvents: 'none'}}
            alt="Question Mark"
            src={questionMarkIcon}
            height={isMobile ? 43 : 50}
            width={isMobile ? 43 : 50}
          /> */}
          {/* {plusButtonMenuState == PlusButtonMenuState.USER_SELECTED && <UserProfile/>} */}
      </motion.div>
    );
  };

  const renderClerkIcon = () => {
    if (isMobile) {
      return (
        <div className="fixed right-3 bottom-[7.5rem] flex items-center justify-center rounded-full bg-[#4b5563] p-2">
          <UserButton />
        </div>
      );
    } else {
      return (
        <div className="fixed top-14 right-6">
          <UserButton />
        </div>
      );
    }
  };

  const renderQuestionMarkIcon = () => {
    return (
      <div className="btn-shadow fixed right-3 bottom-[4.5rem] rounded-full sm:right-3.5 sm:bottom-16">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://docs.google.com/document/d/1jZeIij72ovf3K2J1J57rlD4pz3xnca3BfPedg9Ff1sc/edit"
        >
          <img
            alt="Question Mark"
            src={questionMarkIcon}
            height={isMobile ? 43 : 50}
            width={isMobile ? 43 : 50}
          />
        </a>
      </div>
    );
  };

  if (isMobile) {
  return (
    <>
        {renderUserButton()}
        {renderQuestionMarkButton()}
        {renderCoursesButton()}
        {renderPlusButton([])}
        
        {/* {renderButton1()} */}
      {/* {renderClerkIcon()}
      {renderQuestionMarkIcon()} */}
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
