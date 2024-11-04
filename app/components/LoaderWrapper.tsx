"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "./Loader"; // Adjust path if necessary

const LoaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true); // Start loading when pathname changes
    const timer = setTimeout(() => setLoading(false), 500); // Adjust timing as needed

    return () => clearTimeout(timer); // Clean up on unmount
  }, [pathname]);

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
};

export default LoaderWrapper;
