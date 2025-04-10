"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const signInResult = await signIn("credentials", {
        redirect: true,
        email,
        password,
        callbackUrl: "/",
      });
      console.log("signIn result:", signInResult);

      if (signInResult && !signInResult.error) {
        router.push("/");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••"
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <u><a href="/auth/login">Login</a></u>
      </p>
    </>
  );
}
