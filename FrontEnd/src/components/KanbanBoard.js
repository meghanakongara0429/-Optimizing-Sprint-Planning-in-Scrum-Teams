import React from "react";

const columns = [
  { key: "todo", label: "To Do", bgColor: "#f9eaea", borderColor: "#f28b82" },
  { key: "inprogress", label: "In Progress", bgColor: "#e7f3fe", borderColor: "#4285f4" },
  { key: "review", label: "Review", bgColor: "#fff4e5", borderColor: "#fbbc04" },
  { key: "done", label: "Done", bgColor: "#e6f4ea", borderColor: "#34a853" },
];

function KanbanBoard({ tasks, onStatusChange, onUpdateTask }) {
  const handleFieldChange = (id, field, value) => {
    onUpdateTask && onUpdateTask(id, field, value);
  };

  return (
    <div className="row mt-4 g-3">
      {columns.map((col) => (
        <div className="col-md-3" key={col.key}>
          <div
            className="card"
            style={{
              backgroundColor: col.bgColor,
              border: `2px solid ${col.borderColor}`,
              borderRadius: "10px",
              boxShadow: `0 4px 12px ${col.borderColor}50`,
            }}
          >
            <div
              className="card-header text-center fw-bold"
              style={{ backgroundColor: col.borderColor, color: "black", borderRadius: "8px 8px 0 0" }}
            >
              {col.label}
            </div>
            <div className="card-body" style={{ minHeight: 300 }}>
              {tasks.filter((t) => t.status === col.key).map((task) => (
                <div
                  className="card mb-3"
                  key={task.id}
                  style={{
                    borderLeft: `6px solid ${col.borderColor}`,
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div className="card-body p-3">
                    <div className="fw-bold mb-2">{task.title}</div>
                    <div className="small text-muted mb-2 d-flex align-items-center gap-3">
                      <div>
                        Assignee:{" "}
                        <input
                          type="text"
                          className="form-control form-control-sm d-inline-block"
                          style={{ width: 100 }}
                          value={task.assignee || ""}
                          onChange={(e) => handleFieldChange(task.id, "assignee", e.target.value)}
                          placeholder="Name"
                          title="Edit Assignee"
                        />
                      </div>
                      <div>
                        Points:{" "}
                        <input
                          type="number"
                          className="form-control form-control-sm d-inline-block"
                          style={{ width: 70 }}
                          value={task.storyPoints || ""}
                          onChange={(e) => handleFieldChange(task.id, "storyPoints", e.target.value)}
                          min={1}
                          title="Edit Story Points"
                        />
                      </div>
                    </div>
                    <div className="small text-muted mb-3">Value: {task.businessValue}</div>
                    <div>
                      {columns
                        .filter((c) => c.key !== col.key)
                        .map((c) => (
                          <button
                            key={c.key}
                            className="btn btn-sm"
                            style={{
                              backgroundColor: c.borderColor,
                              color: "white",
                              marginRight: "6px",
                              marginBottom: "6px",
                              border: "none",
                              borderRadius: "4px",
                              transition: "background-color 0.3s ease",
                            }}
                            onClick={() => onStatusChange(task.id, c.key)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#000000cc")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = c.borderColor)}
                            title={`Move task to ${c.label}`}
                          >
                            {c.label}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
              {tasks.filter((t) => t.status === col.key).length === 0 && (
                <p className="text-muted text-center fst-italic mt-4">No tasks here</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;
