"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Register.module.css";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Error state for UI feedback

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      document.getElementById("confirmPassword")?.focus();
      return;
    }

    setError(null); // Clear previous errors

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
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className={styles.container} role="main" aria-label="Registration Page">
      <div className={styles.logoContainer}>
        <img
          src="../images/logo.png"
          alt="Convo Buddy Logo"
          className={styles.logo}
        />
      </div>
      <div className={styles.card}>
        <h1 className={styles.heading}>Welcome to ConvoBuddy</h1>
        <p className={styles.subHeading}>Sign up to start your journey</p>

        {/* Error message section */}
        {error && (
          <div className={styles.error} role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
            aria-label="Enter your email"
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
            aria-label="Enter your password"
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
            aria-label="Confirm your password"
          />

          <button type="submit" className={styles.signUpButton} aria-label="Register">
            Register
          </button>
        </form>

        <p className={styles.signInText}>
          Already have an account?{" "}
          <a href="/auth/login" className={styles.signInLink} aria-label="Log in to your account">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
