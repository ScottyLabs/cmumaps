import boothIcon from "@/assets/carnival/icons/booth-filter.svg";
import buggyIcon from "@/assets/carnival/icons/buggy-filter.svg";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useNavigateLocationParams } from "@/hooks/useNavigateLocationParams";
import { useBoundStore } from "@/store";
import { CardStates } from "@/store/cardSlice";

const FilterCarousel = () => {
  const entries = [
    { name: "Buggy", icon: buggyIcon, id: "carnival/buggy" },
    { name: "Booth", icon: boothIcon, id: "carnival/booth" },
  ];

  const hideSearch = useBoundStore((state) => state.hideSearch);
  const setCardStatus = useBoundStore((state) => state.setCardStatus);

  const isMobile = useIsMobile();
  const navigate = useNavigateLocationParams();

  //   const navigate = useNavigateLocationParams();

  const renderFilterButton = (
    { name, icon, id }: { name: string; icon: string; id: string },
    index: number,
  ) => (
    <button
      type="button"
      key={index}
      className="flex h-8 shrink-0 items-center gap-1.5 rounded-sm bg-[#C32C2D] px-2.5 font-inter font-semibold text-sm text-white"
      onClick={() => {
        navigate(`/${id}`);
        // setSearchQuery(name);
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
