import React from 'react';
const columns = [
  { key: 'todo', label: 'To Do' },
  { key: 'inprogress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' }
];

function KanbanBoard({ tasks, onStatusChange, onUpdateTask }) {
  const handleFieldChange = (id, field, value) => {
    onUpdateTask && onUpdateTask(id, field, value);
  };
  return (
    <div className="row mt-4">
      {columns.map(col => (
        <div className="col-md-3" key={col.key}>
          <div className="card">
            <div className="card-header text-center fw-bold">{col.label}</div>
            <div className="card-body" style={{ minHeight: 200 }}>
              {tasks.filter(t => t.status === col.key).map(task => (
                <div className="card mb-2" key={task.id}>
                  <div className="card-body p-2">
                    <div className="fw-bold">{task.title}</div>
                    <div className="small text-muted mb-1">
                      Assignee: <input type="text" className="form-control form-control-sm d-inline-block w-auto" style={{width: 80}} value={task.assignee || ''} onChange={e => handleFieldChange(task.id, 'assignee', e.target.value)} />
                      &nbsp;| Points: <input type="number" className="form-control form-control-sm d-inline-block w-auto" style={{width: 60}} value={task.storyPoints || ''} onChange={e => handleFieldChange(task.id, 'storyPoints', e.target.value)} />
                    </div>
                    <div className="small text-muted">Value: {task.businessValue}</div>
                    <div className="mt-2">
                      {columns.filter(c => c.key !== col.key).map(c => (
                        <button
                          key={c.key}
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => onStatusChange(task.id, c.key)}
                        >
                          Move to {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard; 