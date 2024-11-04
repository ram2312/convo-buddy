"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LeftNavigation from "../components/LeftNavigation"; 
import styles from "../styles/Settings.module.css"; 

export default function Settings() {
  const router = useRouter();
  const [id, setId] = useState<number | null>(null);  
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [role, setRole] = useState("Parent");
  const [gender, setGender] = useState("Male");
  const [language, setLanguage] = useState("English");

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        alert("No user found. Redirecting to login.");
        router.push("/auth/login");
      } else {
        setEmail(userEmail);

        try {
          const response = await fetch(`/api/profile?email=${userEmail}`);
          if (response.ok) {
            const data = await response.json();
            setId(data.id);  
            setFullName(data.full_name || "");
            setNickName(data.nick_name || "");
            setRole(data.role || "Parent");
            setGender(data.gender || "Male");
            setLanguage(data.language || "English");
          } else {
            const errorData = await response.json();
            alert(errorData.error);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,  
          email,
          fullName,
          nickName,
          role,
          gender,
          language,
        }),
      });

      if (response.ok) {
        alert("Settings updated successfully!");
        router.push("/dashboard");
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Settings update error:", error);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <div className={styles.settingsPage}> {/* White background */}
      {/* Left Navigation */}
      <LeftNavigation />

      {/* Main content */}
      <div className="ml-64 p-6 w-full">
      <h1 className={styles.pageTitle}>Settings</h1>

        <div className={styles.settingsContainer}>

          {/* Page Title */}

          <div className={styles.userDetails}>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{fullName}</h2>
              <p className={styles.userEmail}>{email}</p>
            </div>
            {/* <button className={styles.editButton}>Edit</button> */}
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={styles.input}
                placeholder="Your Full Name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nick Name</label>
              <input
                type="text"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                className={styles.input}
                placeholder="Your First Name"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={styles.input}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Role (Parent/Child)</label>
              <select
                value={role}
                className={styles.input}
                disabled={true} // Disable editing for the role field
              >
                <option value="Parent">Parent</option>
                {/* <option value="Teacher">Teacher</option> */}
                <option value="Child">Child</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Site Language</label>
              <select
                value={language}
                className={styles.input}
                disabled={true} // Disable editing for the site language field
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>

            <button type="submit" className={styles.saveButton}>
              Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
