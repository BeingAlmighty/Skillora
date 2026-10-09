const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  async register(email, password, fullName) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    return data;
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Incorrect email address or password');
    }

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    return data;
  },

  async logout() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
    } catch (e) {
      console.warn('Logout API warning:', e);
    } finally {
      localStorage.removeItem('access_token');
    }
    return { message: 'Logged out successfully' };
  },

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      localStorage.removeItem('access_token');
      throw new Error('Unauthenticated');
    }

    return response.json();
  },

  async sendMessage(message, userId, n = 10) {
    if (!userId) {
      throw new Error('User ID is required. Please log in.');
    }

    const response = await fetch('https://skillora-backend-chatbot-api.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        query: message,
        user_id: userId,
        n: n
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to send chat message');
    }

    return response.json();
  },

  async analyzeResume(formData) {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const opts = {
      method: 'POST',
      headers,
      credentials: 'include',
    };

    if (formData instanceof FormData) {
      opts.body = formData;
    }

    const response = await fetch(`${API_URL}/analysis/analyze-resume`, opts);

    if (!response.ok) {
      let errText = 'Failed to analyze resume';
      try {
        const errJson = await response.json();
        errText = errJson.detail || JSON.stringify(errJson);
      } catch (e) {}
      throw new Error(errText);
    }

    return response.json();
  },
};

export default api;
