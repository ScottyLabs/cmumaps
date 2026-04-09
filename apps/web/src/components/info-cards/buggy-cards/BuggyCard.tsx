import buggyScheduleIcon from "@/assets/carnival/icons/buggy-schedule.svg";
import buggyBackground from "@/assets/carnival/images/buggy-background.png";
import { ButtonsRow } from "@/components/info-cards/shared/buttons-row/ButtonsRow.tsx";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useBoundStore } from "@/store";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const BuggyCard = ({ mapRef: _mapRef }: Props) => {
  const isCardCollapsed = useBoundStore((state) => state.isCardCollapsed());
  const isMobile = useIsMobile();

  return (
    <>
      {!(isCardCollapsed && isMobile) && (
        <img src={buggyBackground} alt="Buggy Background" />
      )}
      <h2 className="ml-3 pt-2 font-medium">Buggy</h2>
      <span>
        <ButtonsRow
          middleButton={
            <a href="https://cmubuggy.org/">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-primary-red px-5 py-2 text-white"
              >
                <img src={buggyScheduleIcon} alt="Buggy Schedule" />
                <span>Buggy Schedule</span>
              </button>
            </a>
          }
        />
      </span>
      {!(isCardCollapsed && isMobile) && (
        <>
          <hr className="border-[#efefef] border-[1.5px]" />
          <p className="px-6 py-4 font-normaltext-sm">
            Buggy, also known as Sweepstakes, is a competition where Greek and
            independent organizations race with their buggies, small, low,
            aerodynamic vehicles, powered only by gravity and human pushers. At
            its fastest, a buggy can reach speeds up to 35 miles per hour. And
            yes - there's a person in there! For more about Buggy and the
            complete schedule, check out the Buggy website.
          </p>
        </>
      )}
    </>
  );
};

export { BuggyCard };
