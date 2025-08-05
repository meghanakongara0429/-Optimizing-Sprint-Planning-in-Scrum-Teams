import React, { useState } from 'react';

function DailyStandup() {
  const [updates, setUpdates] = useState([]);
  const [form, setForm] = useState({ name: '', yesterday: '', today: '', blockers: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.today) return;
    setUpdates(prev => [
      ...prev,
      { ...form, date: new Date().toLocaleDateString() }
    ]);
    setForm({ name: '', yesterday: '', today: '', blockers: '' });
  };

  return (
    <div className="container my-4">
      <h2>Daily Stand-up</h2>
      <form className="row g-2 align-items-end mb-4" onSubmit={handleSubmit}>
        <div className="col-md-2"><input name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required /></div>
        <div className="col-md-3"><input name="yesterday" className="form-control" placeholder="What did you do yesterday?" value={form.yesterday} onChange={handleChange} /></div>
        <div className="col-md-3"><input name="today" className="form-control" placeholder="What will you do today?" value={form.today} onChange={handleChange} required /></div>
        <div className="col-md-3"><input name="blockers" className="form-control" placeholder="Blockers?" value={form.blockers} onChange={handleChange} /></div>
        <div className="col-md-1"><button type="submit" className="btn btn-success">Add</button></div>
      </form>
      <h4>Team Updates</h4>
      <table className="table table-bordered">
        <thead><tr><th>Date</th><th>Name</th><th>Yesterday</th><th>Today</th><th>Blockers</th></tr></thead>
        <tbody>
          {updates.map((u, i) => (
            <tr key={i}>
              <td>{u.date}</td>
              <td>{u.name}</td>
              <td>{u.yesterday}</td>
              <td>{u.today}</td>
              <td>{u.blockers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DailyStandup; 