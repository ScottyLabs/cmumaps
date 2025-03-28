import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count === 0) {
      setCount(1);
    }
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello World</h1>
    </>
  );
}

export default App;
