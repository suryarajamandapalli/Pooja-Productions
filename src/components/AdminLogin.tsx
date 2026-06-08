import React, { useState } from "react";
import { useCMS } from "./CMSContext";

export const AdminLogin: React.FC<{ onBackToSite: () => void }> = ({ onBackToSite }) => {
  const { login } = useCMS();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAuthenticating(true);

    if (username !== "admin") {
      setError("Invalid admin username");
      setAuthenticating(false);
      return;
    }

    const success = await login(password);
    if (!success) {
      setError("Incorrect password. Please try again.");
    }
    setAuthenticating(false);
  };

  return (
    <div className="admin-login-wrapper" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      width: "100vw",
      backgroundColor: "#000000",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 99999,
      fontFamily: '"Urbanist", sans-serif'
    }}>
      <div className="login-card" style={{
        width: "90%",
        maxWidth: "420px",
        backgroundColor: "#0A0A0A",
        border: "1px solid #C5A880",
        borderRadius: "1.5rem",
        padding: "3.5rem 2.5rem",
        boxShadow: "0 25px 50px -12px rgba(197, 168, 128, 0.25)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <img src="/logo.png" alt="Pooja Productions Logo" style={{ height: "6.5rem", marginBottom: "1.5rem" }} />
          <h2 style={{ fontSize: "2.4rem", fontWeight: 700, color: "#FFFFFF", margin: 0, letterSpacing: "0.05em" }}>
            STUDIO CONTROL
          </h2>
          <p style={{ fontSize: "1.3rem", color: "#C5A880", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.5rem" }}>
            Admin Authorization
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <label htmlFor="username" style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              style={{
                width: "100%",
                padding: "1.2rem 1.6rem",
                borderRadius: "0.8rem",
                backgroundColor: "#121212",
                border: "1px solid #262626",
                color: "#FFFFFF",
                fontSize: "1.5rem",
                outline: "none",
                transition: "border-color 0.3s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#C5A880"}
              onBlur={(e) => e.target.style.borderColor = "#262626"}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <label htmlFor="password" style={{ fontSize: "1.3rem", color: "#AEB5C5", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: "100%",
                padding: "1.2rem 1.6rem",
                borderRadius: "0.8rem",
                backgroundColor: "#121212",
                border: "1px solid #262626",
                color: "#FFFFFF",
                fontSize: "1.5rem",
                outline: "none",
                transition: "border-color 0.3s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#C5A880"}
              onBlur={(e) => e.target.style.borderColor = "#262626"}
            />
          </div>

          {error && (
            <div style={{
              padding: "1rem 1.5rem",
              borderRadius: "0.6rem",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#EF4444",
              fontSize: "1.3rem",
              lineHeight: "1.5"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={authenticating}
            style={{
              width: "100%",
              padding: "1.4rem",
              borderRadius: "0.8rem",
              backgroundColor: "#C5A880",
              color: "#000000",
              border: "none",
              fontSize: "1.5rem",
              fontWeight: 600,
              cursor: authenticating ? "not-allowed" : "pointer",
              transition: "transform 0.2s, opacity 0.2s",
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1.0")}
          >
            {authenticating ? "Authorizing..." : "Access Dashboard"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <button
            onClick={onBackToSite}
            style={{
              background: "none",
              border: "none",
              color: "#505258",
              fontSize: "1.3rem",
              cursor: "pointer",
              textDecoration: "underline",
              transition: "color 0.3s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#AEB5C5")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#505258")}
          >
            Return to Website
          </button>
        </div>
      </div>
    </div>
  );
};
