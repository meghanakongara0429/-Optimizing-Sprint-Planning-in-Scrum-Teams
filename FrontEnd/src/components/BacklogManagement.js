import React, { useContext, useState } from 'react';
import { BacklogContext } from './BacklogContext.js';

function BacklogManagement() {
  const { backlog, setBacklog } = useContext(BacklogContext);

  const [taskForm, setTaskForm] = useState({
    id: null,
    title: '',
    storyPoints: '',
    businessValue: '',
    urgency: 'Medium',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.storyPoints || !taskForm.businessValue) return;
    setBacklog((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: taskForm.title,
        storyPoints: Number(taskForm.storyPoints),
        businessValue: Number(taskForm.businessValue),
        urgency: taskForm.urgency,
      },
    ]);
    setTaskForm({ id: null, title: '', storyPoints: '', businessValue: '', urgency: 'Medium' });
  };

  const handleEditTask = (task) => {
    setTaskForm({
      id: task.id,
      title: task.title,
      storyPoints: task.storyPoints,
      businessValue: task.businessValue,
      urgency: task.urgency,
    });
    setIsEditing(true);
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    setBacklog((prev) =>
      prev.map((task) =>
        task.id === taskForm.id
          ? {
              ...task,
              title: taskForm.title,
              storyPoints: Number(taskForm.storyPoints),
              businessValue: Number(taskForm.businessValue),
              urgency: taskForm.urgency,
            }
          : task
      )
    );
    setTaskForm({ id: null, title: '', storyPoints: '', businessValue: '', urgency: 'Medium' });
    setIsEditing(false);
  };

  const handleDeleteTask = (id) => {
    setBacklog((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="card border-0 bg-light mb-4">
      <div className="card-header">
        <h3 className="card-title mb-0">
          <i className="fas fa-list-ul me-2"></i>
          Backlog Management
        </h3>
      </div>
      <div className="card-body">
        {/* Attractive welcome message */}
       <div
  className="alert mb-4 rounded-4 shadow-sm d-flex align-items-center"
  role="alert"
  style={{
    fontSize: '1.1rem',
    fontWeight: '500',
    lineHeight: '1.4',
    color: '#2f4f4f',  // dark slate gray text for better readability
    background: 'linear-gradient(90deg, #f0f9f4 0%, #c7e9d9 100%)', // soft pale green gradient
    border: '1px solid #a6d8c9', // gentle mint border
  }}
>
  <span
    style={{
      fontSize: '2rem',
      marginRight: '12px',
      animation: 'pulse 2.5s infinite',
      userSelect: 'none',
      color: '#4a7c59' // muted green for the icon
    }}
    aria-hidden="true"
  >
    👋
  </span>
  <div style={{ flexGrow: 1 }}>
    <strong>Welcome!</strong> Here you can <em>add</em>, <em>edit</em>, and <em>prioritize</em> your project requirements with ease.
    Keep your tasks organized and empower your team to deliver amazing results smoothly. 🚀
  </div>
  <button
    onClick={() => window.open('https://www.scrumguides.org/scrum-guide.html', '_blank')}
    style={{
      marginLeft: '15px',
      padding: '6px 14px',
      border: 'none',
      borderRadius: '20px',
      backgroundColor: '#609c87', // medium pastel green
      color: 'white',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      boxShadow: '0 2px 5px rgba(96,156,135,0.4)',
      transition: 'background-color 0.3s ease',
    }}
    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#497a69')} // darker shade on hover
    onMouseOut={e => (e.currentTarget.style.backgroundColor = '#609c87')}
  >
    Learn Scrum
  </button>

  <style>{`
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.7; }
    }
  `}</style>
</div>

        <form onSubmit={isEditing ? handleUpdateTask : handleAddTask} className="row g-3 align-items-end mb-3">
          <div className="col-md-3">
            <input
              name="title"
              className="form-control"
              placeholder="Title"
              value={taskForm.title}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              name="storyPoints"
              type="number"
              className="form-control"
              placeholder="Story Points"
              value={taskForm.storyPoints}
              onChange={handleFormChange}
              min="1"
              required
            />
          </div>
          <div className="col-md-2">
            <input
              name="businessValue"
              type="number"
              className="form-control"
              placeholder="Business Value"
              value={taskForm.businessValue}
              onChange={handleFormChange}
              min="1"
              required
            />
          </div>
          <div className="col-md-2">
            <select name="urgency" className="form-select" value={taskForm.urgency} onChange={handleFormChange}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="col-md-3">
            <button type="submit" className={`btn ${isEditing ? 'btn-warning' : 'btn-success'} me-2`}>
              {isEditing ? 'Update Task' : 'Add Task'}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setTaskForm({ id: null, title: '', storyPoints: '', businessValue: '', urgency: 'Medium' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Points</th>
                <th>Value</th>
                <th>Urgency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {backlog.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>
                    <span className="badge bg-primary">{task.storyPoints}</span>
                  </td>
                  <td>
                    <span className="badge bg-success">{task.businessValue}</span>
                  </td>
                  <td>
                    <span className={`status-badge status-${task.urgency.toLowerCase()}`}>
                      {task.urgency}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditTask(task)}>
                      <i className="fas fa-edit me-1"></i>Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTask(task.id)}>
                      <i className="fas fa-trash me-1"></i>Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BacklogManagement;
