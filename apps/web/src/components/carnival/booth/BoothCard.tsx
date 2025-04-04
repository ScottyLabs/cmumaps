import { useEffect } from "react";

import BoothCarousel from "@/components/carnival/booth/BoothCarousel";
import InfoCardImage from "@/components/info-cards/shared/media/InfoCardImage";
import { setSnapPoints } from "@/store/features/cardSlice";
import { useAppDispatch } from "@/store/hooks";

const BoothCard = () => {
  const dispatch = useAppDispatch();

  // set the mid snap point
  useEffect(() => {
    dispatch(setSnapPoints([170, 350, window.innerHeight]));
  }, [dispatch]);

  return (
    <div className="flex flex-col overflow-y-scroll scroll-smooth">
      <InfoCardImage
        url={"/imgs/carnival/booth.png"}
        alt={"Spring Carnival Image"}
      />
      <p className="m-5 text-sm font-medium">
        Booth is one of the biggest showpieces of Spring Carnival. Student
        organizations build multi-story structures around our chosen theme, such
        as last year's theme Arcade. These booths include interactive games and
        elaborate decorations. The booths are located on Midway, at the College
        of Fine Arts parking lot. Admission is free to see booths!
      </p>
      <BoothCarousel />
    </div>
  );
};

export default BoothCard;
