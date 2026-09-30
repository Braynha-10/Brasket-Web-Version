const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Ajuda a interceptar requisições para extrair erro
async function request(endpoint, options = {}) {
    options.credentials = 'include';
    options.headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    try {
        const res = await fetch(`${API_URL}${endpoint}`, options);
        const data = await res.json().catch(() => ({}));
        
        if (!res.ok) {
            throw new Error(data.error || 'Erro na requisição');
        }
        return data;
    } catch (err) {
        console.error(`API Error (${endpoint}):`, err);
        throw err;
    }
}

export const api = {
    auth: {
        register: (email, password) => request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }),
        login: (email, password) => request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }),
        logout: () => request('/auth/logout', { method: 'POST' }),
        me: () => request('/auth/me', { method: 'GET' })
    },
    saves: {
        list: () => request('/saves', { method: 'GET' }),
        get: (slotId) => request(`/saves/${slotId}`, { method: 'GET' }),
        save: (slotId, leagueData, careerData, metadata) => request(`/saves/${slotId}`, {
            method: 'POST',
            body: JSON.stringify({ league_data: leagueData, career_data: careerData, metadata })
        })
    }
};
