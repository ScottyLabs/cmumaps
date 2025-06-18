import searchIcon from "@/assets/icons/search.svg";
import SearchResults from "@/components/toolbar/SearchResults";
import useAutofillSearchQuery from "@/hooks/useAutofillSearchQuery";
import useBoundStore from "@/store";
import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const Searchbar = ({ mapRef }: Props) => {
  // Hooks
  const navigate = useNavigate();

  // Global state
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);
  const showSearch = useBoundStore((state) => state.showSearch);
  const hideSearch = useBoundStore((state) => state.hideSearch);

  // Local state
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Custom Hook
  useAutofillSearchQuery(setSearchQuery);

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
      placeholder={"Search..."}
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
        setSearchQuery("");
        hideSearch();
        navigate("/");
      }}
    />
  );

  return (
    <>
      <div className="mb-2 flex w-full shrink-0 items-center overflow-hidden rounded bg-white">
        {renderSearchIcon()}
        {renderInput()}
        {(isSearchOpen || searchQuery.length > 0) && renderCloseButton()}
      </div>
      <SearchResults mapRef={mapRef} searchQuery={searchQuery} />
    </>
  );
};

export default Searchbar;
