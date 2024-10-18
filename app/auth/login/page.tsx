"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Login.module.css"; // Assuming the CSS is stored in a module

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        const { email, redirectTo } = data; // Extract destination from response
        localStorage.setItem("userEmail", email); // Save email in localStorage
        alert("Login successful!");
        router.push(redirectTo); // Redirect to the appropriate page
      } else {
        alert(data.error); // Display error message
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src="../images/logo.png"
          alt="ConvoBuddy"
          className={styles.logo}
        />
        <h1 className={styles.heading}>Welcome Back</h1>
        <p className={styles.subHeading}>
          Welcome back! Please enter your details.
        </p>

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

          {/* <div className={styles.options}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              Remember me
            </label>
            <a href="#" className={styles.forgotPassword}>
              Forgot password?
            </a>
          </div> */}

          <button type="submit" className={styles.signInButton}>
            Sign in
          </button>
        </form>

        <p className={styles.signUpText}>
          Don’t have an account?{" "}
          <a href="/auth/register" className={styles.signUpLink}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
