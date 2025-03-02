// import { UserButton } from '@clerk/nextjs';
import React from 'react';

import Loader from './components/shared/Loader';
// import { CiSquarePlus } from 'react-icons/ci';
// import { toast } from 'react-toastify';

import { useGetBuildingCodesQuery } from './store/api/buildingsApiSlice';

// import MyToastContainer from '../components/shared/MyToastContainer';
// import { buildingCodeToName } from '../components/shared/buildings';
// import useErrorToast from '../hooks/useErrorToast';

const App: React.FC = () => {
  const {
    data: buildingCodes,
    isLoading,
    isError,
  } = useGetBuildingCodesQuery();

  if (!isLoading) {
    return <Loader loadingText="Fetching building codes" />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (!buildingCodes) {
    return <div>No data</div>;
  }

  // error toast

  const renderTopBar = () => (
    <div className="m-2 flex justify-between">
      {/* <Link href={'PDFUpload'}>
        <CiSquarePlus
          className="text-2xl text-blue-500 hover:text-blue-700"
          size={40}
        />
      </Link>
      <div>
        <UserButton />
      </div> */}
    </div>
  );

  const renderBuildingLinks = () => (
    <div className="m-5 flex flex-wrap gap-8">
      {buildingCodes.map((buildingCode) => (
        <button
          key={buildingCode}
          className="cursor-pointer rounded-lg border border-gray-300 p-4 shadow-md transition duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
        >
          {buildingCode}
        </button>
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

export default App;
