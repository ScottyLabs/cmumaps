import { useState } from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import questionMarkIcon from "@/assets/icons/question-mark.png";
import UserMenu from "@/components/ui-layout/icons-display/desktop/UserMenu";

const IconsDisplay = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const renderUserIcon = () => {
    return (
      <div className="fixed top-12 right-4 cursor-pointer">
        <IoPersonCircleSharp
          size={30}
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        />
        {isUserMenuOpen && <UserMenu />}
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

  return (
    <>
      {renderUserIcon()}
      {renderQuestionMarkIcon()}
    </>
  );
};

export default IconsDisplay;
