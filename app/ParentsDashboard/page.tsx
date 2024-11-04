"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LeftNavigation from "../components/LeftNavigation";
import styles from "../styles/ParentsDashboard.module.css";

const ParentsDashboard: React.FC = () => {
  const router = useRouter();
  const [isParentRestrictionEnabled, setIsParentRestrictionEnabled] = useState(false);

  const toggleParentRestrictionMode = () => {
    const newRestrictionMode = !isParentRestrictionEnabled;
    setIsParentRestrictionEnabled(newRestrictionMode);
    alert(`Parent Restriction Mode is now ${newRestrictionMode ? "enabled" : "disabled"}.`);
  };

  return (
    <div className={styles.pageContainer}>
      {!isParentRestrictionEnabled && <LeftNavigation />}

      <div className={`${styles.dashboardContent} ${!isParentRestrictionEnabled ? styles.withNav : ""}`}>
        <h1 className={styles.pageTitle}>Parent Mode - Overview</h1>

        {/* Progress Overview */}
        <div className={styles.progressContainer}>
          <div className={styles.progressCard}>
            <h3 className={styles.progressTitle}>Scenarios Completed</h3>
            <p className={styles.progressValue}>100%</p>
            <p className={styles.progressDetails}>4/4</p>
          </div>
          <div className={styles.progressCard}>
            <h3 className={styles.progressTitle}>Points Earned</h3>
            <p className={styles.progressValue}>1000</p>
          </div>
        </div>

        {/* Tips Section */}
        <div className={styles.tipsContainer}>
          <h2 className={styles.tipsTitle}>Tips for Effective Use</h2>
          {isParentRestrictionEnabled ? (
            <div>
              <p className={styles.tipsText}>
                You are currently in restricted mode. Some actions and details are hidden for privacy.
              </p>
              <p className={styles.tipsText}>
                To gain full access to detailed progress information, please disable the Parent Restriction Mode.
              </p>
              <ul className={styles.tipsList}>
                <li className={styles.tipsListItem}>Restricted access ensures a safe and controlled environment for monitoring progress.</li>
                <li className={styles.tipsListItem}>Only essential actions are available in this mode.</li>
              </ul>
            </div>
          ) : (
            <div>
              <h3 className={styles.tipsTitle}>1. How to Use ConvoBuddy</h3>
              <p className={styles.tipsText}>
                ConvoBuddy is designed to help users improve communication skills through various scenarios.
              </p>
              <h3 className={styles.tipsTitle}>2. Benefits of Regular Practice</h3>
              <p className={styles.tipsText}>
                Consistent practice helps reinforce skills and build confidence.
              </p>
              <h3 className={styles.tipsTitle}>3. Parent Tips for Extra Efficiency</h3>
              <ul className={styles.tipsList}>
                <li className={styles.tipsListItem}>Review progress periodically to identify areas of improvement.</li>
                <li className={styles.tipsListItem}>Encourage open discussions about scenarios.</li>
                <li className={styles.tipsListItem}>Celebrate achievements when badges are unlocked.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Parent Restriction Mode Toggle */}
        <button
          onClick={toggleParentRestrictionMode}
          className={styles.toggleButton}
        >
          {isParentRestrictionEnabled ? "Disable Parent Restriction Mode" : "Enable Parent Restriction Mode"}
        </button>

        {/* Exit Parent Mode Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className={`${styles.exitButton} ${isParentRestrictionEnabled ? styles.disabled : ""}`}
          disabled={isParentRestrictionEnabled}
        >
          Exit Parent Mode
        </button>

        {/* Note about Parent Mode */}
        <p className={styles.note}>
          Detailed progress data is hidden in Parent Mode. For more information, switch back to normal mode.
        </p>
      </div>
    </div>
  );
};

export default ParentsDashboard;
