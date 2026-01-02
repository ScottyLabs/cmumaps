import plusIcon from "@/assets/icons/plus_button_menu/mobile/plus.svg";

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
    <button
      type="button"
      className={`${
        isMenuOpen ? "btn-shadow-dark" : "btn-shadow"
      } fixed bottom-8 left-5 z-50 rounded-full`}
      onClick={onClick}
    >
      <div
        className={`${isMenuOpen ? "" : "rotate-45"} ${isPlusButtonSelected ? "bg-background-brand-primary-enabled" : "bg-blue-gray-500"} flex h-14 w-14 rounded-full transition-transform duration-500 ease-in-out`}
      >
        <img alt="Plus Button" className="m-auto rotate-45" src={plusIcon} />
      </div>
    </button>
  );
};

export default PlusButton;
