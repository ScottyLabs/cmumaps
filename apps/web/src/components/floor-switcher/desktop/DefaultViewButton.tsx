interface Props {
  disabled: boolean;
  handleClick: () => void;
  children: React.ReactNode;
}

const DefaultViewButton = ({ disabled, handleClick, children }: Props) => {
  return (
    <div className="border-gray-300 border-l">
      <button
        type="button"
        className={`flex h-full w-full items-center px-2 ${
          disabled ? "text-gray-300" : "cursor-pointer"
        }`}
        disabled={disabled}
        onClick={handleClick}
      >
        {children}
      </button>
    </div>
  );
};

export default DefaultViewButton;
