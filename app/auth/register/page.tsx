"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Register.module.css"; // Assuming the CSS is stored in a module

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userEmail", data.email); // Save email to localStorage
        alert("Registration successful! Redirecting to profile.");
        router.push(data.redirectTo); // Redirect to profile page
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img src="../images/logo.png" alt="Convo Buddy Logo" className={styles.logo} /> {/* Adjust this path */}
      </div>           
      <div className={styles.card}>
        <h1 className={styles.heading}>Welcome to ConvoBuddy</h1>
        <p className={styles.subHeading}>Sign up to start your journey</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className={styles.label} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className={styles.signUpButton}>
            Register
          </button>
        </form>

        <p className={styles.signInText}>
          Already have an account?{" "}
          <a href="/auth/login" className={styles.signInLink}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
