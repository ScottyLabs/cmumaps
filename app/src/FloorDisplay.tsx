import { useParams } from 'react-router';

const FloorDisplay = () => {
  const { floorCode } = useParams();
  console.log(floorCode);

  return <div>FloorDisplay</div>;
};

export default FloorDisplay;
