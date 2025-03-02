import { useParams } from 'react-router';

const FloorPage = () => {
  const { floorCode } = useParams();
  console.log('floorCode', floorCode);
  return <div>FloorPage</div>;
};

export default FloorPage;
