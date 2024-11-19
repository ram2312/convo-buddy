"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Login.module.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { email, redirectTo } = data;
        localStorage.setItem("userEmail", email);
        alert("Login successful!");
        router.push(redirectTo);
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src="../images/logo.png"
          alt="ConvoBuddy logo"
          className={styles.logo}
        />
        <h1 className={styles.heading}>Welcome Back</h1>
        <p className={styles.subHeading}>
          Welcome back! Please enter your details.
        </p>

        {error && (
          <div className={styles.error} role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Enter your email address"
          />

          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your secure password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Enter your password"
          />

          <button type="submit" className={styles.signInButton}>
            Sign in
          </button>
        </form>

        <p className={styles.signUpText}>
          Don’t have an account?{" "}
          <a
            href="/auth/register"
            className={styles.signUpLink}
            aria-label="Sign up for a new account"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
