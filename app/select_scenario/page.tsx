import styles from "../styles/SelectScenarios.module.css"; // Import the CSS module
import LeftNavigation from "../components/LeftNavigation";

export default function SelectScenarios() {
  return (
    <div className={styles.pageContainer}> {/* Set the background color using the CSS module */}
      <LeftNavigation />

{/* Main content */}
<div className="ml-64 p-8"> {/* Adjust padding for better spacing */}
  <h1 className="text-4xl font-semibold text-[#555758] mb-8 font-['Inter', sans-serif]">Select Scenarios</h1> {/* Updated title styling with the desired font and color */}
        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Adjust grid layout for responsive behavior */}
          <div className={styles.scenarioBlock}>
            <h2 className={styles.scenarioTitle}>Introducing Yourself</h2>
            <p className={styles.scenarioContent}>
              Learn how to confidently introduce yourself in new social situations.
            </p>
          </div>
          
          <div className={styles.scenarioBlock}>
            <h2 className={styles.scenarioTitle}>Handling Disagreements</h2>
            <p className={styles.scenarioContent}>
              Practice staying calm and resolving conflicts during disagreements.
            </p>
          </div>

          <div className={styles.scenarioBlock}>
            <h2 className={styles.scenarioTitle}>Asking for Help</h2>
            <p className={styles.scenarioContent}>
              Learn to ask for assistance politely and effectively in various situations.
            </p>
          </div>

          <div className={styles.scenarioBlock}>
            <h2 className={styles.scenarioTitle}>Making Friends</h2>
            <p className={styles.scenarioContent}>
              Develop the social skills needed to start conversations and build new friendships.
            </p>
          </div>

          <div className={styles.scenarioBlock}>
            <h2 className={styles.scenarioTitle}>Custom Scenario</h2>
            <p className={styles.scenarioContent}>
              Click here to enter chat mode for the scenario.
            </p>
            <button className={styles.enterScenarioButton}>
              Enter Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
