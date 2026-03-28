import { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

interface Props {
  buildingCode: string;
  roomName: string;
}

function storageKey(buildingCode: string, roomName: string) {
  return `cmushits-rating:v1:${buildingCode}:${roomName}`;
}

const RATING_DIGIT_1_TO_5 = /^[1-5]$/u;

const RestroomStarRating = ({ buildingCode, roomName }: Props) => {
  const key = storageKey(buildingCode, roomName);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw && RATING_DIGIT_1_TO_5.test(raw)) {
      setRating(Number(raw));
    } else {
      setRating(0);
    }
  }, [key]);

  const setStars = (n: number) => {
    localStorage.setItem(key, String(n));
    setRating(n);
  };

  return (
    <fieldset className="mt-3 border-0 border-gray-200 border-t p-0 pt-3">
      <legend className="mb-2 px-0 font-medium text-gray-700 text-sm">
        Rate this restroom
      </legend>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className="rounded p-0.5 transition-opacity hover:opacity-80 active:opacity-60"
            aria-label={`${n} out of 5 stars`}
            onClick={() => setStars(n)}
          >
            {n <= rating ? (
              <FaStar className="text-amber-400 text-xl" aria-hidden={true} />
            ) : (
              <FaRegStar className="text-gray-400 text-xl" aria-hidden={true} />
            )}
          </button>
        ))}
      </div>
    </fieldset>
  );
};

export { RestroomStarRating };
