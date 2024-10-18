"use client";

import LeftNavigation from "../components/LeftNavigation";
import styles from "../styles/ProgressPage.module.css"; // Importing custom styles

export default function ProgressPage() {
  // Handle generating report (you can link this to a real report generation feature)
//   const handleGenerateReport = () => {
//     alert("Generating your progress report...");
//   };

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
              <p className={styles.statValue}>0%</p>
              <p>0/10</p>
            </div>
            <div className={styles.statBlock}>
              <h3 className={styles.statTitle}>Points Earned</h3>
              <p className={styles.statValue}>0</p>
            </div>
            <div className={styles.statBlock}>
              <h3 className={styles.statTitle}>Badges Unlocked</h3>
              <p className={styles.statValue}>0</p>
            </div>
            <div className={styles.statBlock}>
              <h3 className={styles.statTitle}>Last Badge Earned</h3>
              <p className={`${styles.statValue} ${styles.noBadge}`}>No badges earned yet</p>
            </div>
          </div>

          {/* Emotional Feedback (No feedback available)
          <div className={styles.emotionalFeedback}>
            <h3 className={styles.statTitle}>Emotional Feedback</h3>
            <div className="flex justify-between">
              <p>Positive: <span className="text-gray-400">0%</span></p>
              <p>Neutral: <span className="text-gray-400">0%</span></p>
              <p>Negative: <span className="text-gray-400">0%</span></p>
            </div>
            <p className={`${styles.statContent} text-gray-400 mt-4 italic`}>
              No emotional feedback available yet. Complete some scenarios to gather insights.
            </p>
          </div>

        //   {/* Generate Report Button */}
        {/* //   <div className="flex justify-center">
        //     <button onClick={handleGenerateReport} className={styles.generateButton}>
        //       Generate Report
        //     </button> */}
        {/* //   </div> */} 
        </div>
      </div>
    </div>
  );
}
