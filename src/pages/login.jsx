import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // redirect after login

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setError("");

    axios
      .get(
        `http://localhost:3001/users?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`
      )
      .then((res) => {
        if (res.data.length === 1) {
          const user = res.data[0];

          // ✅ Store user ID, username, and email in localStorage
          localStorage.setItem("userId", user.id);
          localStorage.setItem("username", user.username);
          localStorage.setItem("userEmail", user.email);  // <-- Added this line

          alert("Login successful!");
          navigate("/dashboard"); // ✅ redirect to dashboard
        } else {
          setError("Invalid email or password.");
        }
      })
      .catch(() => {
        setError("Server error. Please try again later.");
      });
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Login</h2>

        <label style={styles.label} htmlFor="email">Email</label>
        <input
          style={styles.input}
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <label style={styles.label} htmlFor="password">Password</label>
        <input
          style={styles.input}
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} type="submit">Log In</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
    width: "320px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: "24px",
    color: "#333",
    textAlign: "center",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    padding: "10px 14px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  error: {
    color: "red",
    marginBottom: "12px",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#667eea",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "4px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
};