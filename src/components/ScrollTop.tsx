import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// scroll to top when navigating between pages
export default function ScrollTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
