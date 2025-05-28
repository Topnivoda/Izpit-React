import { useState } from "react";
import axios from "axios";

export default function AddExerciseForm({ onAdd }) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !duration || !type) {
      setError("Please fill in all fields");
      return;
    }

    const durationNum = Number(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      setError("Duration must be a positive number");
      return;
    }

    setError("");

    axios.post("http://localhost:3001/exercises", {
      name,
      duration: durationNum,
      type
    })
    .then(res => {
      onAdd(res.data);
      setName("");
      setDuration("");
      setType("");
    })
    .catch(() => setError("Failed to add exercise"));
  };

  return (
    <form onSubmit={handleSubmit} style={{marginTop: "20px"}}>
      <h2>Add New Exercise</h2>
      <input
        type="text"
        placeholder="Exercise Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={e => setDuration(e.target.value)}
      />
      <input
        type="text"
        placeholder="Type (e.g., Cardio, Strength)"
        value={type}
        onChange={e => setType(e.target.value)}
      />
      <button type="submit">Add Exercise</button>
      {error && <p style={{color: "red"}}>{error}</p>}
    </form>
  );
}