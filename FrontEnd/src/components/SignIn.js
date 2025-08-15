import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
export default function Signin() {
    const { login } = useContext(AuthContext);



  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost/login/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      console.log(data);

      if (data.status === "success") {
        // Optionally store user info or token here
        // localStorage.setItem("user", JSON.stringify(data.user));

         // redirect after success
         // After successful login response
login(data.user || { username: form.username });
         navigate('/backlog')
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server");
    }
  };

  // Styles similar to Signup page
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
    messageError: {
      color: "#D8000C",
      backgroundColor: "#FFBABA",
      padding: 10,
      borderRadius: 4,
      marginBottom: 15,
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      {error && <p style={styles.messageError}>{error}</p>}

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
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            style={styles.input}
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}
