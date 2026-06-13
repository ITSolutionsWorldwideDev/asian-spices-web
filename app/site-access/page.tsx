//  apps/web/app/site-access/page.tsx

"use client";

import { useState } from "react";

export default function SiteAccessPage() {
  const [password, setPassword] =
    useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const res = await fetch(
      "/api/site-access",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      }
    );

    if (res.ok) {
      window.location.href = "/";
    } else {
      setError("Invalid password");
    }
  }

  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h1>Private Access</h1>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Enter Site
        </button>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}
      </form>
    </main>
  );
}