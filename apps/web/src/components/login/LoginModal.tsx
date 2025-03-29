import { SignInButton, useUser } from "@clerk/clerk-react";

import { hideLogin } from "@/store/features/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const LoginModal = () => {
  const dispatch = useAppDispatch();

  const { isSignedIn } = useUser();
  const showLogin = useAppSelector((state) => state.ui.showLogin);

  // If the user is signed in, don't show the login modal
  if (!showLogin || isSignedIn) {
    return null;
  }

  // TODO: Improve UI
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-4">
        <h2 className="text-2xl font-bold">
          Login in with CMU email to access floor plans
        </h2>

        <div className="flex justify-between">
          <span className="w-fit cursor-pointer rounded-md bg-blue-500 p-2 text-white">
            <SignInButton />
          </span>
          <button
            className="cursor-pointer rounded-md bg-blue-500 p-2 text-white"
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
