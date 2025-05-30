import { useState } from "react";
import axios from "axios";

export default function AddExerciseForm({ onAdd }) {
  const [name, setName] = useState("");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !duration || !type) {
      setError("Please fill in all required fields.");
      return;
    }

    const durationNum = Number(duration);
    const repsNum = reps ? Number(reps) : 0;

    if (isNaN(durationNum) || durationNum <= 0) {
      setError("Duration must be a positive number.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("You must be logged in to add exercises.");
      return;
    }

    setError("");

    axios
      .post("http://localhost:3001/exercises", {
        name,
        duration: durationNum,
        reps: repsNum,
        type,
        userId,
      })
      .then((res) => {
        onAdd(res.data);
        setName("");
        setDuration("");
        setReps("");
        setType("");
      })
      .catch(() => setError("Failed to add exercise."));
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Add New Exercise</h2>

        <label style={styles.label} htmlFor="name">Exercise Name</label>
        <input
          style={styles.input}
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Push-ups, Running..."
        />

        <label style={styles.label} htmlFor="duration">Duration (minutes)</label>
        <input
          style={styles.input}
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="30"
        />

        <label style={styles.label} htmlFor="reps">Reps (optional)</label>
        <input
          style={styles.input}
          id="reps"
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="10"
        />

        <label style={styles.label} htmlFor="type">Type</label>
        <input
          style={styles.input}
          id="type"
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Cardio, Strength..."
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} type="submit">
          Add Exercise
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
    width: "340px",
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
    textAlign: "center",
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