import type { Placement } from "@cmumaps/common";

interface Props {
  placement: Placement;
  setPlacement: (placement: Placement) => void;
}

const PlacementPanel = ({ placement, setPlacement }: Props) => {
  const renderScaleSlider = () => {
    return (
      <div className="w-48">
        <input
          type="range"
          min="0.05"
          max="5"
          step=".01"
          value={placement.scale}
          onChange={(e) =>
            setPlacement({
              ...placement,
              scale: Number.parseFloat(e.target.value),
            })
          }
          className="h-2 w-full cursor-pointer rounded-lg bg-blue-400"
        />
        <div className="text-center text-sm">Scale: {placement.scale}</div>
      </div>
    );
  };

  return (
    <div className="-translate-y-1/2 fixed top-1/2 z-50">
      <div className="h-[25em] w-fit rounded-lg border bg-slate-400 shadow-lg">
        <h1 className="pt-2 text-center text-xl underline">Placement</h1>
        {renderScaleSlider()}
      </div>
    </div>
  );
};

export default PlacementPanel;
