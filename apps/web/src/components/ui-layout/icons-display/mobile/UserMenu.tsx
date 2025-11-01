import { SignInButton, SignOutButton } from "@clerk/clerk-react";
import signInIcon from "@/assets/icons/plus_button_menu/sign-in.svg";
import signOutIcon from "@/assets/icons/plus_button_menu/sign-out.svg";
import useUser from "@/hooks/useUser";

interface MenuButtonProps {
  icon: string;
  label: string;
  type: "signIn" | "signOut" | "manageAccount";
}

const UserMenu = () => {
  const { isSignedIn, user, imageUrl } = useUser();

  const renderUserProfile = () => {
    if (!isSignedIn || !user) {
      return (
        <div className="text-center font-semibold text-gray-800 text-sm">
          Not signed in
        </div>
      );
    }

    return (
      <div className="flex gap-5">
        <img
          className="rounded-full"
          src={imageUrl}
          alt="User Profile"
          width={48}
          height={48}
        />
        <div>
          <div className="font-semibold text-[1.25em] text-gray-800">
            {user.name}
          </div>
          <div className="text-gray-500 text-sm">{user.email}</div>
        </div>
      </div>
    );
  };

  const menuButtons: MenuButtonProps[] = isSignedIn
    ? [
        {
          icon: signOutIcon,
          label: "Sign Out",
          type: "signOut",
        },
      ]
    : [
        {
          icon: signInIcon,
          label: "Sign In",
          type: "signIn",
        },
      ];

  const renderMenuButton = (
    { icon, label, type }: MenuButtonProps,
    index: number,
  ) => {
    const Cmp = type === "signIn" ? SignInButton : SignOutButton;
    return (
      <div key={index}>
        <hr className="-mx-4 my-1 border-gray-200" />
        <Cmp>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 rounded-md bg-white px-3 py-2 text-gray-700 text-sm active:bg-gray-100"
          >
            <img src={icon} alt="User Settings Button" width={24} height={24} />
            <span>{label}</span>
          </button>
        </Cmp>
      </div>
    );
  };

  return (
    <div className="btn-shadow-dark fixed inset-x-5 bottom-77 z-50 rounded-lg border border-gray-200 bg-white px-4 pt-5 pb-1 font-sans shadow-lg">
      <div className="mb-4 flex items-center gap-3">{renderUserProfile()}</div>
      {menuButtons.map(renderMenuButton)}
    </div>
  );
};

export default UserMenu;
