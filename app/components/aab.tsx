// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import LeftNavigation from "../components/LeftNavigation";
import { useRouter } from "next/navigation";
import styles from "../styles/Dashboard.module.css";

const TOTAL_SCENARIOS = 4; // Total number of scenarios available
const POINTS_PER_SCENARIO = 250; // Points awarded per scenario
const RESTRICTED_PAGES = ["/Conversation", "/Reports"]; // Define restricted pages for Parent Restriction Mode

export default function Dashboard() {
  const router = useRouter();
  const [scenariosCompleted, setScenariosCompleted] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [badgesUnlocked, setBadgesUnlocked] = useState(0);
  const [lastBadgeEarned, setLastBadgeEarned] = useState("No badges earned yet");
  const [isParentMode, setIsParentMode] = useState(false);
  const [isParentRestrictionEnabled, setIsParentRestrictionEnabled] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Fetch user data including role from local storage or an API
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
          setScenariosCompleted(data.scenariosCompleted);
          setCompletionPercentage(
            Math.round((data.scenariosCompleted / TOTAL_SCENARIOS) * 100)
          );
          setPointsEarned(data.scenariosCompleted * POINTS_PER_SCENARIO);
          setUserRole(data.role); // Set user role in state

          if (data.scenariosCompleted === 1) {
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

  // Handlers for the navigation buttons
  const handleSelectScenario = () => {
    if (isParentRestrictionEnabled && RESTRICTED_PAGES.includes("/select_scenario")) {
      alert("Access restricted by Parent Mode.");
    } else {
      router.push("/select_scenario");
    }
  };

  const handleCustomScenario = () => {
    if (isParentRestrictionEnabled && RESTRICTED_PAGES.includes("/Conversation")) {
      alert("Access restricted by Parent Mode.");
    } else {
      router.push("/Conversation");
    }
  };

  // Toggle Parent Mode
  const toggleParentMode = () => {
    setIsParentMode((prevMode) => !prevMode);
  };

  // Toggle Parent Restriction Mode
  const toggleParentRestrictionMode = () => {
    const newRestrictionMode = !isParentRestrictionEnabled;
    setIsParentRestrictionEnabled(newRestrictionMode);
    if (newRestrictionMode) {
      alert("Parent Restriction Mode is now enabled. Side navigation is hidden, and some pages are restricted.");
    }
  };

  return (
    <div className="dashboard-page flex" style={{ backgroundColor: '#DADADA', minHeight: '100vh' }}>
      {/* Conditionally render the LeftNavigation component */}
      {!isParentRestrictionEnabled && <LeftNavigation />}

      {/* Main content */}
      <div className={`p-6 w-full flex flex-col items-center h-screen ${isParentRestrictionEnabled ? "" : "ml-64"}`}>
        {/* Toggle for Parent Mode (only show if role is Parent) */}
        {userRole === "Parent" && (
          <div className="w-full flex justify-end pr-6">
            <button 
              onClick={toggleParentMode} 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mb-4 hover:bg-gray-300 transition-all"
            >
              {isParentMode ? "Exit Parent Mode" : "Enter Parent Mode"}
            </button>
          </div>
        )}

        <div className="flex w-full max-w-7xl space-x-8">
          {scenariosCompleted === 0 ? (
            <div className="flex flex-col items-center space-y-6 w-full bg-white p-8 shadow-lg rounded-lg">
              <h1 className="text-4xl font-bold text-center" style={{ color: '#3C3C3C' }}>
                Welcome to ConvoBuddy!
              </h1>
              <p className="text-center" style={{ color: '#131313', fontSize: '24px' }}>
                Start by selecting a scenario to practice your skills, or jump into a conversation.
                You can track your status, and your progress will be displayed once you’ve started at least one scenario.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleSelectScenario}
                  className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-all"
                  style={{ fontSize: '24px', fontWeight: '600' }}
                >
                  Select Scenario
                </button>
                <button
                  onClick={handleCustomScenario}
                  className="bg-[#CDDB28] text-white py-2 px-6 rounded-md hover:bg-purple-700 transition-all"
                  style={{ fontSize: '24px', fontWeight: '600' }}
                >
                  Select Custom Scenario
                </button>
              </div>
            </div>
          ) : isParentMode ? (
            // Parent Mode View with Restriction Mode Toggle
            <div className="flex flex-col items-center space-y-4 w-full">
              <h1 className={styles.pageTitle}>Parent Mode - Overview</h1>
              
              {/* Progress Overview */}
              <div className={`${styles.gridContainer} grid grid-cols-1 md:grid-cols-2 gap-6`}>
                <div className={styles.statBlock}>
                  <h3 className={styles.statTitle}>Scenarios Completed</h3>
                  <p className={styles.statValue}>{completionPercentage}%</p>
                  <p>{scenariosCompleted}/{TOTAL_SCENARIOS}</p>
                </div>
                <div className={styles.statBlock}>
                  <h3 className={styles.statTitle}>Points Earned</h3>
                  <p className={styles.statValue}>{pointsEarned}</p>
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-2xl mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Tips for Effective Use</h2>
                <h3 className="text-lg font-medium text-gray-700">1. How to Use ConvoBuddy</h3>
                <p className="text-gray-600 mb-4">
                  ConvoBuddy is designed to help users improve communication skills through various scenarios.
                </p>
                <h3 className="text-lg font-medium text-gray-700">2. Benefits of Regular Practice</h3>
                <p className="text-gray-600 mb-4">
                  Consistent practice helps reinforce skills and build confidence.
                </p>
                <h3 className="text-lg font-medium text-gray-700">3. Parent Tips for Extra Efficiency</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Review progress periodically to identify areas of improvement.</li>
                  <li>Encourage open discussions about scenarios.</li>
                  <li>Celebrate achievements when badges are unlocked.</li>
                </ul>
              </div>

              {/* Parent Restriction Mode Toggle */}
              <button
                onClick={toggleParentRestrictionMode}
                className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-all mt-6"
                style={{ fontSize: '18px', fontWeight: '600' }}
              >
                {isParentRestrictionEnabled ? "Disable Parent Restriction Mode" : "Enable Parent Restriction Mode"}
              </button>
              
              {/* Note about Parent Mode */}
              <p className="text-center mt-4" style={{ fontSize: '18px', color: '#888' }}>
                Detailed progress data is hidden in Parent Mode. For more information, switch back to normal mode.
              </p>
            </div>
          ) : (
            // Full Progress View for Normal Mode
            <div className="flex w-full space-x-8">
              <div className="flex flex-col space-y-4 w-2/3">
                <h1 className={styles.pageTitle}>Progress Overview</h1>
                <div className={`${styles.gridContainer} grid gap-4`}>
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
                </div>
                <button
                  onClick={handleCustomScenario}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-all mt-6"
                  style={{ fontSize: '24px', fontWeight: '600' }}
                >
                  Start a New Conversation
                </button>
              </div>

              {/* Feedback Generation Chat */}
              <div className="bg-white p-6 shadow-lg rounded-lg w-1/3">
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#3C3C3C' }}>
                  Feedback Generation Chat
                </h2>
                <div className="chat-container border rounded-lg p-4 h-96 overflow-y-auto mb-4">
                  <div className="chat-message bot-message">Hello! I'm here to gather your feedback.</div>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type your feedback..."
                    className="flex-grow p-2 border rounded-md mr-2"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Send</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 