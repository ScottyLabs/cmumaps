import searchIcon from "@icons/search.svg";

import { useRef, useState, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router";

import useAutofillSearchQuery from "@/hooks/useAutofillSearchQuery";
import { setIsSearchOpen } from "@/store/features/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const SearchInput = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);
  const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);
  const [searchQuery, setSearchQuery] = useState("");

  // useAutofillSearchQuery();

  // blur the input field when not searching (mainly used for clicking on the map to close search)
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
          dispatch(setIsSearchOpen(true));
          inputRef.current.focus();
          event.preventDefault();
        }

        // close search if escape is pressed
        if (event.key === "Escape") {
          dispatch(setIsSearchOpen(false));
          navigate("/");
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dispatch, navigate]);

  const renderCloseButton = () => (
    <IoIosClose
      title="Close"
      size={25}
      className="absolute right-3"
      onClick={() => {
        dispatch(setIsSearchOpen(false));
        navigate("/");
      }}
    />
  );

  return (
    <div className="flex w-full items-center rounded bg-white p-1">
      <img
        alt="Search Icon"
        src={searchIcon}
        className="ml-4 size-4.5 opacity-60 invert"
        width={20}
      />

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
          dispatch(setIsSearchOpen(true));
        }}
      />

      {(isSearchOpen || searchQuery.length > 0) && renderCloseButton()}
    </div>
  );
};

export default SearchInput;
