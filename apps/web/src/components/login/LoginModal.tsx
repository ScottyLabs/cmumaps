import { useAppSelector } from "@/store/hooks";

const LoginModal = () => {
  const showLogin = useAppSelector((state) => state.ui.showLogin);
  console.log(showLogin);

  if (!showLogin) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-4">
        <h2 className="text-2xl font-bold">Login</h2>
      </div>
    </div>
  );
};

export default LoginModal;
