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
      <div className="flex w-full items-center gap-2">
        {label}:{" "}
        <input
          className="w-fit cursor-pointer rounded-lg bg-blue-200 px-1"
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="h-2 w-full cursor-pointer justify-center rounded-lg"
        />
      </div>
    );
  };

  const renderScaleControl = () => {
    return renderSliderAndInput("Scale", 0.05, 5, 0.01, placement.scale, (e) =>
      setPlacement({ ...placement, scale: Number.parseFloat(e.target.value) }),
    );
  };

  const renderAngleControl = () => {
    return renderSliderAndInput("Angle", 0, 360, 0.01, placement.angle, (e) =>
      setPlacement({
        ...placement,
        angle: Number.parseFloat(e.target.value),
      }),
    );
  };

  const renderCenterControl = () => {
    const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlacement({
        ...placement,
        geoCenter: {
          latitude: Number.parseFloat(e.target.value),
          longitude: placement.geoCenter.longitude,
        },
      });
    };

    const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlacement({
        ...placement,
        geoCenter: {
          latitude: placement.geoCenter.latitude,
          longitude: Number.parseFloat(e.target.value),
        },
      });
    };

    const renderInput = (
      label: string,
      value: number,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    ) => {
      return (
        <div>
          {label}:{" "}
          <input
            type="number"
            step={0.000001}
            value={value}
            onChange={onChange}
            className="cursor-pointer rounded-lg bg-blue-200 px-1"
          />
        </div>
      );
    };

    return (
      <>
        {renderInput(
          "Latitude",
          placement.geoCenter.latitude,
          handleLatitudeChange,
        )}
        {renderInput(
          "Longitude",
          placement.geoCenter.longitude,
          handleLongitudeChange,
        )}
      </>
    );
  };

  const renderConfirmButton = () => {
    return (
      <button
        type="button"
        className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-base text-white"
        onClick={() => {
          console.log("Confirm Placement");
        }}
      >
        Confirm Placement
      </button>
    );
  };

  return (
    <div className="-translate-y-1/2 fixed top-1/2 z-50">
      <div className="h-66 w-fit rounded-lg border bg-slate-400 shadow-lg">
        <h1 className="pt-2 text-center text-xl underline">Placement</h1>
        <div className="mt-3 flex flex-col gap-3 px-2 text-lg">
          {renderScaleControl()}
          {renderAngleControl()}
          {renderCenterControl()}
          {renderConfirmButton()}
        </div>
      </div>
    </div>
  );
};

export default PlacementPanel;
