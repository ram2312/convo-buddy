"use client";

import LeftNavigation from "../components/LeftNavigation";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  // Handler for "Select Scenario" button
  const handleSelectScenario = () => {
    router.push("/select_scenario"); // Redirect to the select_scenario page
  };

  // Handler for "Select Custom Scenario" button (redirects to conversations page)
  const handleCustomScenario = () => {
    router.push("/conversations"); // Redirect to the conversations page
  };

  return (
    <div className="dashboard-page flex" style={{ backgroundColor: '#DADADA', minHeight: '100vh' }}>
      <LeftNavigation />

      {/* Main content */}
      <div className="ml-64 p-6 w-full flex justify-center items-center h-screen"> {/* Full height and centered content */}
        <div className="max-w-4xl w-full"> {/* Limit the width of the content */}
          {/* Welcome Block */}
          <div className="bg-white p-8 shadow-lg rounded-lg mb-6">
            <h1
              className="text-4xl font-bold text-center mb-6"
              style={{ color: '#3C3C3C', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}
            >
              Welcome to ConvoBuddy!
            </h1>
            <p
              className="text-center mb-6"
              style={{ color: '#3C3C3C', fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: '600', lineHeight: 'normal' }}
            >
              Start by selecting a scenario to practice your skills, or jump into a conversation.
              You can track your status, and your progress will be displayed once you’ve started
              at least one scenario.
            </p>

            {/* Buttons */}
            <div className="flex justify-center space-x-4 mb-8"> {/* Center the buttons */}
              <button
                onClick={handleSelectScenario}
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-all"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: '600' }}
              >
                Select Scenario
              </button>
              <button
                onClick={handleCustomScenario}
                className="bg-[#CDDB28] text-white py-2 px-6 rounded-md hover:bg-purple-700 transition-all"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: '600' }}
              >
                Select Custom Scenario
              </button>
            </div>

            {/* Progress Message */}
            <div className="bg-white p-8 shadow-md rounded-lg">
              <p
                className="text-center"
                style={{ color: '#3C3C3C', fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: '600', lineHeight: 'normal' }}
              >
                Your progress will be displayed here once you’ve started working on at least one scenario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
