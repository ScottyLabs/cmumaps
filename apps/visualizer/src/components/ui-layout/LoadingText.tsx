import { FAILED_LOAD, LOADING } from "../../store/features/statusSlice";
import { useAppSelector } from "../../store/hooks";
import Loader from "../shared/Loader";

const LoadingText = () => {
  const loadingStatus = useAppSelector((state) => state.status.loadingStatus);
  const loadingText = useAppSelector((state) => state.status.loadingText);

  if (loadingStatus === LOADING) {
    return <Loader loadingText={loadingText} />;
  }

  if (loadingStatus === FAILED_LOAD) {
    return (
      <div className="-translate-x-1/2 absolute top-1/2 left-1/2">
        <p className="text-nowrap text-3xl text-red-500">{loadingText}</p>
      </div>
    );
  }
};

export default LoadingText;
