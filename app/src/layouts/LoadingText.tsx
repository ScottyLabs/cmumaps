import Loader from '../components/shared/Loader';
import { useAppSelector } from '../store/hooks';
import { FAILED_LOAD, LOADED, LOADING } from '../store/slices/statusSlice';

const LoadingText = () => {
  const loadingStatus = useAppSelector((state) => state.status.loadingStatus);
  const loadingText = useAppSelector((state) => state.status.loadingText);

  if (loadingStatus === LOADED) {
    return;
  }

  if (loadingStatus === LOADING) {
    return <Loader loadingText={loadingText} />;
  }

  if (loadingStatus === FAILED_LOAD) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
        <p className="text-3xl text-nowrap text-red-500">{loadingText}</p>
      </div>
    );
  }
};

export default LoadingText;
