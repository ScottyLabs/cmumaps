import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

interface Props {
  title: string | React.ReactElement;
  children: React.ReactElement;
}

const CollapsibleWrapper = ({ title, children }: Props) => {
  const [open, setOpen] = useState(false);

  const renderTrigger = () => (
    <div className="flex items-center justify-between rounded px-4 pt-2 pb-1">
      <h3>{title}</h3>
      <div>
        {open ? <IoIosArrowUp size={15} /> : <IoIosArrowDown size={15} />}
      </div>
    </div>
  );

  return (
    <div className="rounded bg-white">
      <div
        className="flex cursor-pointer flex-col"
        onClick={() => setOpen(!open)}
      >
        {renderTrigger()}
      </div>
      {open && children}
    </div>
  );
};

export default CollapsibleWrapper;
