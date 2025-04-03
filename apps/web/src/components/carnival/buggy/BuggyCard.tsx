import { useEffect } from "react";

import InfoCardImage from "@/components/info-cards/shared/media/InfoCardImage";
import { setSnapPoints } from "@/store/features/cardSlice";
import { useAppDispatch } from "@/store/hooks";

const BuggyCard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSnapPoints([170, 350, screen.availHeight]));
  }, [dispatch]);

  return (
    <>
      <InfoCardImage
        url={"/imgs/carnival/buggy.png"}
        alt={"Spring Carnival Image"}
      />
      <p className="m-5 text-sm font-medium">
        Buggy, also known as Sweepstakes, is a competition where Greek and
        independent organizations race with their buggies, small, low,
        aerodynamic vehicles, powered only by gravity and human pushers. At its
        fastest, a buggy can reach speeds up to 35 miles per hour. And yes -
        there's a person in there! For more about Buggy and the complete
        schedule, check out the{" "}
        <a
          className="text-blue-500 underline"
          href="https://cmubuggy.org/"
          target="_blank"
          rel="noreferrer"
        >
          Buggy website
        </a>
        .
      </p>
    </>
  );
};

export default BuggyCard;
