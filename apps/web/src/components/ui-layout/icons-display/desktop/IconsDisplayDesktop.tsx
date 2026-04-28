import { MdLogin, MdLogout } from "react-icons/md";
import { useUser } from "@/hooks/useUser.ts";
import { signIn, signOut } from "@/lib/authClient.ts";

const IconsDisplayDesktop = () => {
  const user = useUser();
  const Icon = user ? MdLogout : MdLogin;
  const label = user ? "Sign out" : "Sign in";

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="btn-shadow-dark fixed right-14 bottom-16 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-background-brand-primary-enabled text-white"
      onClick={user ? signOut : signIn}
    >
      <Icon size={28} />
    </button>
  );
};

export { IconsDisplayDesktop };
