"use client";
import { useEffect, useState } from "react";
import LeftNavigation from "../components/LeftNavigation";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import next/image for optimized images
import styles from "../styles/Dashboard.module.css";
import loaderStyles from "../styles/GlobalLoader.module.css";

const TOTAL_SCENARIOS = 4;
const POINTS_PER_SCENARIO = 250;

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [badgesUnlocked, setBadgesUnlocked] = useState(0);
  const [isParentMode, setIsParentMode] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [feedbackMessagesVisible, setFeedbackMessagesVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const feedbackMessages = {
    start: [
      "Welcome! As a beginner, focus on completing each scenario carefully.",
      "Practice basic communication skills and observe how you interact.",
    ],
    beginner: [
      "Welcome! As a beginner, focus on completing each scenario carefully.",
      "Practice basic communication skills and observe how you interact.",
      "Keep going! You're building a strong foundation for effective communication.",
    ],
    intermediate: [
      "You're making great progress and reached Intermediate level! Try refining your responses.",
      "Think about the scenarios and how you can handle similar situations in real life.",
      "Keep practicing, and you'll see improvement in your communication skills.",
    ],
    advanced: [
      "Amazing work! You've completed all scenarios and reached Advanced level!",
      "Now focus on mastering nuanced communication techniques.",
      "Consider exploring advanced scenarios to further refine your skills.",
    ],
  };

  const getFeedbackMessages = () => {
    if (badgesUnlocked === 0) return feedbackMessages.start;
    if (badgesUnlocked === 1) return feedbackMessages.beginner;
    if (badgesUnlocked === 2) return feedbackMessages.intermediate;
    return feedbackMessages.advanced;
  };

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
          setCompletionPercentage(
            Math.round((data.scenariosCompleted / TOTAL_SCENARIOS) * 100)
          );
          setPointsEarned(data.scenariosCompleted * POINTS_PER_SCENARIO);
          setUserRole(data.role);

          if (data.scenariosCompleted === 1) {
            setBadgesUnlocked(1);
          } else if (data.scenariosCompleted === 2 || data.scenariosCompleted === 3) {
            setBadgesUnlocked(2);
          } else if (data.scenariosCompleted >= 4) {
            setBadgesUnlocked(3);
          }
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
        alert("Error fetching progress data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  const handleCustomScenario = () => {
    router.push("/Conversation");
  };

  const toggleParentMode = () => {
    if (!isParentMode) {
      router.push("/ParentsDashboard");
    }
    setIsParentMode(!isParentMode);
  };

  const handleFeedbackSubmit = () => {
    if (feedbackInput.trim().toLowerCase() === "feedback") {
      setFeedbackMessagesVisible(true);
      setFeedbackInput("");
    }
  };

  if (loading) {
    return (
<div className={loaderStyles.loaderOverlay} role="alert" aria-live="polite">
Loading your dashboard...      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {!isParentMode && <LeftNavigation />}
      <div
        className={`p-6 w-full flex flex-col items-center h-screen ${
          isParentMode ? "" : "ml-64"
        }`}
      >
        <div className="flex w-full max-w-7xl space-x-8">
          <div className="w-2/5 flex flex-col space-y-4 bg-white p-6 shadow-lg rounded-lg">
            <h1 className={styles.pageTitle}>Progress Overview</h1>
            <div className={`${styles.gridContainer} grid gap-2`}>
            <div className={styles.statBlock} aria-labelledby="badgesUnlockedTitle">
            <h2 id="badgesUnlockedTitle" className={styles.statTitle}>
    Badges Unlocked
  </h2>
                <p className={styles.statValue}>
                  <span className={styles.stars}>
                    {badgesUnlocked === 0 ? (
                      "0"
                    ) : (
                      <>
                        {badgesUnlocked >= 1 && (
                          <Image
                            src="/images/star-medal.png"
                            alt="star"
                            width={24}
                            height={24}
                            className={styles.starImage}
                          />
                        )}
                        {badgesUnlocked >= 2 && (
                          <Image
                            src="/images/star-medal.png"
                            alt="star"
                            width={24}
                            height={24}
                            className={styles.starImage}
                          />
                        )}
                        {badgesUnlocked >= 3 && (
                          <Image
                            src="/images/star-medal.png"
                            alt="star"
                            width={24}
                            height={24}
                            className={styles.starImage}
                          />
                        )}
                      </>
                    )}
                  </span>
                </p>
              </div>

              <div className={styles.statBlock}>
                <h2 className={styles.statTitle}>Points Earned</h2>
                <p className={styles.statValue}>{pointsEarned}</p>
              </div>
              <div className={styles.statBlock}>
                <h2 className={styles.statTitle}>Scenarios Completed</h2>
                <p className={styles.statValue}>{completionPercentage}%</p>
              </div>
            </div>
            <button
              onClick={handleCustomScenario}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-all mt-6"
              style={{ fontSize: "24px", fontWeight: "600" }}
            >
              Start a New Conversation
            </button>
          </div>
          <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg flex flex-col space-y-4">
            {userRole === "Parent" && (
              <button
                onClick={toggleParentMode}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-all w-full mb-4"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                {isParentMode ? "Exit Parent Mode" : "Enter Parent Mode"}
              </button>
            )}
            <h2 className="text-2xl font-semibold" style={{ color: "#3C3C3C" }}>
              Feedback Generation Chat
            </h2>
            <div className={styles.chatContainer}>
              {!feedbackMessagesVisible ? (
                <div className="chat-message initial-message" role="region" aria-live="polite">
                Type &quot;feedback&quot; and press Enter to receive guidance based on your progress.
                </div>
              ) : (
                getFeedbackMessages().map((msg, index) => (
                  <div key={index} className="chat-message bot-message">
                    {msg}
                  </div>
                ))
              )}
            </div>
            <div className={`${styles.chatInputContainer} flex items-center`}>
            <label htmlFor="feedbackInput" className="sr-only">
  Feedback Input
</label>
<input
  id="feedbackInput"
  type="text"
  placeholder="Type 'feedback'..."
  value={feedbackInput}
  onChange={(e) => setFeedbackInput(e.target.value)}
  onKeyPress={(e) => e.key === "Enter" && handleFeedbackSubmit()}
  className="flex-grow p-2 border rounded-md mr-2"
/>
<button
  onClick={handleFeedbackSubmit}
  className="bg-blue-600"
  aria-label="Send feedback"
>
  Send
</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
