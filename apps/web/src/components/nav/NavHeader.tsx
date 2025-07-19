import $api from "@/api/client";
import cancelIcon from "@/assets/icons/nav/nav-overlay/cancel.svg";
import forwardArrowIcon from "@/assets/icons/nav/nav-overlay/forward-arrow.svg";
import headerIcon from "@/assets/icons/nav/nav-overlay/header.svg";
import swapIcon from "@/assets/icons/nav/nav-overlay/swap.svg";
import useNavigateLocationParams from "@/hooks/useNavigateLocationParams";

interface NavHeaderProps {
  src: string;
  dst: string;
  isNavigating: boolean;
  setSrc: (_: string | null) => void;
  setDst: (_: string | null) => void;
  startNav: () => void;
  listShown: boolean;
}

const NavHeader = ({
  src,
  dst,
  setSrc,
  setDst,
  isNavigating,
  // listShown,
}: NavHeaderProps) => {
  const { data: buildings } = $api.useQuery("get", "/buildings");
  const navigate = useNavigateLocationParams();

  // if (listShown) {
  //   return;
  // }

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

  const renderChooseHeader = () => {
    return (
      <div className="btn-shadow fixed inset-x-[19px] top-10 z-50 overflow-auto rounded-lg bg-white">
        <div className="flex">
          <img
            alt="navigation header"
            src={headerIcon}
            className="mt-[14px] mr-[10px] mb-[9px] ml-[13px] h-[84px] w-[33px]"
            width={33}
            height={84}
          />
          <div className="btn-shadow absolute top-[70.22px] left-[18.22px] h-[22.56px] w-[22.56px] rounded-full" />

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
              <div className="relative flex h-[19px] w-full items-center gap-2.5 self-stretch">
                <div className="relative mt-[-1.50px] w-fit whitespace-nowrap font-[number:var(--body-1-font-weight)] font-body-1 text-[#1e86ff] text-[length:var(--body-1-font-size)] leading-[var(--body-1-line-height)] tracking-[var(--body-1-letter-spacing)] [font-style:var(--body-1-font-style)]">
                  {srcName}
                </div>
              </div>

              <hr className="w-full border-gray-300" />

              <div className="relative self-stretch font-[number:var(--body-1-font-weight)] font-body-1 text-[length:var(--body-1-font-size)] text-black leading-[var(--body-1-line-height)] tracking-[var(--body-1-letter-spacing)] [font-style:var(--body-1-font-style)]">
                {dstName}
              </div>
            </div>
            <button
              type="button"
              className="absolute top-[0px] right-[13.63px]"
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
              <img src={swapIcon} alt="swap" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNavigateHeader = () => {
    return (
      <div className="btn-shadow fixed inset-x-[19px] top-10 overflow-auto rounded-lg bg-[#31b777]">
        <div className="flex">
          <img
            src={forwardArrowIcon}
            alt="forward"
            className="my-[22px] mr-[19px] ml-[30px]"
          />
          <div className="mt-[16px] flex-col">
            <div className="font-lato font-semibold text-[2rem] text-white">
              Stay Straight
            </div>
            <div className="-translate-y-2 pl-[2px] font-lato font-semibold text-[15px] text-white">
              for 100 ft
            </div>
          </div>
          <div className="-translate-y-2 absolute top-[40px] right-[20px] font-lato font-semibold text-[17px] text-white">
            {dst}
          </div>
        </div>
      </div>
    );
  };

  return isNavigating ? renderNavigateHeader() : renderChooseHeader();
};

export default NavHeader;
