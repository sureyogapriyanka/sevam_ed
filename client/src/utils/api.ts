// Use VITE_API_BASE_URL if set (local dev: http://localhost:5000/api)
// Falls back to the Render production backend
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://sevamed-backend.onrender.com/api';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...(options.headers as any)
        }
    });

    if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/';   // → home page on session expiry
        return null;
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
};
