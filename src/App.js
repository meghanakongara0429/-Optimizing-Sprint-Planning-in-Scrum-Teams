import logo from './logo.svg';
import './App.css';
import SprintPlanner from './components/SprintPlanner';
import KanbanBoard from './components/KanbanBoard';
import DailyStandup from './components/DailyStandup';
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom';
import React, { useState } from 'react';

function Backlog() {
  return (
    <div className="container my-4">
      <h2>Backlog Management</h2>
      <p>Manage your backlog and plan your sprints.</p>
      <Link to="/sprint-planner" className="btn btn-primary">Go to Sprint Planner</Link>
    </div>
  );
}

function App() {
  // Demo tasks for Kanban
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 1, title: "Login Page", storyPoints: 3, businessValue: 8, status: 'todo', assignee: '' },
    { id: 2, title: "Payment Gateway", storyPoints: 5, businessValue: 9, status: 'inprogress', assignee: '' },
    { id: 3, title: "Profile Page", storyPoints: 2, businessValue: 5, status: 'done', assignee: '' }
  ]);
  const handleStatusChange = (id, newStatus) => {
    setKanbanTasks(tasks => tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };
  const handleUpdateTask = (id, field, value) => {
    setKanbanTasks(tasks => tasks.map(t => t.id === id ? { ...t, [field]: field === 'storyPoints' ? Number(value) : value } : t));
  };

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Sprint Planner</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/backlog">Backlog</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sprint-planner">Sprint Planner</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/kanban">Kanban Board</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/standup">Daily Standup</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/backlog" element={<Backlog/>}></Route>
        <Route path="/sprint-planner" element={<SprintPlanner/>}></Route>
        <Route path="/kanban" element={<div className="container my-4"><h2>Kanban Board</h2><KanbanBoard tasks={kanbanTasks} onStatusChange={handleStatusChange} onUpdateTask={handleUpdateTask} /></div>}></Route>
        <Route path="/standup" element={<DailyStandup/>}></Route>
        <Route path="/" element={<Backlog/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
