const Banner = () => {
  const link = (
    <a
      className="underline"
      href="https://docs.google.com/forms/d/e/1FAIpQLSd6mXSOzxxUctc0EeQBTanqebc31xmBnKb_cFRosqHjtmuemg/viewform"
    >
      Register
    </a>
  );
  (" ");

  return (
    <div className="absolute top-0 right-0 left-0 z-50 bg-primary-blue px-4 py-2 text-center text-white">
      <h1 className="font-bold text-xl">
        <div className="hidden sm:block">
          {link} for NOVA, Scottylabs' GenAI Hackathon by Nov. 1st!
        </div>
        <div className="block sm:hidden">{link} for NOVA by Nov. 1st!</div>
      </h1>
    </div>
  );
};

export default Banner;
