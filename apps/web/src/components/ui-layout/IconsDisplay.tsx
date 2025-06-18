import questionMarkIcon from "@/assets/icons/question-mark.png";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";
import { UserButton } from "@clerk/clerk-react";

const IconsDisplay = () => {
  const isMobile = useIsMobile();
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);
  const { isCardOpen } = useLocationParams();

  // Don't show icons in mobile
  // if either the card is open or the search is open
  if (isMobile && (isSearchOpen || isCardOpen)) {
    return <></>;
  }

  const renderClerkIcon = () => {
    if (isMobile) {
      return (
        <div className="fixed right-3 bottom-[7.5rem] flex items-center justify-center rounded-full bg-[#4b5563] p-2">
          <UserButton />
        </div>
      );
    }
    return (
      <div className="fixed top-14 right-6">
        <UserButton />
      </div>
    );
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
