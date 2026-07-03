import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer";

export default function Layout() {
  const { pathname } = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
