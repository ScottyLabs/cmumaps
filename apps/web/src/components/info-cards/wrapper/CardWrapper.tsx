import DraggableSheet from "@/components/info-cards/wrapper/DraggableSheet";
import useIsMobile from "@/hooks/useIsMobile";

interface CardWrapperProps {
  children: React.ReactElement;
}

const CardWrapper = ({ children }: CardWrapperProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DraggableSheet>{children}</DraggableSheet>;
  } else {
    return (
      <div className="flex w-96 flex-col overflow-hidden rounded-lg bg-white shadow-lg shadow-gray-400">
        {children}
      </div>
    );
  }
};

export default CardWrapper;
