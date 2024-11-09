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

export default function FavoritesPage() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteCounts, setFavoriteCounts] = useState<{ [key: number]: number }>({});
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

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

      try {
        // Fetch scenarios
        const { data: scenarioData } = await supabase
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
        const { data: favoriteData  } = await supabase
          .from("favorites")
          .select("scenario_id")
          .eq("user_email", userEmail);

          // if (!favoriteData) {
          //   console.error("Error fetching favorites.");
          //   return;
          // }
          

        if (favoriteData) {
          setFavorites(favoriteData.map((favorite) => favorite.scenario_id));
          if (favoriteData.length > 0) {
            setShowFavorites(true);
          }
        }

        // Fetch favorite counts
        const counts = await fetchFavoriteCounts();
        setFavoriteCounts(counts);
      } catch (error) {
        console.error("Unexpected error in fetchScenariosAndFavorites:", error);
      }
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
  
  
      // Check if the scenario is already a favorite
      if (favorites.includes(scenarioId)) {
        // If it's already a favorite, remove it
        const response = await fetch("/api/favorites/remove", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, scenarioId })
        });
  
        if (response.ok) {
          console.log("Favorite removed successfully");
          // Update the favorites state
          setFavorites(favorites.filter((id) => id !== scenarioId));
        } else {
          const errorData = await response.json();
          alert("An error occurred while removing the favorite: " + errorData.error);
        }
      } else {
        // If it's not a favorite, add it
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
      }
    
  };
  

  return (
    <div className={styles.pageContainer}>
      <LeftNavigation />

      <div className="ml-64 p-8">
        <h1 className="text-4xl font-semibold text-[#555758] mb-8 font-['Inter', sans-serif]">Favorites</h1>

        {showFavorites ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {scenarios.map((scenario) => (
              favorites.includes(scenario.id) && (
                <div key={scenario.id} className={styles.scenarioBlock} onClick={() => handleScenarioClick(scenario)}>
                  <h2 className={styles.scenarioTitle}>{scenario.name}</h2>
                  <p className={styles.scenarioContent}>{scenario.description}</p>

                  <div className="flex justify-between items-center mt-4 gap-14">
                    <button
                      className={`${favorites.includes(scenario.id) ? styles.favorited : styles.favoriteButton} transition duration-200 ease-in-out hover:bg-blue-600 hover:text-white`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(scenario.id);
                      }}
                    >
              {favorites.includes(scenario.id) ? "Remove" : "Add to Favorites"}
            </button>
            <span className="text-gray-800">{favoriteCounts[scenario.id] || 0} liked</span>
                      </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No favorites found.</p>
        )}
      </div>
    </div>
  );
}
