import { UserButton } from "@clerk/clerk-react";
import questionMarkIcon from "@icons/question-mark.png";

import useIsMobile from "@/hooks/useIsMobile";

const IconsDisplay = () => {
  const isMobile = useIsMobile();

  // don't show icons if in mobile and
  // either the search is open or the card is open
  //   if (isMobile && (isSearchOpen || isCardOpen)) {
  //     return <></>;
  //   }

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

  return (
    <>
      {renderClerkIcon()}
      {renderQuestionMarkIcon()}
    </>
  );
};

export default IconsDisplay;
