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
      <h1 id="profileForm" className={styles.heading}>
            Update Your Profile
          </h1>

        <form onSubmit={handleSubmit} className={styles.form} aria-labelledby="profileForm">

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
              placeholder="Enter your full name"
              required
              aria-describedby="fullNameHelp"
            />
            <span id="fullNameHelp" className={styles.helperText}>
              Please provide your full name.
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="nickName">
              Nick Name
            </label>
            <input
              type="text"
              id="nickName"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              className={styles.input}
              placeholder="Enter your nickname"
              aria-describedby="nickNameHelp"
            />
            <span id="nickNameHelp" className={styles.helperText}>
              Optional: Provide a nickname for personalization.
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={styles.input}
              aria-describedby="genderHelp"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <span id="genderHelp" className={styles.helperText}>
              Select your gender.
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="role">
              Role (Parent/Child)
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.input}
              aria-describedby="roleHelp"
            >
              <option value="Parent">Parent</option>
              <option value="Child">Child</option>
            </select>
            <span id="roleHelp" className={styles.helperText}>
              Choose your role in the platform.
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="language">
              Site Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={styles.input}
              aria-describedby="languageHelp"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
            </select>
            <span id="languageHelp" className={styles.helperText}>
              Select the preferred language for the site.
            </span>
          </div>

          <button type="submit" className={styles.saveButton}>
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
