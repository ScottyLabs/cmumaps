import { SignInButton, SignOutButton } from "@clerk/clerk-react";
import scottylabsBackground from "@/assets/images/scottylabs-background.png";
import { useUser } from "@/hooks/useUser.ts";

const UserMenu = () => {
  const { isSignedIn, email } = useUser();

  return (
    <div className="btn-shadow-dark fixed top-20 right-5 z-50 flex cursor-default flex-col rounded-lg bg-white">
      <img
        className="rounded-t-lg"
        src={scottylabsBackground}
        alt="Scottylabs Background"
        width={300}
      />
      <div className="px-5 pt-3">ScottyLabs Sign In</div>
      <div className="px-5 text-[0.75rem] text-dark-grey">
        {isSignedIn
          ? `Signed in as ${email}`
          : "Sign in with your @andrew.cmu.edu email"}
      </div>
      {isSignedIn ? (
        <SignOutButton>
          <button
            type="button"
            className="mx-5 mt-3 mb-3 flex w-fit cursor-pointer items-center rounded-full bg-black px-3 py-1 text-sm text-white"
          >
            Sign Out
          </button>
        </SignOutButton>
      ) : (
        <SignInButton mode="redirect">
          <button
            type="button"
            className="mx-5 mt-3 mb-3 flex w-fit cursor-pointer items-center rounded-full bg-black px-3 py-1 text-sm text-white"
          >
            Sign in
          </button>
        </SignInButton>
      )}
    </div>
  );
};

export { UserMenu };
