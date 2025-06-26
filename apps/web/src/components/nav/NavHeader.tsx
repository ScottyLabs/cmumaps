import { getBuildingsQueryOptions } from "@/api/apiClient";
import cancelIcon from "@/assets/icons/nav/nav-overlay/cancel.svg";
import forwardArrowIcon from "@/assets/icons/nav/nav-overlay/forward-arrow.svg";
import headerIcon from "@/assets/icons/nav/nav-overlay/header.svg";
import swapIcon from "@/assets/icons/nav/nav-overlay/swap.svg";
import useNavigateLocationParams from "@/hooks/useNavigateLocationParams";
import { useQuery } from "@tanstack/react-query";

interface NavHeaderProps {
  src: string;
  dst: string;
  isNavigating: boolean;
  setSrc: (_: string | null) => void;
  setDst: (_: string | null) => void;
  startNav: () => void;
}

const NavHeader = ({
  src,
  dst,
  setSrc,
  setDst,
  isNavigating,
  startNav,
}: NavHeaderProps) => {
  const { data: buildings } = useQuery(getBuildingsQueryOptions());

  const navigate = useNavigateLocationParams();

  const srcName =
    src === "user"
      ? "Your Location"
      : buildings && src
        ? buildings[src]?.name || "Invalid Building"
        : "Loading...";
  const dstName =
    dst === "user"
      ? "Your Location"
      : buildings && dst
        ? buildings[dst]?.name || "Invalid Building"
        : "Loading...";

  const ChooseHeader = () => {
    return (
      <div className="btn-shadow fixed inset-x-[19px] top-10 z-50 overflow-auto rounded-lg bg-white">
        <div className="flex">
          <img
            src={headerIcon}
            className="mt-[14px] mr-[10px] mb-[9px] ml-[13px] w-[33px] h-[84px]"
            width={33}
            height={84}
          />
          <div className="btn-shadow absolute left-[18.22px] top-[70.22px] w-[22.56px] h-[22.56px] rounded-full" />

          {/* <div className="w-full">
					<div className="relative pb-[11.5px] pt-[23.5px] w-fit font-body-1 font-[number:var(--body-1-font-weight)] text-[#1e86ff] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] whitespace-nowrap [font-style:var(--body-1-font-style)]">
						Your Location
					</div>
					<hr className="border-gray-200" />
					<div className="relative pt-[11.5px] pb-[20px] w-fit font-body-1 font-[number:var(--body-1-font-weight)] text-black text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] whitespace-nowrap [font-style:var(--body-1-font-style)]">
						Gates & Hillman Centers
					</div>
				</div> */}
          <div className="w-full">
            <div className="flex flex-col items-start gap-3 pt-[23.5px]">
              <div className="flex h-[19px] items-center gap-2.5 relative self-stretch w-full">
                <div className="relative w-fit mt-[-1.50px] font-body-1 font-[number:var(--body-1-font-weight)] text-[#1e86ff] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] whitespace-nowrap [font-style:var(--body-1-font-style)]">
                  {srcName}
                </div>
              </div>

              <hr className="w-full border-gray-300" />

              <div className="relative self-stretch font-body-1 font-[number:var(--body-1-font-weight)] text-black text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] [font-style:var(--body-1-font-style)]">
                {dstName}
              </div>
            </div>
            <button
              type="button"
              className="absolute top-[19.33px] right-[13.63px]"
              onClick={() => {
                setSrc("user");
              }}
            >
              <img src={cancelIcon} alt="cancel" />
            </button>
            <button
              type="button"
              className="absolute right-[13px] bottom-[17px]"
              onClick={() => {
                const temp = src;
                navigate(temp);
                setSrc(dst);
                setDst(temp);
              }}
            >
              <img src={swapIcon} alt="cancel" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NavigateHeader = () => {
    return (
      <div className="btn-shadow fixed inset-x-[19px] top-10 z-50 overflow-auto rounded-lg bg-[#31b777]">
        <div className="flex">
          <img
            src={forwardArrowIcon}
            alt="forward"
            className="my-[22px] mr-[19px] ml-[30px]"
          />
          <div className="flex-col mt-[16px]">
            <div className="font-semibold font-lato text-[2rem] text-white">
              Stay Straight
            </div>
            <div className="pl-[2px] font-semibold font-lato text-[15px] text-white -translate-y-2">
              for 100 ft
            </div>
          </div>
          <div className="absolute top-[40px] right-[20px] font-semibold font-lato text-[17px] text-white -translate-y-2">
            {dst}
          </div>
        </div>
      </div>
    );
  };

  return isNavigating ? <NavigateHeader /> : <ChooseHeader />;
};

export default NavHeader;
