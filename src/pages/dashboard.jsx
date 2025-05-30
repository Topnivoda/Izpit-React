import { useEffect, useState } from "react";
import axios from "axios";
import AddExerciseForm from "../components/AddExerciseForm";
import ExerciseList from "../components/ExerciseList";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:3001/exercises?userId=${userId}`)
      .then((res) => {
        setExercises(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load exercises");
        setLoading(false);
      });
  }, [userId, navigate]);

  const handleAdd = (newExercise) => {
    const exerciseWithUser = { ...newExercise, userId };
    setExercises((prev) => [...prev, exerciseWithUser]);
  };

  // Delete all exercises for the user
  const handleClearAll = async () => {
    try {
      await Promise.all(
        exercises.map((ex) =>
          axios.delete(`http://localhost:3001/exercises/${ex.id}`)
        )
      );
      setExercises([]);
    } catch {
      setError("Failed to clear exercises");
    }
  };

  // Delete last exercise
  const handleDeleteLast = async () => {
    if (exercises.length === 0) return;
    const lastExercise = exercises[exercises.length - 1];

    try {
      await axios.delete(`http://localhost:3001/exercises/${lastExercise.id}`);
      setExercises((prev) => prev.slice(0, -1));
    } catch {
      setError("Failed to delete last exercise");
    }
  };

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.header}>
        <h2 style={styles.welcome}>Welcome, {userEmail}</h2>
      </div>
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
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    marginBottom: "30px",
    color: "white",
  },
  welcome: {
    fontSize: "20px",
    fontWeight: "bold",
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
    backgroundColor: "#f6ad55",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
};