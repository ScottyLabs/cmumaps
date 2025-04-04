import booths from "@/assets/carnival/json/booth.json";
import useIsMobile from "@/hooks/useIsMobile";
import { CardStates } from "@/store/features/cardSlice";
import { useAppSelector } from "@/store/hooks";

const BoothCarousel = () => {
  const isMobile = useIsMobile();
  const cardStatus = useAppSelector((state) => state.card.cardStatus);

  if (Object.keys(booths).length === 0) {
    return <></>;
  }

  if (isMobile && cardStatus !== CardStates.EXPANDED) {
    return <></>;
  }

  const renderBooths = () => {
    return (
      <div className="space-y-3">
        {Object.entries(booths).map(([boothName, booth]) => (
          <div
            key={boothName}
            className="rounded-lg border border-gray-200 bg-white p-2 shadow"
          >
            <div className="mb-1 ml-2">
              <h3 className="text-lg font-semibold">{boothName}</h3>
              <div className="text-sm font-medium text-black">
                <p>Theme: {booth.theme}</p>
                <div className="mt-1.5 block font-normal">
                  <div className="flex gap-2">
                    <div className="rounded-3xl bg-red-100 p-1 pr-3 pl-3 font-medium text-red-500">
                      {booth.orgType}
                    </div>
                    <div className="rounded-3xl bg-green-100 p-1 pr-3 pl-3 font-medium text-green-700">
                      {booth.boothType}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h3 className="mb-2 font-bold">All Booths</h3>
      {renderBooths()}
    </div>
  );
};

export default BoothCarousel;
