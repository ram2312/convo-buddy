"use client"; // Add this to ensure it's a client component

import Link from "next/link";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import styles from "../styles/LeftNavigation.module.css"; // Import the CSS module

export default function LeftNavigation() {
  const router = useRouter();

  // Handle logout
  const handleLogout = () => {
    // Clear any authentication data (e.g., tokens, localStorage)
    localStorage.removeItem("userEmail"); // Remove user data
    localStorage.removeItem("authToken"); // Example if you have a token stored

    // Redirect to login page
    router.push("/auth/login");
  };

  return (
    <div className={styles.leftNavigation}>
      <div className={styles.logo}>
        <img src="/images/logo.png" alt="Convo Buddy" />
      </div>

      <nav className="space-y-4">
        <Link href="/dashboard" className={styles.navItem}>
          Dashboard
        </Link>
        <Link href="/select_scenario" className={styles.navItem}>
          Scenarios
        </Link>
        <Link href="/progress" className={styles.navItem}>
          Progress
        </Link>
        <Link href="/conversations" className={styles.navItem}>
          Conversations
        </Link>
        <Link href="/reports" className={styles.navItem}>
          Reports
        </Link>
        <Link href="/settings" className={styles.navItem}>
          Settings
        </Link>

        {/* Logout button */}
        <button 
          onClick={handleLogout} 
          className={styles.logoutButton}
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
