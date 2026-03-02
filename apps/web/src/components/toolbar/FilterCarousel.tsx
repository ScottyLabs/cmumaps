import foodIcon from "@/assets/icons/filter-bar/food.svg";
import microwaveIcon from "@/assets/icons/filter-bar/microwave.svg";
import printerIcon from "@/assets/icons/filter-bar/printer.svg";
import studyIcon from "@/assets/icons/filter-bar/study.svg";
import vendingMachineIcon from "@/assets/icons/filter-bar/vending-machine.svg";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useBoundStore } from "@/store";
import { CardStates } from "@/store/cardSlice";

interface Props {
  setSearchQuery: (query: string) => void;
}

const FilterCarousel = ({ setSearchQuery }: Props) => {
  const entries = [
    { name: "Food", icon: foodIcon, id: "food" },
    { name: "Study Spots", icon: studyIcon, id: "study" },
    { name: "Printers", icon: printerIcon, id: "printer" },
    { name: "Microwaves", icon: microwaveIcon, id: "microwave" },
    {
      name: "Vending Machines",
      icon: vendingMachineIcon,
      id: "vending-machine",
    },
  ];

  const hideSearch = useBoundStore((state) => state.hideSearch);
  const setCardStatus = useBoundStore((state) => state.setCardStatus);

  const isMobile = useIsMobile();

  //   const navigate = useNavigateLocationParams();

  const renderFilterButton = (
    { name, icon /*id*/ }: { name: string; icon: string; id: string },
    index: number,
  ) => (
    <button
      type="button"
      key={index}
      className="flex h-8 shrink-0 items-center gap-1.5 rounded-sm bg-background-brand-secondary-enabled px-2.5 font-inter font-semibold text-blue-brand-700 text-sm"
      onClick={() => {
        // navigate(`/${id}`);
        setSearchQuery(name);
        hideSearch();
        setCardStatus(CardStates.HALF_OPEN);
      }}
    >
      <img src={icon} alt={`${name} icon`} width={20} height={20} />
      <span className="inline shrink-0">{name}</span>
    </button>
  );

  return (
    <div
      className={`no-scrollbar flex gap-3 overflow-x-scroll px-4 pb-2 ${!isMobile && "w-screen"}`}
    >
      {entries.map(renderFilterButton)}
    </div>
  );
};

export { FilterCarousel };
