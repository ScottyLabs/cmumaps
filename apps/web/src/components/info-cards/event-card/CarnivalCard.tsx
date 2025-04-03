import BoothCard from "@/components/carnival/booth/BoothCard";
import BuggyCard from "@/components/carnival/buggy/BuggyCard";

interface Props {
  carnivalEvent: "booth" | "buggy" | "mobot";
}

const CarnivalCard = ({ carnivalEvent }: Props) => {
  if (carnivalEvent === "booth") {
    return <BoothCard />;
  } else if (carnivalEvent === "buggy") {
    return <BuggyCard />;
  } else if (carnivalEvent === "mobot") {
    return <></>;
  }
};

export default CarnivalCard;
