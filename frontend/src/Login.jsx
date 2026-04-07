import { useState } from 'react';
import api from './api';

export function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.access_token);
            onLoginSuccess();
        } catch (error) {
            alert('Error en credenciales');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Entrar</button>
        </form>
    );
}