import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost/signup/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.status === "success") {
        setSuccess(data.message || "Signup successful! You can login now.");
        setError("");
        setForm({ username: "", email: "", password: "" });
        navigate("/signin");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.log(err);
      setError("Error connecting to server");
    }
  };

  // Styling object
  const styles = {
    container: {
      maxWidth: 400,
      margin: "50px auto",
      padding: 30,
      borderRadius: 8,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    title: {
      textAlign: "center",
      marginBottom: 20,
      color: "#333",
    },
    inputGroup: {
      marginBottom: 15,
    },
    label: {
      display: "block",
      marginBottom: 6,
      fontWeight: "600",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      fontSize: 16,
      borderRadius: 4,
      border: "1.5px solid #ccc",
      outline: "none",
      transition: "border-color 0.3s",
    },
    inputFocus: {
      borderColor: "#007BFF",
    },
    button: {
      width: "100%",
      padding: "12px 0",
      backgroundColor: "#007BFF",
      border: "none",
      borderRadius: 4,
      color: "#fff",
      fontSize: 18,
      fontWeight: "600",
      cursor: "pointer",
      marginTop: 10,
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    messageError: {
      color: "#D8000C",
      backgroundColor: "#FFBABA",
      padding: 10,
      borderRadius: 4,
      marginBottom: 15,
      textAlign: "center",
    },
    messageSuccess: {
      color: "#4F8A10",
      backgroundColor: "#DFF2BF",
      padding: 10,
      borderRadius: 4,
      marginBottom: 15,
      textAlign: "center",
    },
    bottomText: {
      marginTop: 20,
      textAlign: "center",
      color: "#555",
    },
    link: {
      color: "#007BFF",
      textDecoration: "none",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Signup</h2>

      {error && <p style={styles.messageError}>{error}</p>}
      {success && <p style={styles.messageSuccess}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label htmlFor="username" style={styles.label}>
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            style={styles.input}
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          Signup
        </button>
      </form>

      <p style={styles.bottomText}>
        Already have an account?{" "}
        <Link to="/signin" style={styles.link}>
          Login here
        </Link>
      </p>
    </div>
  );
}
