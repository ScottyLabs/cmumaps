import { SignInButton, useUser } from "@clerk/clerk-react";

import { useEffect } from "react";

import { hideLogin } from "@/store/features/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const LoginModal = () => {
  const dispatch = useAppDispatch();

  const { isSignedIn } = useUser();
  const showLogin = useAppSelector((state) => state.ui.showLogin);

  // If the user signed out, should try to show the login modal again
  useEffect(() => {
    if (!isSignedIn) {
      sessionStorage.removeItem("showedLogin");
    }
  }, [isSignedIn]);

  // If the user is signed in, don't show the login modal
  if (!showLogin || isSignedIn) {
    return null;
  }

  // TODO: Improve UI
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-4">
        <h2 className="text-2xl font-bold text-black">
          CMU Maps
        </h2>
        <p className = "text-sm text-gray-500">CMU Maps is built and maintained by ScottyLabs. Find out more about us <a href = "https://www.scottylabs.org/" className="underline">here</a>. 
        Your feedback is appreciated.</p>
        <p className = "text-sm">You are currently logged out.</p>

        <div className="flex justify-between">
          <span className="text-sm w-fit cursor-pointer rounded-md bg-blue-100 p-2 text-blue-400 hover:bg-blue-200">
            <SignInButton />
          </span>
          <button
            className="text-sm cursor-pointer rounded-md bg-red-200 p-2 text-red-700 hover:bg-red-300"
            onClick={() => dispatch(hideLogin())}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
