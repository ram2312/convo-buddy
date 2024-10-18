// pages/dashboard.tsx

import LeftNavigation from "../components/LeftNavigation";

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <LeftNavigation />

      {/* Main content */}
      <div className="ml-64 p-6"> {/* Give margin-left to make space for the fixed sidebar */}
        <h1 className="text-3xl font-bold mb-4">Dashboard Page</h1>
        
        {/* Add dashboard-specific content here */}
        <div className="stats-container">
          <div className="bg-white p-6 shadow-md rounded-lg mb-4">
            <h2 className="text-xl font-semibold">Scenarios Completed</h2>
            <p className="text-2xl text-red-500">70%</p>
            <p>7/10</p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-lg mb-4">
            <h2 className="text-xl font-semibold">Points Earned</h2>
            <p className="text-2xl">1200</p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Badges Unlocked</h2>
            <p className="text-2xl">3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
