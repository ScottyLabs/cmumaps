import plusIcon from "@/assets/icons/plus_button_menu/mobile/plus.svg";

interface PlusButtonProps {
  isMenuOpen: boolean;
  isPlusButtonSelected: boolean;
  onClick?: () => void;
  onBlur?: () => void;
  children?: React.ReactNode;
}

const PlusButton = ({
  isMenuOpen,
  isPlusButtonSelected,
  onClick,
  onBlur,
  children,
}: PlusButtonProps) => {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Outer element must be a div, since nested buttons are not allowed
    <div
      className={`${
        isMenuOpen ? "btn-shadow-dark" : "btn-shadow"
      } rounded-full`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onBlur?.();
        }
      }}
    >
      {children}
      <button onClick={onClick} type="button">
        <div
          className={`${isMenuOpen ? "" : "rotate-45"} ${isPlusButtonSelected ? "bg-background-brand-primary-enabled" : "bg-blue-gray-500"} flex h-14 w-14 rounded-full transition-transform duration-500 ease-in-out`}
        >
          <img alt="Plus Button" className="m-auto rotate-45" src={plusIcon} />
        </div>
      </button>
    </div>
  );
};

export default PlusButton;
