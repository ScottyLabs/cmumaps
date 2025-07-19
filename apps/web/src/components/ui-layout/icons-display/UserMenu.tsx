import signInIcon from "@/assets/icons/plus_button_menu/sign-in.svg";
import signOutIcon from "@/assets/icons/plus_button_menu/sign-out.svg";
import env from "@/env";
import useUser from "@/hooks/useUser";

interface MenuButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const UserMenu = () => {
  const { isSignedIn, user } = useUser();

  const renderUserProfile = () => {
    if (!isSignedIn || !user) {
      return (
        <div className="text-center font-semibold text-gray-800 text-sm">
          Not signed in
        </div>
      );
    }

    return (
      <div>
        <div className="font-semibold text-gray-800 text-sm">{user.name}</div>
        <div className="text-gray-500 text-sm">{user.email}</div>
      </div>
    );
  };

  const menuButtons: MenuButtonProps[] = isSignedIn
    ? [
        {
          icon: signOutIcon,
          label: "Sign Out",
          onClick: () => {
            window.location.href = `${env.VITE_LOGOUT_URL}`;
          },
        },
      ]
    : [
        {
          icon: signInIcon,
          label: "Sign In",
          onClick: () => {
            window.location.href = `${env.VITE_LOGIN_URL}?redirect_uri=${window.location.href}`;
          },
        },
      ];

  const renderMenuButton = (
    { icon, label, onClick }: MenuButtonProps,
    index: number,
  ) => {
    return (
      <div key={index}>
        <hr className="-mx-4 my-1 border-gray-200" />
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-2 rounded-md bg-white px-3 py-2 text-gray-700 text-sm active:bg-gray-100"
          onClick={onClick}
        >
          <img src={icon} alt="User Settings Button" width={24} height={24} />
          <span>{label}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="btn-shadow-dark fixed inset-x-5 bottom-77 z-50 rounded-lg border border-gray-200 bg-white px-4 pt-4 pb-1 font-sans shadow-lg">
      <div className="mb-4 flex items-center gap-3">{renderUserProfile()}</div>
      {menuButtons.map(renderMenuButton)}
    </div>
  );
};

export default UserMenu;
