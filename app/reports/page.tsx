"use client";

import { useEffect, useState } from "react";
import LeftNavigation from "../components/LeftNavigation";
import styles from "../styles/ReportsPage.module.css";

const TOTAL_SCENARIOS = 4; // Total number of scenarios available
const POINTS_PER_SCENARIO = 250; // Points awarded per scenario

export default function ReportsPage() {
  const [scenariosCompleted, setScenariosCompleted] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [badgesUnlocked, setBadgesUnlocked] = useState(0);
  const [lastBadgeEarned, setLastBadgeEarned] = useState("No badges earned yet");

  // Fetch progress data from the backend
  useEffect(() => {
    const fetchProgressData = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        alert("No user found. Redirecting to login.");
        window.location.href = "/auth/login";
        return;
      }

      try {
        const response = await fetch(`/api/progress?email=${email}`);
        const data = await response.json();

        if (response.ok) {
          // Update state based on fetched data
          setScenariosCompleted(data.scenariosCompleted);
          setCompletionPercentage(
            Math.round((data.scenariosCompleted / TOTAL_SCENARIOS) * 100)
          );
          setPointsEarned(data.scenariosCompleted * POINTS_PER_SCENARIO);

          // Determine badges based on completed scenarios
          if (data.scenariosCompleted === 0) {
            setBadgesUnlocked(0);
            setLastBadgeEarned("No badges earned yet");
          } else if (data.scenariosCompleted === 1) {
            setBadgesUnlocked(1);
            setLastBadgeEarned("Beginner");
          } else if (data.scenariosCompleted === 2 || data.scenariosCompleted === 3) {
            setBadgesUnlocked(2);
            setLastBadgeEarned("Intermediate");
          } else if (data.scenariosCompleted >= 4) {
            setBadgesUnlocked(3);
            setLastBadgeEarned("Advanced");
          }
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
        alert("Error fetching progress data. Please try again later.");
      }
    };

    fetchProgressData();
  }, []);

  // Handle report generation (triggers print)
  const handleGenerateReport = () => {
    window.print();
  };

  return (
    <div className={`${styles.pageContainer} flex`}>
      <LeftNavigation />

      {/* Main content */}
      <div className="ml-64 p-6 w-full flex justify-center items-center h-screen">
        <div className="max-w-5xl w-full">
          {/* Progress Overview Heading */}
          <h1 className={styles.pageTitle}>Progress Overview</h1>

          {/* Stats Grid */}
          <div className={`${styles.gridContainer} grid grid-cols-2 md:grid-cols-4 gap-6`}>
            <div className={styles.statBlock}>
              <h3 className={styles.statTitle}>Scenarios Completed</h3>
              <p className={styles.statValue}>{completionPercentage}%</p>
              <p>{scenariosCompleted}/{TOTAL_SCENARIOS}</p>
            </div>

            <div className={styles.statBlock}>
              <h3 className={styles.statTitle}>Points Earned</h3>
              <p className={styles.statValue}>{pointsEarned}</p>
            </div>

            <div className={styles.statBlock}>
              <h3 className={styles.statTitle}>Badges Unlocked</h3>
              <p className={styles.statValue}>{badgesUnlocked}</p>
            </div>

            <div className={styles.statBlock}>
              <h3 className={styles.statTitle}>Last Badge Earned</h3>
              <p className={styles.statValue}>{lastBadgeEarned}</p>
            </div>
          </div>

          {/* Generate Report Button */}
          <div className="flex justify-center">
            <button onClick={handleGenerateReport} className={styles.generateButton}>
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
