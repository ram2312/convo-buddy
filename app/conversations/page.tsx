"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LeftNavigation from "../components/LeftNavigation";
import styles from "../styles/Conversations.module.css";

// Define chat content for different scenarios
const scenarioChats: Record<number, { type: string; content: string }[]> = {
  1: [
    { type: "system", content: "Welcome! Let's start by introducing yourself." },
    { type: "system", content: "Try saying: 'Hi, my name is [Your Name]'." },
    { type: "user", content: "Hi, my name is John." },
    { type: "system", content: "Great! Now try asking about the other person's name." },
    { type: "system", content: "Nice work! You've completed the scenario for introducing yourself." },
  ],
  2: [
    { type: "system", content: "Imagine you're handling a disagreement with a friend." },
    { type: "system", content: "Try saying: 'I understand your point, but here's my perspective.'" },
    { type: "user", content: "I understand your point, but here's my perspective." },
    { type: "system", content: "Good job! Now try suggesting a compromise." },
    { type: "user", content: "Let's find a solution that works for both of us." },
    { type: "system", content: "Excellent! You've completed the handling disagreements scenario." },
  ],
  3: [
    { type: "system", content: "Welcome to the 'Asking for Help' scenario!" },
    { type: "system", content: "Imagine you're in a situation where you need help finding information. Try saying: 'Excuse me, could you help me find [topic]?'" },
    { type: "user", content: "Excuse me, could you help me find information about programming?" },
    { type: "system", content: "That's a good start! Now, try asking for clarification politely." },
    { type: "user", content: "Could you explain it in more detail, please?" },
    { type: "system", content: "Well done! You've completed the asking for help scenario." },
  ],
  4: [
    { type: "system", content: "Welcome to the 'Making Friends' scenario!" },
    { type: "system", content: "Imagine you're at a social event. Start by introducing yourself: 'Hi, I'm [Your Name]. Nice to meet you.'" },
    { type: "user", content: "Hi, I'm John. Nice to meet you." },
    { type: "system", content: "Great! Now, try asking about the other person's interests." },
    { type: "user", content: "What do you like to do in your free time?" },
    { type: "system", content: "That's a good way to keep the conversation going! You've completed the making friends scenario." },
  ],
};

export default function Conversations() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams?.get("scenario");
  const name = searchParams?.get("name") || "Conversation";

  const scenarioId = parseInt(scenarioParam || "1", 10) as 1 | 2 | 3 | 4;

  const [messages, setMessages] = useState<{ type: string; content: string }[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [step, setStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("No user found. Redirecting to login.");
      window.location.href = "/auth/login";
    } else {
      setUserEmail(email);
      checkCompletionStatus(email, scenarioId); // Check completion status on load
    }

    if (scenarioId && scenarioChats[scenarioId]) {
      setMessages([scenarioChats[scenarioId][0]]);
      setStep(1);
    }
  }, [scenarioId]);

  const checkCompletionStatus = async (email: string, scenarioId: number) => {
    try {
      const response = await fetch("/api/scenario/check-completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, scenarioId }),
      });

      const data = await response.json();

      if (response.ok && data.alreadyCompleted) {
        setIsCompleted(true);
        alert("This scenario has already been completed.");
      } else if (response.ok && !data.alreadyCompleted) {
        setIsCompleted(false);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to check scenario completion:", error);
    }
  };

  useEffect(() => {
    if (isCompleted) return;

    if (step > 0 && step < scenarioChats[scenarioId]?.length) {
      const timeout = setTimeout(() => {
        setMessages((prev) => [...prev, scenarioChats[scenarioId][step]]);
        setStep((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (step >= scenarioChats[scenarioId]?.length && userEmail) {
      markScenarioComplete(userEmail, scenarioId);
    }
  }, [step, scenarioId, userEmail, isCompleted]);

  const markScenarioComplete = async (email: string, scenarioId: number) => {
    try {
      const response = await fetch("/api/scenario/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, scenarioId }),
      });

      if (response.ok) {
        alert("Scenario completed!");
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to mark scenario as complete:", error);
    }
  };

  const handleSendMessage = () => {
    if (userMessage.trim() !== "") {
      setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
      setUserMessage("");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <LeftNavigation />

      <div className="ml-64 p-8">
        <h1 className={`${styles.pageTitle} text-3xl font-semibold mb-8`}>{name}</h1>

        <div className={styles.conversationContainer}>
          <div className={styles.messageList}>
            {isCompleted ? (
              <div className={styles.completedMessage}>
                This scenario has already been completed.
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={msg.type === "user" ? styles.userMessage : styles.botMessage}
                >
                  <div>{msg.content}</div>
                </div>
              ))
            )}
          </div>

          {/* Input field inside the chat box */}
          {!isCompleted && (
            <div className={styles.messageInputContainer}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Type a message..."
                  className={styles.messageInput}
                />
                <button onClick={handleSendMessage} className={styles.sendButton}>
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
