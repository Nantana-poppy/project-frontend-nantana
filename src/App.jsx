import { RouterProvider } from "react-router";
import router from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" style={{ zIndex: 9999 }}/>
    </>
  );
}
export default App;
