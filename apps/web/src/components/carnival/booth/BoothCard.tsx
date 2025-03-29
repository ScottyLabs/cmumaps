import BoothCarousel from "@/components/carnival/booth/BoothCarousel";

const BoothCard = () => {
  return (
    <div className = "scroll-smooth max-h-screen overflow-y-auto">
      <p className = "m-5 font-medium text-sm">Booth is one of the biggest showpieces of Spring Carnival. 
        Student organizations build multi-story structures around our chosen theme, 
        such as last year's theme Arcade. These booths include interactive games 
        and elaborate decorations. The booths are located on Midway, at the College 
        of Fine Arts parking lot. Admission is free to see booths!
      </p>
      <BoothCarousel />
    </div>
  );
};

export default BoothCard;
