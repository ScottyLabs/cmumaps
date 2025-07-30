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
    <button
      type="button"
      className={`${
        isMenuOpen ? "btn-shadow-dark" : "btn-shadow"
      } fixed bottom-8 left-5 z-50 rounded-full`}
      onClick={onClick}
    >
      <div
        className={`${isMenuOpen ? "" : "rotate-45"} transition-transform duration-500 ease-in-out`}
      >
        <img alt="Plus Button" className="h-14 w-14" src={icon} />
      </div>
    </button>
  );
};

export default PlusButton;
