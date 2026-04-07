import { useState, useEffect } from 'react';
import api from './api';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState<'login' | 'register'>('login');
  const [message, setMessage] = useState('');

  // Auth fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  // User info
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setUserName(res.data.name);
    } catch { setUserName(''); }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  // ── REGISTER ──
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/auth/register', { name, email, password });
      setMessage('✅ Registro exitoso. Ahora inicia sesión.');
      setView('login');
    } catch (err: any) {
      setMessage('❌ Error: ' + (err.response?.data?.message || 'No se pudo registrar'));
    }
  };

  // ── LOGIN ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      setToken(res.data.access_token);
      setMessage('');
    } catch (err: any) {
      setMessage('❌ Credenciales inválidas');
    }
  };

  // ── LOGOUT ──
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTasks([]);
    setUserName('');
  };

  // ── CREATE TASK ──
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await api.post('/tasks', { title: newTask });
    setNewTask('');
    fetchTasks();
  };

  // ── TOGGLE COMPLETED ──
  const handleToggle = async (id: number, completed: boolean) => {
    await api.put(`/tasks/${id}`, { completed: !completed });
    fetchTasks();
  };

  // ── DELETE (SOFT DELETE) ──
  const handleDelete = async (id: number) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  // ═══════════════════════════════════════
  // Si NO hay token → mostrar Login/Register
  // ═══════════════════════════════════════
  if (!token) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>📝 Prueba Técnica</h1>

        <div style={styles.tabs}>
          <button
            onClick={() => { setView('login'); setMessage(''); }}
            style={view === 'login' ? styles.tabActive : styles.tab}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => { setView('register'); setMessage(''); }}
            style={view === 'register' ? styles.tabActive : styles.tab}
          >
            Registrarse
          </button>
        </div>

        {message && <p style={styles.message}>{message}</p>}

        {view === 'register' ? (
          <form onSubmit={handleRegister} style={styles.form}>
            <input
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Contraseña (mín 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.btnPrimary}>Registrarse</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.btnPrimary}>Entrar</button>
          </form>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════
  // Si HAY token → mostrar Tareas
  // ═══════════════════════════════════════
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📝 Mis Tareas</h1>
        <div>
          <span style={{ marginRight: '10px' }}>Hola, <b>{userName}</b></span>
          <button onClick={handleLogout} style={styles.btnDanger}>Cerrar Sesión</button>
        </div>
      </div>

      <form onSubmit={handleCreate} style={styles.createForm}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea..."
          style={{ ...styles.input, flex: 1 }}
        />
        <button type="submit" style={styles.btnPrimary}>Añadir</button>
      </form>

      {tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No hay tareas. ¡Crea una!</p>
      ) : (
        <ul style={styles.list}>
          {tasks.map((t) => (
            <li key={t.id} style={styles.taskItem}>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => handleToggle(t.id, t.completed)}
                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
              />
              <span style={{
                flex: 1,
                textDecoration: t.completed ? 'line-through' : 'none',
                color: t.completed ? '#999' : '#333',
              }}>
                {t.title}
              </span>
              <button onClick={() => handleDelete(t.id)} style={styles.btnDelete}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}

      <p style={{ textAlign: 'center', color: '#aaa', fontSize: '12px', marginTop: '20px' }}>
        Completadas: {tasks.filter(t => t.completed).length} / {tasks.length}
      </p>
    </div>
  );
}

// ── Estilos inline básicos ──
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  tabs: {
    display: 'flex',
    gap: '0',
    marginBottom: '15px',
  },
  tab: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    background: '#f5f5f5',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tabActive: {
    flex: 1,
    padding: '10px',
    border: '1px solid #4a90d9',
    background: '#4a90d9',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  btnPrimary: {
    padding: '10px',
    background: '#4a90d9',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  btnDanger: {
    padding: '6px 12px',
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  btnDelete: {
    padding: '4px 10px',
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  message: {
    textAlign: 'center' as const,
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    background: '#f9f9f9',
    border: '1px solid #ddd',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  createForm: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
};

export default App;