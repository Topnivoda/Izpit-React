import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to FitTrack</h1>
        <p style={styles.subtitle}>Track your workouts. Stay healthy. Stay consistent.</p>
        <div style={styles.buttons}>
          <Link to="/register" style={styles.button}>Register</Link>
          <Link to="/login" style={{ ...styles.button, backgroundColor: "#4a5568" }}>Log In</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "50px",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "500px",
  },
  title: {
    fontSize: "32px",
    color: "#333",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "30px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "background 0.3s",
  },
};