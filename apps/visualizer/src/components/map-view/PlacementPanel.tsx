import type { Placement } from "@cmumaps/common";

interface Props {
  placement: Placement;
  setPlacement: (placement: Placement) => void;
}

const PlacementPanel = ({ placement, setPlacement }: Props) => {
  const renderSliderAndInput = (
    label: string,
    min: number,
    max: number,
    step: number,
    value: number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  ) => {
    return (
      <div className="w-48">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="h-2 w-full cursor-pointer rounded-lg bg-blue-400"
        />
        <div className="text-center text-lg">
          {label}:{" "}
          <input
            className="w-fit"
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
    );
  };

  const renderScaleSlider = () => {
    return renderSliderAndInput("Scale", 0.05, 5, 0.01, placement.scale, (e) =>
      setPlacement({ ...placement, scale: Number.parseFloat(e.target.value) }),
    );
  };

  const renderAngleSlider = () => {
    return renderSliderAndInput("Angle", 0, 360, 0.01, placement.angle, (e) =>
      setPlacement({
        ...placement,
        angle: Number.parseFloat(e.target.value),
      }),
    );
  };

  return (
    <div className="-translate-y-1/2 fixed top-1/2 z-50">
      <div className="h-44 w-fit rounded-lg border bg-slate-400 shadow-lg">
        <h1 className="pt-2 text-center text-xl underline">Placement</h1>
        <div className="mt-2 flex flex-col gap-2 px-2">
          {renderScaleSlider()}
          {renderAngleSlider()}
        </div>
      </div>
    </div>
  );
};

export default PlacementPanel;
