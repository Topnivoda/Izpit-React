import { useEffect, useState } from "react";
import axios from "axios";
import AddExerciseForm from "../components/AddExerciseForm";
import ExerciseList from "../components/ExerciseList";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Dashboard() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("cardio");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState({});
  const navigate = useNavigate();

  // Hide default calendar date numbers to prevent overlap with custom circle
  // This style hides the default date number inside each tile
  // Added here inside component for simplicity, can be moved to global CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .react-calendar__tile abbr {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  const handleAdd = async (newExercise) => {
    const exerciseWithUser = { ...newExercise, userId, completed: false };
    try {
      const res = await axios.post(
        "http://localhost:3001/exercises",
        exerciseWithUser
      );
      setExercises((prev) => [...prev, res.data]);
    } catch {
      setError("Failed to add exercise");
    }
  };

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

  const handleToggleComplete = async (exercise) => {
    try {
      const updated = { ...exercise, completed: !exercise.completed };
      await axios.put(
        `http://localhost:3001/exercises/${exercise.id}`,
        updated
      );
      setExercises((prev) =>
        prev.map((ex) => (ex.id === exercise.id ? updated : ex))
      );
    } catch {
      setError("Failed to update exercise completion");
    }
  };

  const predefinedWorkouts = {
    cardio: [
      { name: "🏃 Jumping Jacks", duration: "3 mins", type: "Cardio" },
      { name: "🤸 Burpees", reps: "15", sets: "3", type: "Cardio" },
      { name: "⛰️ Mountain Climbers", reps: "20", sets: "3", type: "Cardio" },
    ],
    strength: [
      { name: "💪 Push-ups", reps: "10", sets: "3", type: "Strength" },
      { name: "🏋️ Squats", reps: "15", sets: "3", type: "Strength" },
      { name: "🦵 Lunges", reps: "10", sets: "3", type: "Strength" },
    ],
    hybrid: [
      { name: "🔁 Jump Rope", duration: "2 mins", type: "Hybrid" },
      { name: "💪 Push-ups", reps: "10", sets: "2", type: "Hybrid" },
      { name: "🏋️ Squats", reps: "15", sets: "2", type: "Hybrid" },
    ],
  };

  const handleGenerateWorkout = async () => {
    const newWorkout = predefinedWorkouts[selectedWorkoutType].map((ex) => ({
      ...ex,
      userId,
      completed: false,
    }));

    try {
      await Promise.all(
        exercises.map((ex) =>
          axios.delete(`http://localhost:3001/exercises/${ex.id}`)
        )
      );

      const savedExercises = await Promise.all(
        newWorkout.map((exercise) =>
          axios.post("http://localhost:3001/exercises", exercise)
        )
      );
      const added = savedExercises.map((res) => res.data);
      setExercises(added);
    } catch {
      setError("Failed to generate workout");
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(exercises);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setExercises(reordered);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Mark selected date with "workout" or "rest"
  const markDate = (type) => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    setMarkedDates((prev) => ({ ...prev, [dateStr]: type }));
  };

  // Get status of a date string
  const getDayStatus = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return markedDates[dateStr] || null;
  };

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        ...styles.dashboardContainer,
        background: darkMode
          ? "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: darkMode ? "#ddd" : "#000",
      }}
    >
      <div style={styles.header}>
        <h2 style={styles.welcome}>Welcome, {userEmail}</h2>

        <button
          onClick={toggleDarkMode}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            backgroundColor: darkMode ? "#4a5568" : "#e2e8f0",
            color: darkMode ? "#edf2f7" : "#1a202c",
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      <div style={styles.generator}>
  <h3
    style={{ color: darkMode ? "#ddd" : "white", marginBottom: "10px" }}
  >
    🏋️ Generate a Workout
  </h3>
  <select
    value={selectedWorkoutType}
    onChange={(e) => setSelectedWorkoutType(e.target.value)}
    style={styles.select}
  >
    <option value="cardio">🏃 Cardio</option>
    <option value="strength">💪 Strength</option>
    <option value="hybrid">⚡ Hybrid</option>
  </select>
  <button onClick={handleGenerateWorkout} style={styles.generateButton}>
    🔄 Replace With Generated Workout
  </button>
</div>

<AddExerciseForm onAdd={handleAdd} userId={userId} />

      

      <div style={styles.listSection}>
        <ExerciseList
          exercises={exercises}
          onToggleComplete={handleToggleComplete}
          onDragEnd={handleDragEnd}
        />

        {/* Calendar with colored circles */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            calendarType="gregory"
            tileContent={({ date, view }) => {
              if (view !== "month") return null;

              const status = getDayStatus(date);

              const circleStyle = {
                display: "inline-block",
                width: "30px",
                height: "30px",
                lineHeight: "30px",
                borderRadius: "50%",
                textAlign: "center",
                color: status ? "white" : "inherit",
                backgroundColor:
                  status === "workout"
                    ? "#48bb78" // green
                    : status === "rest"
                    ? "#718096" // gray
                    : "transparent",
                fontWeight: "bold",
                fontSize: "14px",
                marginTop: "6px",
              };

              return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={circleStyle}>{date.getDate()}</div>
                </div>
              );
            }}
          />
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => markDate("workout")}
              style={{ ...styles.markButton, backgroundColor: "#48bb78" }}
            >
              ✅ Mark as Workout Day
            </button>
            <button
              onClick={() => markDate("rest")}
              style={{ ...styles.markButton, backgroundColor: "#718096" }}
            >
              💤 Mark as Rest Day
            </button>
          </div>
          <p
            style={{
              marginTop: "10px",
              fontWeight: "bold",
              color: darkMode ? "#fbd38d" : "#2d3748",
            }}
          >
            {selectedDate.toDateString()} is marked as:{" "}
            {getDayStatus(selectedDate) === "rest"
              ? "💤 Rest Day"
              : getDayStatus(selectedDate) === "workout"
              ? "✅ Workout Day"
              : "Not Set"}
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              color: darkMode ? "#a0aec0" : "#4a5568",
            }}
          >
            Select a date, then mark it below as workout or rest day.
          </p>
        </div>

        {exercises.length > 0 && (
          <>
            <button onClick={handleClearAll} style={styles.clearButton}>
              ❌ Clear All
            </button>
            <button onClick={handleDeleteLast} style={styles.deleteLastButton}>
              ⏪ Delete Last
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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    marginBottom: "30px",
    color: "inherit",
  },
  welcome: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  generator: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
  },
  select: {
    padding: "8px 12px",
    marginBottom: "10px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  generateButton: {
    padding: "10px 20px",
    backgroundColor: "#38b2ac",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
  listSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  markButton: {
    padding: "8px 12px",
    borderRadius: "4px",
    color: "white",
    border: "none",
    fontWeight: "bold",
    marginRight: "10px",
    cursor: "pointer",
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