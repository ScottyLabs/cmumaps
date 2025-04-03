import BoothCard from "@/components/carnival/booth/BoothCard";

interface Props {
  carnivalEvent: "booth" | "buggy" | "mobot";
}

const CarnivalCard = ({ carnivalEvent }: Props) => {
  if (carnivalEvent === "booth") {
    return <BoothCard />;
  } else if (carnivalEvent === "buggy") {
    return <></>;
  } else if (carnivalEvent === "mobot") {
    return <></>;
  }
};

export default CarnivalCard;
