import React, { useState, useEffect } from 'react';

function SprintPlanner() {
  const [backlog, setBacklog] = useState(() => {
    const saved = localStorage.getItem('backlog');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Login Page", storyPoints: 3, businessValue: 8, urgency: "High" },
      { id: 2, title: "Payment Gateway", storyPoints: 5, businessValue: 9, urgency: "High" },
      { id: 3, title: "Profile Page", storyPoints: 2, businessValue: 5, urgency: "Medium" }
    ];
  });
  const [sprintPlan, setSprintPlan] = useState(() => {
    const saved = localStorage.getItem('sprintPlan');
    return saved ? JSON.parse(saved) : { tasks: [], totalPoints: 0 };
  });
  const [teamCapacity, setTeamCapacity] = useState('');
  // Track previous sprint velocities
  const [velocityHistory, setVelocityHistory] = useState(() => {
    const saved = localStorage.getItem('velocityHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const averageVelocity = velocityHistory.length > 0 ? Math.round(velocityHistory.reduce((a, b) => a + b, 0) / velocityHistory.length) : '';

  // State for backlog management
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

  // Save backlog, sprint plan, and velocity history to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('backlog', JSON.stringify(backlog));
  }, [backlog]);
  useEffect(() => {
    localStorage.setItem('sprintPlan', JSON.stringify(sprintPlan));
  }, [sprintPlan]);
  useEffect(() => {
    localStorage.setItem('velocityHistory', JSON.stringify(velocityHistory));
  }, [velocityHistory]);

  // AI-based sprint planning: use average velocity as default capacity
  useEffect(() => {
    if (averageVelocity && !teamCapacity) {
      setTeamCapacity(averageVelocity);
    }
  }, [averageVelocity]);

  // Record completed points for the last sprint
  const [completedPoints, setCompletedPoints] = useState('');
  const handleRecordVelocity = () => {
    if (completedPoints && !isNaN(completedPoints) && Number(completedPoints) > 0) {
      setVelocityHistory(prev => [...prev, Number(completedPoints)]);
      setCompletedPoints('');
    }
  };

  // Enhanced AI planning: prioritize by weighted score (business value, urgency, story points)
  const urgencyWeight = { High: 2, Medium: 1, Low: 0.5 };
  const aiScore = (task) =>
    (task.businessValue * 2 + urgencyWeight[task.urgency] * 3) / task.storyPoints;

  const generateAISprint = (backlog, capacity) => {
    return backlog
      .slice()//copies the backlog data without changing the original data
      .sort((a, b) => aiScore(b) - aiScore(a))//sorts the backlog data in descending order of aiScore
      .reduce((sprint, task) => {//reduces the backlog data to a single object with tasks and totalPoints
        if (sprint.totalPoints + task.storyPoints <= capacity) {
          sprint.tasks.push(task);
          sprint.totalPoints += task.storyPoints;
        }
        return sprint;
      }, { tasks: [], totalPoints: 0 });
};

const handleGenerateSprint = () => {
    const plan = generateAISprint(backlog, teamCapacity);
    setSprintPlan(plan);
   // setTeamCapacity('');
  };
  const handleCapacityChange=(e)=>
  {
    const value=e.target.value;
    if(value===''|| (Number(value)>=0 && !isNaN(value)))
        setTeamCapacity(value);
  }

  const [aiPrediction, setAiPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictError, setPredictError] = useState(null);
  const [sprintVelocity, setSprintVelocity] = useState('');

  // Prepare numeric features for prediction
  const getNumericFeatures = () => {
    return {
      StoryPoints: backlog.reduce((sum, t) => sum + (t.storyPoints || 0), 0),
      BusinessValue: backlog.reduce((sum, t) => sum + (t.businessValue || 0), 0),
      DependencyCount: backlog.reduce((sum, t) => sum + (t.DependencyCount || 0), 0),
      TeamCapacity: Number(teamCapacity) || 0,
      SprintVelocity: Number(sprintVelocity) || 0,
      PlannedPoints: backlog.reduce((sum, t) => sum + (t.PlannedPoints || 0), 0),
      BlockedCount: backlog.reduce((sum, t) => sum + (t.BlockedCount || 0), 0)
    };
  };

  const handleAIPredict = async () => {
    setIsPredicting(true);
    setPredictError(null);
    setAiPrediction(null);
    try {
      const response = await fetch('https://optimizing-sprint-planning-in-scrum-r2bd.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getNumericFeatures()),
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setAiPrediction(data);
    } catch (err) {
      setPredictError('Prediction failed. Is the API running?');
    } finally {
      setIsPredicting(false);
    }
  };

  const [showSprintModal, setShowSprintModal] = useState(false);
  const [sprint, setSprint] = useState({ goal: '', start: '', end: '', capacity: '' });
  const [poTaskForm, setPoTaskForm] = useState({ title: '', description: '', businessValue: '', priority: 'Medium', storyPoints: '', acceptance: '' });
  const [selectedForSprint, setSelectedForSprint] = useState([]);

  // Sprint creation handlers
  const handleSprintChange = e => setSprint({ ...sprint, [e.target.name]: e.target.value });
  const handleCreateSprint = e => { e.preventDefault(); setShowSprintModal(false); };

  // Product Owner task form handlers
  const handlePoTaskChange = e => setPoTaskForm({ ...poTaskForm, [e.target.name]: e.target.value });
  const handleAddPoTask = e => {
    e.preventDefault();
    if (!poTaskForm.title || !poTaskForm.storyPoints || !poTaskForm.businessValue) return;
    setBacklog(prev => [
      ...prev,
      {
        id: Date.now(),
        title: poTaskForm.title,
        description: poTaskForm.description,
        businessValue: Number(poTaskForm.businessValue),
        priority: poTaskForm.priority,
        storyPoints: Number(poTaskForm.storyPoints),
        acceptance: poTaskForm.acceptance,
        status: 'todo',
      },
    ]);
    setPoTaskForm({ title: '', description: '', businessValue: '', priority: 'Medium', storyPoints: '', acceptance: '' });
  };

  // Select backlog items for sprint
  const handleSelectForSprint = id => {
    setSelectedForSprint(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };
  const selectedTasks = backlog.filter(t => selectedForSprint.includes(t.id));
  const totalSelectedPoints = selectedTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
  const sprintCapacity = Number(sprint.capacity) || 0;
  const fitMsg = totalSelectedPoints > sprintCapacity ? '⚠️ Over capacity!' : '✅ Fits capacity';

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow">
            <div className="card-header">
              <h2 className="card-title mb-0 text-center">
                <i className="fas fa-rocket me-2"></i>
                Sprint Planning Dashboard
              </h2>
            </div>
            <div className="card-body">
              {/* Sprint Planning Controls */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <h6 className="card-title text-muted mb-2">Team Capacity</h6>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={teamCapacity}
                        onChange={e => setTeamCapacity(e.target.value)}
                        min="0"
                        placeholder="Enter capacity"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <h6 className="card-title text-muted mb-2">Average Velocity</h6>
                      <h4 className="text-primary mb-0">
                        {averageVelocity ? averageVelocity : 'N/A'}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <button className="btn btn-primary btn-lg w-100" onClick={handleGenerateSprint}>
                        <i className="fas fa-magic me-2"></i>
                        Generate AI Sprint Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Velocity Tracking */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title text-muted mb-3">
                        <i className="fas fa-tachometer-alt me-2"></i>
                        Sprint Velocity
                      </h6>
                      <input
                        type="number"
                        className="form-control"
                        value={sprintVelocity}
                        onChange={e => setSprintVelocity(e.target.value)}
                        min="0"
                        placeholder="Enter sprint velocity"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title text-muted mb-3">
                        <i className="fas fa-chart-line me-2"></i>
                        Record Completed Points
                      </h6>
                      <div className="d-flex gap-2">
                        <input
                          type="number"
                          className="form-control"
                          value={completedPoints}
                          onChange={e => setCompletedPoints(e.target.value)}
                          min="1"
                          placeholder="Points completed"
                        />
                        <button className="btn btn-success" onClick={handleRecordVelocity}>
                          <i className="fas fa-save me-1"></i>
                          Record
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backlog Management */}
              <div className="card border-0 bg-light mb-4">
                <div className="card-header">
                  <h3 className="card-title mb-0">
                    <i className="fas fa-list-ul me-2"></i>
                    Backlog Management
                  </h3>
                </div>
                <div className="card-body">
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
                        <button type="button" className="btn btn-secondary" onClick={() => { setIsEditing(false); setTaskForm({ id: null, title: '', storyPoints: '', businessValue: '', urgency: 'Medium' }); }}>
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
                        {backlog.map(task => (
                          <tr key={task.id}>
                            <td>{task.title}</td>
                            <td><span className="badge badge-primary">{task.storyPoints}</span></td>
                            <td><span className="badge badge-success">{task.businessValue}</span></td>
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

              {/* AI Recommendations */}
              <div className="card border-0 bg-light mb-4">
                <div className="card-header">
                  <h3 className="card-title mb-0">
                    <i className="fas fa-brain me-2"></i>
                    AI Recommendations
                  </h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h5 className="text-muted mb-3">Recommended Tasks for Sprint:</h5>
                      <div className="list-group">
                        {sprintPlan.tasks.map(task => (
                          <div key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">{task.title}</h6>
                              <small className="text-muted">
                                Points: <span className="badge badge-primary">{task.storyPoints}</span> | 
                                Value: <span className="badge badge-success">{task.businessValue}</span>
                              </small>
                            </div>
                            <span className="badge badge-primary rounded-pill">
                              {task.storyPoints} pts
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 bg-primary text-white">
                        <div className="card-body text-center">
                          <h6 className="card-title">Total Points</h6>
                          <h2 className="mb-0">{sprintPlan.totalPoints}</h2>
                          <small>Recommended for this sprint</small>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button className="btn btn-info w-100" onClick={handleAIPredict} disabled={isPredicting}>
                          {isPredicting ? (
                            <>
                              <span className="loading me-2"></span>
                              Predicting...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-chart-line me-2"></i>
                              AI Predict Completion
                            </>
                          )}
                        </button>
                        {aiPrediction && (
                          <div className="alert alert-success mt-3">
                            <h6 className="alert-heading">AI Predictions:</h6>
                            <div className="row">
                              <div className="col-6">
                                <strong>Random Forest:</strong><br/>
                                <span className="h5 text-success">{aiPrediction.random_forest_prediction}</span>
                              </div>
                              <div className="col-6">
                                <strong>XGBoost:</strong><br/>
                                <span className="h5 text-success">{aiPrediction.xgboost_prediction}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        {predictError && (
                          <div className="alert alert-danger mt-3">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            {predictError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sprint Creation */}
              <div className="card border-0 bg-light mb-4">
                <div className="card-header">
                  <h3 className="card-title mb-0">
                    <i className="fas fa-calendar-plus me-2"></i>
                    Sprint Management
                  </h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <button className="btn btn-primary btn-lg w-100 mb-3" onClick={() => setShowSprintModal(true)}>
                        <i className="fas fa-plus me-2"></i>
                        Create New Sprint
                      </button>
                      
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h6 className="card-title text-muted mb-3">
                            <i className="fas fa-user-tie me-2"></i>
                            Product Owner Task Form
                          </h6>
                          <form onSubmit={handleAddPoTask} className="row g-2">
                            <div className="col-12">
                              <input name="title" className="form-control mb-2" placeholder="Task Title" value={poTaskForm.title} onChange={handlePoTaskChange} required />
                            </div>
                            <div className="col-12">
                              <textarea name="description" className="form-control mb-2" placeholder="Description" value={poTaskForm.description} onChange={handlePoTaskChange} rows="2"></textarea>
                            </div>
                            <div className="col-4">
                              <input name="businessValue" type="number" className="form-control" placeholder="Value" value={poTaskForm.businessValue} onChange={handlePoTaskChange} required />
                            </div>
                            <div className="col-4">
                              <select name="priority" className="form-select" value={poTaskForm.priority} onChange={handlePoTaskChange}>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                              </select>
                            </div>
                            <div className="col-4">
                              <input name="storyPoints" type="number" className="form-control" placeholder="Points" value={poTaskForm.storyPoints} onChange={handlePoTaskChange} required />
                            </div>
                            <div className="col-12">
                              <input name="acceptance" className="form-control mb-2" placeholder="Acceptance Criteria" value={poTaskForm.acceptance} onChange={handlePoTaskChange} />
                            </div>
                            <div className="col-12">
                              <button type="submit" className="btn btn-success w-100">
                                <i className="fas fa-plus me-2"></i>
                                Add Task
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h6 className="card-title text-muted mb-3">
                            <i className="fas fa-tasks me-2"></i>
                            Select Backlog Items for Sprint
                          </h6>
                          <div className="list-group">
                            {backlog.map(task => (
                              <div key={task.id} className="list-group-item d-flex align-items-center">
                                <input 
                                  type="checkbox" 
                                  className="form-check-input me-3" 
                                  checked={selectedForSprint.includes(task.id)} 
                                  onChange={() => handleSelectForSprint(task.id)} 
                                />
                                <div className="flex-grow-1">
                                  <h6 className="mb-1">{task.title}</h6>
                                  <small className="text-muted">
                                    Points: {task.storyPoints} | Value: {task.businessValue} | Priority: {task.priority}
                                  </small>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 p-3 bg-light rounded">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Total Points: <strong>{totalSelectedPoints}</strong></span>
                              <span>Capacity: <strong>{sprintCapacity}</strong></span>
                            </div>
                            <div className="mt-2">
                              <div className="progress">
                                <div 
                                  className="progress-bar" 
                                  style={{width: `${Math.min((totalSelectedPoints / sprintCapacity) * 100, 100)}%`}}
                                ></div>
                              </div>
                              <small className={`mt-1 d-block ${totalSelectedPoints > sprintCapacity ? 'text-danger' : 'text-success'}`}>
                                {fitMsg}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sprint Creation Modal */}
              {showSprintModal && (
                <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <form onSubmit={handleCreateSprint}>
                        <div className="modal-header">
                          <h5 className="modal-title">
                            <i className="fas fa-calendar-plus me-2"></i>
                            Create New Sprint
                          </h5>
                          <button type="button" className="btn-close" onClick={() => setShowSprintModal(false)}></button>
                        </div>
                        <div className="modal-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <label className="form-label">Sprint Goal</label>
                              <input name="goal" className="form-control" placeholder="What do you want to achieve in this sprint?" value={sprint.goal} onChange={handleSprintChange} required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Start Date</label>
                              <input name="start" type="date" className="form-control" value={sprint.start} onChange={handleSprintChange} required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">End Date</label>
                              <input name="end" type="date" className="form-control" value={sprint.end} onChange={handleSprintChange} required />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Team Capacity</label>
                              <input name="capacity" type="number" className="form-control" placeholder="Total story points capacity" value={sprint.capacity} onChange={handleSprintChange} required />
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={() => setShowSprintModal(false)}>
                            <i className="fas fa-times me-2"></i>
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-primary">
                            <i className="fas fa-save me-2"></i>
                            Create Sprint
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SprintPlanner;
