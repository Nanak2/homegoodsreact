import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ onClose, onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("nana@gmail.com");
  const navigate = useNavigate();

  function closeModal() {
    setPassword("");
    onClose();
  }

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ update App state via callback
        onLoginSuccess();
        navigate("/admin");
        closeModal();
      } else {
        alert("Login failed: " + (data.message || "Invalid credentials"));
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Try again later");
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Signup response:", data);

      if (response.ok) {
        alert("Signup successful. Please log in.");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Network error. Please try again later.");
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
      onClick={closeModal}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "2rem",
          minWidth: "500px",
          maxWidth: "600px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 1rem 0", textAlign: "center" }}>🔐 Admin Login</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          autoComplete="current-password"
          className="form-control h-25 custom-input"
          style={{
            padding: "0.6rem",
            width: "85%",
            borderRadius: "4px",
            borderLeft: "4px solid #ea580c",
            fontSize: "1rem",
            display: "block",
            margin: "0 auto",
          }}
        />
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
          <button className="button-secondary text-danger" onClick={closeModal}>
            Cancel
          </button>
          <button className="button" onClick={handleLogin}>
            Login
          </button>
        </div>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            textAlign: "center",
            marginTop: "1rem",
            marginBottom: 0,
          }}
        >
          Tip: Press Ctrl+Shift+A to open this login
        </p>
      </div>
    </div>
  );
}
