export default function ExerciseList({ exercises }) {
  return (
    <div style={styles.listCard}>
      <h2 style={styles.title}>Your Exercises</h2>
      {exercises.length === 0 && <p>No exercises added yet.</p>}
      {exercises.map((ex) => (
        <div key={ex.id} style={styles.item}>
          <strong>{ex.name}</strong><br />
          Duration: {ex.duration} min<br />
          Reps: {ex.reps || "N/A"}<br />
          Type: {ex.type}
        </div>
      ))}
    </div>
  );
}

const styles = {
  listCard: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
    width: "340px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  title: {
    marginBottom: "24px",
    color: "#333",
    textAlign: "center",
  },
  item: {
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "10px",
    color: "#333",
    fontWeight: "600",
  },
};