import { useState, useEffect } from 'react';
import api from './api';
import { Login } from './Login';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await api.post('/tasks', { title: newTask });
    setNewTask('');
    fetchTasks();
  };

  // Requisito: Completar tarea (toggle completed)
  const handleToggle = async (id: number, completed: boolean) => {
    await api.put(`/tasks/${id}`, { completed: !completed });
    fetchTasks();
  };

  // Requisito: Eliminar tarea (Soft Delete)
  const handleDelete = async (id: number) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  if (!token) {
    return (
      <div style={{ padding: '20px' }}>
        <Login onLoginSuccess={() => setToken(localStorage.getItem('token'))} />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Mis Tareas</h1>

      <form onSubmit={handleCreate} style={{ marginBottom: '20px' }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea..."
          style={{ padding: '8px', width: '70%' }}
        />
        <button type="submit" style={{ padding: '8px 16px', marginLeft: '8px' }}>Añadir</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((t) => (
          <li key={t.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => handleToggle(t.id, t.completed)}
            />
            <span style={{ textDecoration: t.completed ? 'line-through' : 'none', flex: 1 }}>
              {t.title}
            </span>
            <button onClick={() => handleDelete(t.id)} style={{ color: 'red' }}>✕</button>
          </li>
        ))}
      </ul>

      <button onClick={() => { localStorage.removeItem('token'); setToken(null); }}
        style={{ marginTop: '20px' }}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default App;