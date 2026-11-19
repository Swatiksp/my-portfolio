import { RouterProvider } from "react-router";
import { router } from "./routes";
import { MobileNotice } from "./components/MobileNotice";

// While the mobile version is being built the notice is switched off, so phones see the real site.
// Set this back to true to show the "still being constructed" notice again.
const SHOW_MOBILE_NOTICE = false;

export default function App() {
  {/* MARKER-MAKE-KIT-INVOKED */}
  return (
    <>
      <RouterProvider router={router} />
      {SHOW_MOBILE_NOTICE && <MobileNotice />}
    </>
  );
}
