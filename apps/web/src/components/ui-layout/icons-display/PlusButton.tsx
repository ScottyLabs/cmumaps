import plusButtonDeselected from "@/assets/icons/plus_button_menu/plus-button-deselected.svg";
import plusButtonSelected from "@/assets/icons/plus_button_menu/plus-button-selected.svg";

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
  const icon = isPlusButtonSelected ? plusButtonSelected : plusButtonDeselected;

  return (
    <div
      className={`${
        isMenuOpen ? "btn-shadow-dark" : "btn-shadow"
      } fixed right-5 bottom-6 z-50 rounded-full sm:right-3.5 sm:bottom-3.5`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`${isMenuOpen ? "" : "rotate-45"} transition-transform duration-500 ease-in-out`}
      >
        <img alt="Plus Button" className="h-14 w-14" src={icon} />
      </button>
    </div>
  );
};

export default PlusButton;
