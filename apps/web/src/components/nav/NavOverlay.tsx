import useBoundStore from "@/store";
import NavCard from "./NavCard";

const NavOverlay = () => {
  const isNavOpen = useBoundStore((state) => state.isNavOpen);

  if (!isNavOpen) {
    return;
  }

  return <NavCard />;
};

export default NavOverlay;
