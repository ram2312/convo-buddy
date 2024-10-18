"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/Profile.module.css"; // Importing the CSS module

export default function Profile() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [role, setRole] = useState("Parent");
  const [gender, setGender] = useState("Male");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("No user found. Redirecting to login.");
      router.push("/auth/login");
    } else {
      setEmail(userEmail);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName,
          nickName,
          role,
          gender,
          language,
        }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        router.push("/dashboard");
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Logo on the top-left */}
      <div className={styles.logoContainer}>
        <img src="../images/logo.png" alt="Convo Buddy Logo" className={styles.logo} />
      </div>

      <div className={styles.card}>
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
            <label className={styles.label}>Role (Parent/Teacher)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.input}
            >
              <option value="Parent">Parent</option>
              <option value="Teacher">Teacher</option>
              <option value="Child">Child</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Site Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={styles.input}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          <button type="submit" className={styles.saveButton}>
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
