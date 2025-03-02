import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';

import { NavLink } from 'react-router';

import ErrorDisplay from '../components/shared/ErrorDisplay';
import Loader from '../components/shared/Loader';
// import { toast } from 'react-toastify';

import { useGetBuildingCodesAndNamesQuery } from '../store/api/buildingsApiSlice';

// import MyToastContainer from '../components/shared/MyToastContainer';
// import useErrorToast from '../hooks/useErrorToast';

const Home = () => {
  const {
    data: buildingCodesAndNames,
    isLoading,
    isError,
  } = useGetBuildingCodesAndNamesQuery();

  if (isLoading) {
    return <Loader loadingText="Fetching building codes" />;
  }

  if (isError || !buildingCodesAndNames) {
    return <ErrorDisplay errorText="Failed to fetch building codes" />;
  }

  const renderTopBar = () => (
    <div className="m-2 flex justify-between">
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </div>
  );

  const renderBuildingLinks = () => (
    <div className="m-5 flex flex-wrap gap-8">
      {buildingCodesAndNames.map(({ buildingCode, name }) => (
        <NavLink
          to={`/${buildingCode}`}
          key={buildingCode}
          className="cursor-pointer rounded-lg border border-gray-300 p-4 shadow-md transition duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
        >
          {name}
        </NavLink>
      ))}
    </div>
  );

  return (
    <div>
      {renderTopBar()}
      {renderBuildingLinks()}
      {/* <MyToastContainer /> */}
    </div>
  );
};

export default Home;
