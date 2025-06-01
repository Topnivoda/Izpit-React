import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ExerciseList({ exercises, onToggleComplete, onDragEnd }) {
  return (
    <div style={styles.listCard}>
      <h2 style={styles.title}>Your Exercises</h2>
      {exercises.length === 0 && <p>No exercises added yet.</p>}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="exercises-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {exercises.map((ex, index) => (
                <Draggable key={ex.id} draggableId={ex.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...styles.item,
                        ...(ex.completed ? styles.completedItem : {}),
                        backgroundColor: snapshot.isDragging ? "#e0f7fa" : "#fff",
                        boxShadow: snapshot.isDragging
                          ? "0 4px 8px rgba(0,0,0,0.2)"
                          : "none",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={!!ex.completed}
                          onChange={() => onToggleComplete(ex)}
                          style={styles.checkbox}
                        />
                        <span style={{ textDecoration: ex.completed ? "line-through" : "none" }}>
                          <strong>{ex.name}</strong>
                        </span>
                      </label>
                      <div style={styles.details}>
                        Duration: {ex.duration || "N/A"}<br />
                        Reps: {ex.reps || "N/A"}<br />
                        Type: {ex.type}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
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
    padding: "10px",
    marginBottom: "10px",
    color: "#333",
    fontWeight: "600",
    borderRadius: "4px",
  },
  completedItem: {
    color: "#888",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  checkbox: {
    transform: "scale(1.2)",
    cursor: "pointer",
  },
  details: {
    marginTop: "5px",
    fontSize: "14px",
    fontWeight: "normal",
  },
};