import { Outlet } from "react-router";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Outlet />
      <Toaster position='top-center' richColors={false} duration={2000} />
    </>
  );
};

export default App;
