import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, Check, X, LogOut, Mail } from 'lucide-react';

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Login Component
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    // Store credentials in session storage
    sessionStorage.setItem('user', JSON.stringify({ email, loggedIn: true }));
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Task Manager</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

// Task Form Component
const TaskForm = ({ onAddTask, editingTask, onUpdateTask, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
    }
  }, [editingTask]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      status: editingTask ? editingTask.status : 'Pending'
    };

    if (editingTask) {
      onUpdateTask({ ...editingTask, ...taskData });
    } else {
      onAddTask(taskData);
    }

    // Clear form
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
    setErrors({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Task title"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.dueDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          rows="3"
          placeholder="Task description"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {editingTask && (
          <button
            onClick={onCancelEdit}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

// Task Item Component
const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
  };

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${task.status === 'Completed' ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{task.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Due: {task.dueDate}</span>
          <span className={`px-2 py-1 rounded text-xs ${
            task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {task.status}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`p-2 rounded-lg transition-colors ${
              task.status === 'Completed'
                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
            title={task.status === 'Completed' ? 'Mark as Pending' : 'Mark as Complete'}
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            title="Edit Task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this task?</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
const TaskManager = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingTask, setEditingTask] = useState(null);
  const [emailLog, setEmailLog] = useState([]);

  // Debounced search with 500ms delay
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Check session on mount
  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Email automation - Check every 20 minutes (simulated as 1 minute for demo)
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkPendingTasks = () => {
      const pendingTasks = tasks.filter(t => t.status === 'Pending');
      if (pendingTasks.length > 0) {
        const timestamp = new Date().toLocaleString();
        const message = `[${timestamp}] Email notification: You have ${pendingTasks.length} pending task(s)`;
        console.log(message);
        setEmailLog(prev => [...prev, message]);
      }
    };

    // Run immediately and then every 20 minutes (1200000ms)
    // For demo purposes, using 60000ms (1 minute)
    checkPendingTasks();
    const interval = setInterval(checkPendingTasks, 60000);

    return () => clearInterval(interval);
  }, [tasks, isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
    setTasks([]);
  };

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => 
      t.id === id 
        ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' }
        : t
    ));
  };

  // Elastic search implementation with debouncing
  const filteredTasks = tasks.filter(task => {
    // Apply search filter (case-insensitive, partial match)
    const matchesSearch = debouncedSearch === '' || 
      task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      task.description.toLowerCase().includes(debouncedSearch.toLowerCase());

    // Apply status/priority filter
    if (filter === 'All') return matchesSearch;
    if (filter === 'Completed') return matchesSearch && task.status === 'Completed';
    if (filter === 'Pending') return matchesSearch && task.status === 'Pending';
    if (['Low', 'Medium', 'High'].includes(filter)) {
      return matchesSearch && task.priority === filter;
    }
    return matchesSearch;
  });

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Task Form */}
        <TaskForm
          onAddTask={addTask}
          editingTask={editingTask}
          onUpdateTask={updateTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks (debounced 500ms)..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Completed', 'Pending', 'Low', 'Medium', 'High'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Email Log Indicator */}
        {emailLog.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={20} className="text-blue-600" />
              <h3 className="font-semibold text-blue-800">Email Notifications Log (Checks every 1 min for demo)</h3>
            </div>
            <div className="text-sm text-gray-700 max-h-32 overflow-y-auto">
              {emailLog.slice(-3).map((log, idx) => (
                <p key={idx} className="mb-1">{log}</p>
              ))}
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              {tasks.length === 0 ? 'No tasks yet. Create your first task above!' : 'No tasks match your search criteria.'}
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={deleteTask}
                onToggleComplete={toggleComplete}
              />
            ))
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{tasks.length}</p>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'Completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {tasks.filter(t => t.status === 'Pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {tasks.filter(t => t.priority === 'High' && t.status === 'Pending').length}
              </p>
              <p className="text-sm text-gray-600">High Priority</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;