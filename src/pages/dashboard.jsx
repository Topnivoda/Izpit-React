import { useEffect, useState } from "react";
import axios from "axios";
import AddExerciseForm from "../components/AddExerciseForm";

export default function Dashboard() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/exercises")
      .then(res => {
        setExercises(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load exercises");
        setLoading(false);
      });
  }, []);

  const handleAdd = (newExercise) => {
    setExercises(prev => [...prev, newExercise]);
  };

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Exercises</h1>
      <ul>
        {exercises.map(ex => (
          <li key={ex.id}>
            {ex.name} — {ex.duration} min ({ex.type})
          </li>
        ))}
      </ul>

      <AddExerciseForm onAdd={handleAdd} />
    </div>
  );
}