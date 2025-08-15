import logo from './logo.svg';
import './App.css';
import SprintPlanner from './components/SprintPlanner';
import KanbanBoard from './components/KanbanBoard';
import DailyStandup from './components/DailyStandup';
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom';
import React, { useState } from 'react';
import BacklogManagement from './components/BacklogManagement';
import { BacklogProvider } from "./components/BacklogContext";
import SignIn from './components/SignIn';
import TalkingTom from './components/TalkingTom';
import SignUpPage from './components/SignUpPage';
import { AuthProvider } from './components/AuthContext';
import NavBar from './components/NavBar';
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
    <AuthProvider>
    <BacklogProvider>
    <BrowserRouter>
    
      <NavBar/>
      <Routes>
        <Route path="/backlog" element={<BacklogManagement/>}></Route>
        <Route path="/sprint-planner" element={<SprintPlanner/>}></Route>
        <Route path="/kanban" element={<div className="container my-4"><h2>Kanban Board</h2><KanbanBoard tasks={kanbanTasks} onStatusChange={handleStatusChange} onUpdateTask={handleUpdateTask} /></div>}></Route>
        <Route path="/standup" element={<DailyStandup/>}></Route>
        <Route path="/signin" element={<SignIn/>}></Route>
        <Route path='/signup' element={<SignUpPage/>}></Route>
        <Route path='/' element={<TalkingTom/>}></Route>
      </Routes>
    </BrowserRouter>
    </BacklogProvider>
    </AuthProvider>
    
  );
}

export default App;
