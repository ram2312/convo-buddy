"use client";

import { Suspense, useEffect, useState } from "react";
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
    { type: "user", content: "What's your name?" },
    { type: "system", content: "Nice! Now try sharing something about yourself, like where you're from." },
    { type: "user", content: "I'm from New York." },
    { type: "system", content: "Good job! Now ask where they are from to keep the conversation balanced." },
    { type: "user", content: "Where are you from?" },
    { type: "system", content: "Excellent! You've completed the scenario for introducing yourself." },
  ],
  2: [
    { type: "system", content: "Imagine you're handling a disagreement with a friend." },
    { type: "system", content: "Try saying: 'I understand your point, but here's my perspective.'" },
    { type: "user", content: "I understand your point, but here's my perspective." },
    { type: "system", content: "Good! Now, acknowledge their opinion to show you respect it." },
    { type: "user", content: "I see where you're coming from, and I respect your view." },
    { type: "system", content: "Nice! Now, suggest a way to find common ground or compromise." },
    { type: "user", content: "Maybe we can find a solution that works for both of us." },
    { type: "system", content: "Great! Finally, try offering a specific compromise to wrap up the scenario." },
    { type: "user", content: "How about we meet halfway on this?" },
    { type: "system", content: "Excellent! You've completed the handling disagreements scenario." },
  ],
  3: [
    { type: "system", content: "Welcome to the 'Asking for Help' scenario!" },
    { type: "system", content: "Imagine you're in a situation where you need help finding information. Try saying: 'Excuse me, could you help me find [topic]?'" },
    { type: "user", content: "Excuse me, could you help me find information about programming?" },
    { type: "system", content: "That's a good start! Now, politely ask for specific guidance on a certain part." },
    { type: "user", content: "Could you guide me on the basics of programming?" },
    { type: "system", content: "Nice! Now, ask for clarification if you don’t understand something." },
    { type: "user", content: "Could you explain it in more detail, please?" },
    { type: "system", content: "Good job! Finally, thank them for their help to show appreciation." },
    { type: "user", content: "Thank you so much for your help!" },
    { type: "system", content: "Well done! You've completed the asking for help scenario." },
  ],
  4: [
    { type: "system", content: "Welcome to the 'Making Friends' scenario!" },
    { type: "system", content: "Imagine you're at a social event. Start by introducing yourself: 'Hi, I'm [Your Name]. Nice to meet you.'" },
    { type: "user", content: "Hi, I'm John. Nice to meet you." },
    { type: "system", content: "Great! Now, try asking about the other person's interests." },
    { type: "user", content: "What do you like to do in your free time?" },
    { type: "system", content: "That's a good way to keep the conversation going! Now, ask about their favorite hobby." },
    { type: "user", content: "What's your favorite hobby?" },
    { type: "system", content: "Nice! Now, share something about yourself to make the conversation balanced." },
    { type: "user", content: "I enjoy hiking on weekends and exploring new trails." },
    { type: "system", content: "Wonderful! Now, ask a follow-up question to show interest in their response." },
    { type: "user", content: "How did you get into your hobby?" },
    { type: "system", content: "Great follow-up! You've shown interest and kept the conversation engaging. You've completed the making friends scenario." },
  ]
};

export default function ConversationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Conversations />
    </Suspense>
  );
}

function Conversations() {
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
