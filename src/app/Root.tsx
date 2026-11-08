import { Outlet, ScrollRestoration } from "react-router";

export function Root() {
  return (
    <>
      <Outlet />
      {/* Opens each page at the top, and restores the scroll position when going back to the homepage. */}
      <ScrollRestoration />
    </>
  );
}
