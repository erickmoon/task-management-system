import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LogTask.css';
import moment from 'moment';

const SMTPSettings = ({ onSave }) => {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [smtpResponse, setSmtpResponse] = useState(null);

  useEffect(() => {
    fetchSMTPSettings();
  }, []);

  const fetchSMTPSettings = async () => {
    try {
      const res = await axios.get('http://localhost:5001/smtp-settings');
      if (res.data) {
        setHost(res.data.host);
        setPort(res.data.port);
        setUser(res.data.user);
        setPassword(res.data.password);
      }
    } catch (error) {
      console.error('Error fetching SMTP settings', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/smtp-settings', {
        host,
        port,
        user,
        password,
      });
      setSmtpResponse('SMTP settings saved');
      onSave();
    } catch (error) {
      console.error('Error saving SMTP settings', error);
      setSmtpResponse('Error saving SMTP settings');
    }
  };

  return (
    <div className="smtp-settings-container">
      <h2>SMTP Settings</h2>
      <form align="left" className="smtp-settings-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>Host</label>
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Port</label>
          <input
            type="text"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save Settings</button>
      </form>
      {smtpResponse && <div className="response-message">{smtpResponse}</div>}
    </div>
  );
};

const LogTask = () => {
  const [issue, setIssue] = useState('');
  const [category, setCategory] = useState('');
  const [assignee, setAssignee] = useState('');
  const [complainantEmail, setComplainantEmail] = useState('');
  const [response, setResponse] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const categories = ['Bug', 'Feature Request', 'Customer Support', 'Maintenance', 'Other'];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5001/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/tasks', {
        issue,
        category,
        assignee,
        complainantEmail,
      });
      setResponse(res.data);
      setError(null); // Clear any previous error
      fetchTasks(); // Refresh tasks list after adding a new task
    } catch (error) {
      console.error('Error logging task', error);
      setError(error.response.data); // Set the error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {

    try {
      await axios.delete(`http://localhost:5001/tasks/${id}`);
      fetchTasks(); // Refresh tasks list after deletion
    } catch (error) {
      console.error('Error deleting task', error);
    }
    
  };

  const filteredTasks = tasks.filter(task => {
    const taskDate = moment(task.createdAt);
    const fromDate = filterDateFrom ? moment(filterDateFrom) : null;
    const toDate = filterDateTo ? moment(filterDateTo).endOf('day') : null;

    const matchesCategory = filterCategory ? task.category === filterCategory : true;
    const matchesDateFrom = fromDate ? taskDate.isSameOrAfter(fromDate) : true;
    const matchesDateTo = toDate ? taskDate.isSameOrBefore(toDate) : true;

    return matchesCategory && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="log-task-container">
      <div className="main-container">
        <div className="form-table-container">
          <div className="form-container">
            <h2>Log a New Task</h2>
            <form align="left" className="log-task-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Issue</label>
                <input
                  type="text"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Enter issue"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Assignee</label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="Enter assignee"
                  required
                />
              </div>
              <div className="form-group">
                <label>Complainant Email</label>
                <input
                  type="email"
                  value={complainantEmail}
                  onChange={(e) => setComplainantEmail(e.target.value)}
                  placeholder="Enter complainant email"
                  required
                />
              </div>
              <button type="submit">Log Task</button>
              {isLoading && <div className="loader">Logging Task...</div>}
            </form>
            {response && (
              <div className="response-message">
                <p>{response.message}</p>
                <p>Tracking Number: {response.trackingNumber}</p>
              </div>
            )}
            {error && (
              <div className="error-message">
                <p>Error: {error.error}</p>
              </div>
            )}

            <h2>Previous Tasks</h2>

            <div className="filter-container">
              <div className="filter-group">
                <label htmlFor="filter-category">Category</label>
                <select
                  id="filter-category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="filter-date-from">From</label>
                <input
                  id="filter-date-from"
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="filter-date-to">To</label>
                <input
                  id="filter-date-to"
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                />
              </div>
            </div>

            <div className="tasks-table-container">
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>Open Date-Time</th>
                    <th>Issue</th>
                    <th>Category</th>
                    <th>Assignee</th>
                    <th>Complainant Email</th>
                    <th>Tracking Number</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id}>
                      <td>{moment(task.createdAt).format('DD-MMM-YYYY h:mm A')}</td>
                      <td>{task.issue}</td>
                      <td>{task.category}</td>
                      <td>{task.assignee}</td>
                      <td>{task.complainantEmail}</td>
                      <td>{task.trackingNumber}</td>
                      <td>
                        <button onClick={() => handleDelete(task.id)} className="delete-button">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <SMTPSettings onSave={fetchTasks} />
      </div>
    </div>
  );
};

export default LogTask;