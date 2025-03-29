import BoothCarousel from "@/components/carnival/booth/BoothCarousel";
import { setBottomSnapPoint, setMidSnapPoint } from "@/store/features/cardSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

const BoothCard = () => {
const dispatch = useAppDispatch();

// set the mid snap point
  // TODO: should change based on if has food eateries
  useEffect(() => {
    dispatch(setMidSnapPoint(300));
    dispatch(setBottomSnapPoint(170));
  }, [dispatch]);

  return <BoothCarousel />;
};

export default BoothCard;
