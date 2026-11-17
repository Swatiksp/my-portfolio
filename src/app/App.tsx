import { RouterProvider } from "react-router";
import { router } from "./routes";
import { MobileNotice } from "./components/MobileNotice";

export default function App() {
  {/* MARKER-MAKE-KIT-INVOKED */}
  return (
    <>
      <RouterProvider router={router} />
      <MobileNotice />
    </>
  );
}
