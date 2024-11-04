"use client"; // Mark this as a Client Component

import { useRouter } from 'next/navigation'; // Use 'next/navigation' instead of 'next/router'
import styles from "../styles/SelectScenarios.module.css"; // Import the CSS module
import LeftNavigation from "../components/LeftNavigation";

// Define interface for scenario
interface Scenario {
  id: number;
  name: string;
  description: string;
}

export default function SelectScenarios() {
  const router = useRouter();

  // Handler for scenario selection
  const handleScenarioClick = (scenario: Scenario) => {
    if (scenario.id === 5) {
      // Navigate to the conversation page without scenario ID for "Custom Scenario"
      router.push(`/Conversation?name=${encodeURIComponent(scenario.name)}`);
    } else {
      // For other scenarios, navigate with scenario ID and name
      const url = `/conversations?scenario=${encodeURIComponent(scenario.id)}&name=${encodeURIComponent(scenario.name)}`;
      router.push(url);
    }
  };

  // Mock scenarios
  const scenarios: Scenario[] = [
    { id: 1, name: "Introducing Yourself", description: "Learn how to confidently introduce yourself in new social situations." },
    { id: 2, name: "Handling Disagreements", description: "Practice staying calm and resolving conflicts during disagreements." },
    { id: 3, name: "Asking for Help", description: "Learn to ask for assistance politely and effectively in various situations." },
    { id: 4, name: "Making Friends", description: "Develop the social skills needed to start conversations and build new friendships." },
    { id: 5, name: "Custom Scenario", description: "Click here to enter chat mode for the scenario." }
  ];

  return (
    <div className={styles.pageContainer}>
      <LeftNavigation />

      {/* Main content */}
      <div className="ml-64 p-8">
        <h1 className="text-4xl font-semibold text-[#555758] mb-8 font-['Inter', sans-serif]">
          Select Scenarios
        </h1>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={styles.scenarioBlock}
              onClick={() => handleScenarioClick(scenario)}
            >
              <h2 className={styles.scenarioTitle}>{scenario.name}</h2>
              <p className={styles.scenarioContent}>{scenario.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
