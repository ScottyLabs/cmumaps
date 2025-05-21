import { SignInButton, useUser } from "@clerk/clerk-react";

import { useEffect } from "react";

import useBoundStore from "@/store";

const LoginModal = () => {
  const { isSignedIn } = useUser();
  const isLoginOpen = useBoundStore((state) => state.isLoginOpen);
  const hideLogin = useBoundStore((state) => state.hideLogin);

  // If the user signed out, should try to show the login modal again
  useEffect(() => {
    if (!isSignedIn) {
      sessionStorage.removeItem("showedLogin");
    }
  }, [isSignedIn]);

  // If the user is signed in, don't show the login modal
  if (!isLoginOpen || isSignedIn) {
    return null;
  }

  // TODO: Improve UI
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-4">
        <h2 className="text-2xl font-bold text-black">CMU Maps</h2>
        <p className="text-sm text-gray-500">
          CMU Maps is built with ❤️ by ScottyLabs. Find out more about us{" "}
          <a href="https://www.scottylabs.org/" className="underline">
            here
          </a>
          . Your feedback is appreciated.
        </p>
        <p className="text-sm">Log in to see floor plans.</p>

        <div className="flex justify-between">
          <span className="w-fit cursor-pointer rounded-md bg-blue-100 p-2 text-sm text-blue-400 hover:bg-blue-200">
            <SignInButton />
          </span>
          <button
            className="cursor-pointer rounded-md bg-red-200 p-2 text-sm text-red-700 hover:bg-red-300"
            onClick={() => hideLogin()}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
