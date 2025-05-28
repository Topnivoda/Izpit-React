import { useEffect, useState } from "react";
import axios from "axios";
import AddExerciseForm from "../components/AddExerciseForm";
import ExerciseList from "../components/ExerciseList";

export default function Dashboard() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/exercises")
      .then((res) => {
        setExercises(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load exercises");
        setLoading(false);
      });
  }, []);

  const handleAdd = (newExercise) => {
    setExercises((prev) => [...prev, newExercise]);
  };

  const handleClearAll = () => {
    setExercises([]);
  };

  // ✅ Delete the last exercise from local state
  const handleDeleteLast = () => {
    setExercises((prev) => prev.slice(0, -1));
  };

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.dashboardContainer}>
      <AddExerciseForm onAdd={handleAdd} />
      <div style={styles.listSection}>
        <ExerciseList exercises={exercises} />
        {exercises.length > 0 && (
          <>
            <button onClick={handleClearAll} style={styles.clearButton}>
              Clear All
            </button>
            <button onClick={handleDeleteLast} style={styles.deleteLastButton}>
              Delete Last
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "40px",
    padding: "40px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  listSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  clearButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#e53e3e",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
  deleteLastButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#f6ad55", // Orange
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
};