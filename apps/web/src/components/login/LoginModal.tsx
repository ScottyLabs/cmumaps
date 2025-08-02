import { useEffect } from "react";
import env from "@/env";
import useUser from "@/hooks/useUser";
import useBoundStore from "@/store";

const LoginModal = () => {
  const { isSignedIn, hasAccess } = useUser();
  const isLoginOpen = useBoundStore((state) => state.isLoginOpen);
  const hideLogin = useBoundStore((state) => state.hideLogin);

  // Should try to show the login modal again if the user signed out
  useEffect(() => {
    if (!isSignedIn) {
      sessionStorage.removeItem("showedLogin");
    }
  }, [isSignedIn]);

  // Don't show the login modal if the user is signed in with CMU email
  if (!isLoginOpen || hasAccess) {
    return null;
  }

  // TODO: display message differently if the user is signed in but not with CMU email
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-4">
        <h2 className="font-bold text-2xl text-black">CMU Maps</h2>
        <p className="text-gray-500 text-sm">
          CMU Maps is built with ❤️ by ScottyLabs. Find out more about us{" "}
          <a href="https://www.scottylabs.org/" className="underline">
            here
          </a>
          . Your feedback is appreciated.
        </p>
        <p className="text-sm">Log in to see floor plans.</p>

        <div className="flex justify-between">
          <button
            type="button"
            className="w-fit cursor-pointer rounded-md bg-blue-100 p-2 text-blue-400 text-sm hover:bg-blue-200"
            onClick={() => {
              window.location.href = `${env.VITE_LOGIN_URL}?redirect_uri=${window.location.href}`;
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md bg-red-200 p-2 text-red-700 text-sm hover:bg-red-300"
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
