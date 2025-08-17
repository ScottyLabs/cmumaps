import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import searchIcon from "@/assets/icons/search.svg";
import SearchResults from "@/components/toolbar/SearchResults";
import useAutofillSearchQuery from "@/hooks/useAutofillSearchQuery";
import useNavigateLocationParams from "@/hooks/useNavigateLocationParams";
import useNavigationParams from "@/hooks/useNavigationParams";
import useBoundStore from "@/store";
import type { SearchTarget } from "@/types/searchTypes";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const Searchbar = ({ mapRef }: Props) => {
  // Hooks
  const navigate = useNavigateLocationParams();

  const searchTargetText: Record<SearchTarget, string> = {
    "nav-src": "Search for Starting Location",
    "nav-dst": "Search for Destination",
  };

  // Global state
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);
  const showSearch = useBoundStore((state) => state.showSearch);
  const hideSearch = useBoundStore((state) => state.hideSearch);
  const searchTarget = useBoundStore((state) => state.searchTarget);
  const setSearchTarget = useBoundStore((state) => state.setSearchTarget);
  const isNavigating = useBoundStore((state) => state.isNavigating);

  // Local state
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Custom Hook
  useAutofillSearchQuery(setSearchQuery);
  const { isNavOpen } = useNavigationParams();

  // Blur the input field when not searching (mainly used for clicking on the map to close search)
  useEffect(() => {
    if (!isSearchOpen) {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  }, [isSearchOpen]);

  // keydown event listener
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (inputRef.current) {
        // focus on the input if command f is pressed
        if ((event.metaKey || event.ctrlKey) && event.key === "f") {
          showSearch();
          inputRef.current.focus();
          event.preventDefault();
        }

        // close search if escape is pressed
        if (event.key === "Escape") {
          hideSearch();
          navigate("/");
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, hideSearch, showSearch]);

  useEffect(() => {
    if (searchTarget) {
      inputRef.current?.focus();
      setSearchQuery("");
    }
  }, [searchTarget]);

  useEffect(() => {
    if (!isNavOpen) {
      setSearchTarget(undefined);
    }
  }, [isNavOpen, setSearchTarget]);

  // Hide searchbar if navigating, unless selecting a destination or source
  if (
    (isNavOpen && searchTarget !== "nav-dst" && searchTarget !== "nav-src") ||
    isNavigating
  ) {
    return;
  }

  const renderSearchIcon = () => (
    <img
      alt="Search Icon"
      src={searchIcon}
      className="ml-4 size-4.5 opacity-60 invert"
      width={20}
    />
  );

  const renderInput = () => (
    <input
      type="text"
      className="w-full rounded p-2 pr-6 outline-none"
      placeholder={searchTarget ? searchTargetText[searchTarget] : "Search..."}
      ref={inputRef}
      value={searchQuery}
      onChange={(event) => {
        setSearchQuery(event.target.value);
      }}
      title="Search query"
      onFocus={() => {
        showSearch();
      }}
    />
  );

  const renderCloseButton = () => (
    <IoIosClose
      title="Close"
      size={25}
      className="absolute right-3"
      onClick={() => {
        if (searchQuery === "") {
          setSearchTarget(undefined);
        }
        setSearchQuery("");
        hideSearch();
        navigate("/");
      }}
    />
  );

  return (
    <>
      <div className="z-50 mb-2 flex w-full shrink-0 items-center overflow-hidden rounded bg-white">
        {renderSearchIcon()}
        {renderInput()}
        {(isSearchOpen || searchQuery.length > 0) && renderCloseButton()}
      </div>
      <SearchResults mapRef={mapRef} searchQuery={searchQuery} />
    </>
  );
};

export default Searchbar;
