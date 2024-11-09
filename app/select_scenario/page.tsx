"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from "../styles/SelectScenarios.module.css";
import LeftNavigation from "../components/LeftNavigation";


// Define interface for scenario
interface Scenario {
  id: number;
  name: string;
  description: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SelectScenarios() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteCounts, setFavoriteCounts] = useState<{ [key: number]: number }>({});

  const fetchFavoriteCounts = async () => {
    const { data: favoriteData } = await supabase
      .from("favorites")
      .select("scenario_id");
  
    if (!favoriteData) {
      console.error("Error fetching favorite counts.");
      return {};
    }
  
    const counts: { [key: number]: number } = {};
    favoriteData.forEach((favorite) => {
      const scenarioId = favorite.scenario_id;
      counts[scenarioId] = (counts[scenarioId] || 0) + 1;
    });
  
    return counts;
  };
  

  useEffect(() => {
    const fetchScenariosAndFavorites = async () => {
      const userEmail = localStorage.getItem("userEmail");

      if (!userEmail) {
        alert("No user found. Redirecting to login.");
        window.location.href = "/auth/login";
        return;
      }

        // Fetch scenarios
        const { data: scenarioData} = await supabase
          .from("scenarios")
          .select("id, name, description");

          if (!scenarioData) {
            console.error("Error fetching scenarios.");
            return;
          }
          

        if (scenarioData) {
          setScenarios(scenarioData);
        }

        // Fetch user's favorites
        const { data: favoriteData} = await supabase
          .from("favorites")
          .select("scenario_id")
          .eq("user_email", userEmail);

          if (!favoriteData) {
            console.error("Error fetching favorites.");
            return;
          }
          

        if (favoriteData) {
          setFavorites(favoriteData.map((favorite) => favorite.scenario_id));
        }

        // Fetch favorite counts
        const counts = await fetchFavoriteCounts();
        setFavoriteCounts(counts);
      
    };

    fetchScenariosAndFavorites();
  }, []);

  const handleScenarioClick = (scenario: Scenario) => {
    const url = scenario.id === 5 
      ? `/Conversation?name=${encodeURIComponent(scenario.name)}` 
      : `/conversations?scenario=${encodeURIComponent(scenario.id)}&name=${encodeURIComponent(scenario.name)}`;
    router.push(url);
  };

  const toggleFavorite = async (scenarioId: number) => {
    const userEmail = localStorage.getItem("userEmail");
  
    if (!userEmail) {
      alert("No user found. Redirecting to login.");
      window.location.href = "/auth/login";
      return;
    }
        const response = await fetch("/api/favorites/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, scenarioId })
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Favorite added successfully:", result);
        setFavorites([...favorites, scenarioId]);
      } else {
        const errorData = await response.json();
        if (errorData.error === 'Favorite already exists') {
          alert("This scenario is already in your favorites.");
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      }
   
  };
  

  return (
    <div className={styles.pageContainer}>
      <LeftNavigation />

      <div className="ml-64 p-8">
        <h1 className="text-4xl font-semibold text-[#555758] mb-8 font-['Inter', sans-serif]">Select Scenarios</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {scenarios.map((scenario) => (
    <div key={scenario.id} className={styles.scenarioBlock} onClick={() => handleScenarioClick(scenario)}>
      <h2 className={styles.scenarioTitle}>{scenario.name}</h2>
      <p className={styles.scenarioContent}>{scenario.description}</p>

      {/* Favorite Button Logic */}
      <div className="flex justify-between items-center mt-4 gap-14">
        {scenario.id !== 5 ? ( // Check if scenario ID is not 5
          <button
            className={favorites.includes(scenario.id) ? styles.favorited : styles.favoriteButton}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(scenario.id);
            }}
          >
            {favorites.includes(scenario.id) ? "Saved" : "Save"}
          </button>
        ) : null}
        
        {/* Like Count Logic */}
        {scenario.id !== 5 ? ( // Check if scenario ID is not 5
          <span className="text-gray-800">{favoriteCounts[scenario.id] || 0} liked it</span>
        ) : null}
      </div>
    </div>
  ))}
</div>

</div>
    </div>
  );
}
