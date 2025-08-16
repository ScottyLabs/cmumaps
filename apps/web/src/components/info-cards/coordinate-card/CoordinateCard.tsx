import ButtonsRow from "@/components/info-cards/shared/buttons-row/ButtonsRow";
import useLocationParams from "@/hooks/useLocationParams";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const CoordinateCard = ({ mapRef: _mapRef }: Props) => {
  const { coordinate } = useLocationParams();

  if (!coordinate) {
    return;
  }

  return (
    <>
      <h2 className="ml-3 pt-2">Coordinate Pin</h2>
      <ButtonsRow />
    </>
  );
};

export default CoordinateCard;
