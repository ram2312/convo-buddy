// components/Loader.tsx
"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/GlobalLoader.module.css";

const Loader: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set the mounted state to true when the component mounts
    setIsMounted(true);

    // Clean up the mounted state when the component unmounts
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.center}>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
      </div>
    </div>
  );
};

export default Loader;
