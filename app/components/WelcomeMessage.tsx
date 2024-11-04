import React from "react";

interface WelcomeScreenProps {
  handleSelectScenario: () => void;
  handleCustomScenario: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ handleSelectScenario, handleCustomScenario }) => {
  return (
    <div className="flex flex-col items-center space-y-6 w-full bg-white p-8 shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center" style={{ color: "#3C3C3C" }}>
        Welcome to ConvoBuddy!
      </h1>
      <p className="text-center" style={{ color: "#131313", fontSize: "24px" }}>
        Start by selecting a scenario to practice your skills, or jump into a conversation.
        You can track your status, and your progress will be displayed once you’ve started at least one scenario.
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleSelectScenario}
          className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-all"
          style={{ fontSize: "24px", fontWeight: "600" }}
        >
          Select Scenario
        </button>
        <button
          onClick={handleCustomScenario}
          className="bg-[#CDDB28] text-white py-2 px-6 rounded-md hover:bg-purple-700 transition-all"
          style={{ fontSize: "24px", fontWeight: "600" }}
        >
          Start Custom Conversation
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
