import { useState, useEffect } from 'react';
import api from './api';

export function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        const res = await api.get('/tasks'); // Requisito: Listar tareas [cite: 34]
        setTasks(res.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        await api.post('/tasks', { title }); // Requisito: Crear tarea [cite: 35]
        setTitle('');
        fetchTasks();
    };

    const handleToggle = async (id, completed) => {
        await api.put(`/tasks/${id}`, { completed: !completed }); // Requisito: Completar tarea [cite: 36]
        fetchTasks();
    };

    const handleDelete = async (id) => {
        await api.delete(`/tasks/${id}`); // Requisito: Eliminar tarea (Soft Delete) [cite: 37, 22]
        fetchTasks();
    };

    return (
        <div>
            <form onSubmit={handleCreate}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nueva tarea" />
                <button type="submit">Agregar</button>
            </form>
            <ul>
                {tasks.map(t => (
                    <li key={t.id}>
                        <span onClick={() => handleToggle(t.id, t.completed)}
                            style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>
                            {t.title}
                        </span>
                        <button onClick={() => handleDelete(t.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}