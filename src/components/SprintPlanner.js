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
      const response = await fetch('http://127.0.0.1:5000/predict', {
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
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4 text-center">Sprint Planner</h2>
              <div className="mb-3">
                <label className="form-label">
                  Team Capacity:
                  <input
                    type="number"
                    className="form-control d-inline-block w-auto ms-2"
                    value={teamCapacity}
                    onChange={e => setTeamCapacity(e.target.value)}
                    min="0"
                  />
                </label>
                <button className="btn btn-primary ms-3" onClick={handleGenerateSprint}>
                  Generate AI Sprint Plan
                </button>
                {averageVelocity && (
                  <span className="ms-3 text-muted">Avg. Velocity: {averageVelocity}</span>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Sprint Velocity:
                  <input
                    type="number"
                    className="form-control d-inline-block w-auto ms-2"
                    value={sprintVelocity}
                    onChange={e => setSprintVelocity(e.target.value)}
                    min="0"
                  />
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Record completed points for last sprint:
                  <input
                    type="number"
                    className="form-control d-inline-block w-auto ms-2"
                    value={completedPoints}
                    onChange={e => setCompletedPoints(e.target.value)}
                    min="1"
                  />
                </label>
                <button className="btn btn-outline-success ms-2" onClick={handleRecordVelocity}>
                  Record Velocity
                </button>
              </div>

              <h3 className="mt-4">Backlog</h3>
              <form onSubmit={isEditing ? handleUpdateTask : handleAddTask} className="row g-2 align-items-end mb-3">
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
                        <td>{task.storyPoints}</td>
                        <td>{task.businessValue}</td>
                        <td>{task.urgency}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditTask(task)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="mt-4">Recommended Tasks:</h3>
              <ul className="list-group">
                {sprintPlan.tasks.map(task => (
                  <li key={task.id} className="list-group-item">
                    {task.title} (Points: {task.storyPoints}, Value: {task.businessValue})
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <button className="btn btn-info" onClick={handleAIPredict} disabled={isPredicting}>
                  {isPredicting ? 'Predicting...' : 'AI Predict Actual Points Completed'}
                </button>
                {aiPrediction && (
                  <div className="alert alert-success mt-3">
                    <b>Random Forest:</b> {aiPrediction.random_forest_prediction}<br/>
                    <b>XGBoost:</b> {aiPrediction.xgboost_prediction}
                  </div>
                )}
                {predictError && <div className="alert alert-danger mt-3">{predictError}</div>}
              </div>

              {/* Add Sprint Creation modal, PO task form, backlog selection, and fit summary */}
              <button className="btn btn-primary mb-3" onClick={() => setShowSprintModal(true)}>Create Sprint</button>
              {showSprintModal && (
                <div className="modal show d-block" tabIndex="-1">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <form onSubmit={handleCreateSprint}>
                        <div className="modal-header"><h5 className="modal-title">Create Sprint</h5></div>
                        <div className="modal-body">
                          <input name="goal" className="form-control mb-2" placeholder="Sprint Goal" value={sprint.goal} onChange={handleSprintChange} required />
                          <input name="start" type="date" className="form-control mb-2" value={sprint.start} onChange={handleSprintChange} required />
                          <input name="end" type="date" className="form-control mb-2" value={sprint.end} onChange={handleSprintChange} required />
                          <input name="capacity" type="number" className="form-control mb-2" placeholder="Team Capacity" value={sprint.capacity} onChange={handleSprintChange} required />
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={() => setShowSprintModal(false)}>Cancel</button>
                          <button type="submit" className="btn btn-primary">Create</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
              <form className="row g-2 align-items-end mb-3" onSubmit={handleAddPoTask}>
                <div className="col-md-2"><input name="title" className="form-control" placeholder="Title" value={poTaskForm.title} onChange={handlePoTaskChange} required /></div>
                <div className="col-md-2"><input name="description" className="form-control" placeholder="Description" value={poTaskForm.description} onChange={handlePoTaskChange} /></div>
                <div className="col-md-1"><input name="businessValue" type="number" className="form-control" placeholder="Value" value={poTaskForm.businessValue} onChange={handlePoTaskChange} required /></div>
                <div className="col-md-1"><select name="priority" className="form-select" value={poTaskForm.priority} onChange={handlePoTaskChange}><option>High</option><option>Medium</option><option>Low</option></select></div>
                <div className="col-md-1"><input name="storyPoints" type="number" className="form-control" placeholder="Points" value={poTaskForm.storyPoints} onChange={handlePoTaskChange} required /></div>
                <div className="col-md-3"><input name="acceptance" className="form-control" placeholder="Acceptance Criteria" value={poTaskForm.acceptance} onChange={handlePoTaskChange} /></div>
                <div className="col-md-2"><button type="submit" className="btn btn-success">Add Task</button></div>
              </form>
              <h4>Select Backlog Items for Sprint</h4>
              <ul className="list-group mb-2">
                {backlog.map(task => (
                  <li key={task.id} className="list-group-item d-flex align-items-center">
                    <input type="checkbox" className="form-check-input me-2" checked={selectedForSprint.includes(task.id)} onChange={() => handleSelectForSprint(task.id)} />
                    <span className="fw-bold">{task.title}</span> (Points: {task.storyPoints}, Value: {task.businessValue}, Priority: {task.priority})
                  </li>
                ))}
              </ul>
              <div className="mb-3">Total Points: {totalSelectedPoints} / Capacity: {sprintCapacity} <span className="ms-2">{fitMsg}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SprintPlanner;
