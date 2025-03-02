import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import ZoomPanWrapper from '../zoom-pan/ZoomPanWrapper';

interface Props {
  floorCode: string;
}

const MainDisplay = ({ floorCode }: Props) => {
  useKeyboardShortcuts();

  return (
    <>
      <div className="fixed top-1/2 z-50 -translate-y-1/2">
        {/* <SidePanel floorCode={floorCode} /> */}
      </div>
      <ZoomPanWrapper floorCode={floorCode} />
      {/* {nodeIdSelected && (
        <div className="absolute top-28 right-4 z-50">
          <InfoDisplay floorCode={floorCode} />
        </div>
      )} */}
    </>
  );
};

export default MainDisplay;
