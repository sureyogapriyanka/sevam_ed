// ✅ API service — all named exports, Vite-safe, browser-friendly

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  `${window.location.origin}/api`;

// generic request
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('token');
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const err = await response.json();
        message = err.message || message;
      } catch { }
      return { data: null, error: message };
    }

    const data = await response.json().catch(() => null);
    return { data, error: null };
  } catch (err) {
    console.error('Network error:', err);
    return { data: null, error: 'Network error - please try again later.' };
  }
};

// ------------------------------
// ✅ AUTH SERVICE
// ------------------------------
export const authService = {
  register: (data) => apiRequest('/users/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiRequest('/users/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => apiRequest('/users/profile', { method: 'GET' }),
  getUserByUsername: (username) => apiRequest(`/users/username/${username}`, { method: 'GET' }),
  updateProfile: (data) => apiRequest('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updateUserById: (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ------------------------------
// ✅ USER SERVICE
// ------------------------------
export const userService = {
  getByUsername: (username) => apiRequest(`/users/username/${username}`, { method: 'GET' }),
  getByRole: (role) => apiRequest(`/users/role/${role}`, { method: 'GET' }),
};

// ------------------------------
// ✅ ACTIVITY LOG SERVICE
// ------------------------------
export const activityLogService = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/activity-logs${q ? `?${q}` : ''}`, { method: 'GET' });
  },
  create: (data) => apiRequest('/activity-logs', { method: 'POST', body: JSON.stringify(data) }),
  clear: () => apiRequest('/activity-logs', { method: 'DELETE' }),
};

// ------------------------------
// ✅ MESSAGE SERVICE
// ------------------------------
export const messageService = {
  getByUserId: (userId) => apiRequest(`/messages/user/${userId}`, { method: 'GET' }),
  getAll: () => apiRequest('/messages/user', { method: 'GET' }),
  send: (data) => apiRequest('/messages', { method: 'POST', body: JSON.stringify(data) }),
  markAsRead: (id) => apiRequest(`/messages/${id}/read`, { method: 'PUT' }),
  getUnreadCount: () => apiRequest('/messages/unread-count', { method: 'GET' }),
};

// ------------------------------
// ✅ QUEUE SERVICE
// ------------------------------
export const queueService = {
  getAll: () => apiRequest('/queue', { method: 'GET' }),
  getById: (id) => apiRequest(`/queue/${id}`, { method: 'GET' }),
  create: (data) => apiRequest('/queue', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/queue/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/queue/${id}`, { method: 'DELETE' }),
  skip: (id) => apiRequest(`/queue/${id}/skip`, { method: 'POST' }),
  getStats: () => apiRequest('/queue/stats', { method: 'GET' }),
  moveToFront: (id) => apiRequest(`/queue/${id}/move-to-front`, { method: 'POST' }),
};

// ------------------------------
// ✅ PATIENT SERVICE
// ------------------------------
export const patientService = {
  create: (data) => apiRequest('/patients', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => apiRequest('/patients', { method: 'GET' }),
  getById: (id) => apiRequest(`/patients/${id}`, { method: 'GET' }),
  getByUserId: (userId) => apiRequest(`/patients/user/${userId}`, { method: 'GET' }),
  update: (id, data) => apiRequest(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/patients/${id}`, { method: 'DELETE' }),
};

// ------------------------------
// ✅ APPOINTMENT SERVICE
// ------------------------------
export const appointmentService = {
  create: (data) => apiRequest('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => apiRequest('/appointments', { method: 'GET' }),
  getById: (id) => apiRequest(`/appointments/${id}`, { method: 'GET' }),
  getByUserId: (userId) => apiRequest(`/appointments/user/${userId}`, { method: 'GET' }),
  update: (id, data) => apiRequest(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/appointments/${id}`, { method: 'DELETE' }),
};

// ------------------------------
// ✅ AI INSIGHT SERVICE
// ------------------------------
export const aiInsightService = {
  getByUserId: (userId) => apiRequest(`/ai-insights/user/${userId}`, { method: 'GET' }),
  generateHealthSuggestions: (data) =>
    apiRequest('/ai-insights/generate/health', { method: 'POST', body: JSON.stringify(data) }),
};

// ------------------------------
// ✅ FITNESS DATA SERVICE
// ------------------------------
export const fitnessDataService = {
  getByPatientId: (id) => apiRequest(`/fitness-data/patient/${id}`, { method: 'GET' }),
  create: (data) => apiRequest('/fitness-data', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/fitness-data/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ------------------------------
// ✅ KNOWLEDGE ARTICLE SERVICE
// ------------------------------
export const knowledgeArticleService = {
  getAll: () => apiRequest('/knowledge-articles', { method: 'GET' }),
  getById: (id) => apiRequest(`/knowledge-articles/${id}`, { method: 'GET' }),
  create: (data) => apiRequest('/knowledge-articles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/knowledge-articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/knowledge-articles/${id}`, { method: 'DELETE' }),
  incrementViewCount: (id) => apiRequest(`/knowledge-articles/${id}/view`, { method: 'PATCH' }),
};

// ------------------------------
// ✅ PRESCRIPTION SERVICE
// ------------------------------
export const prescriptionService = {
  create: (data) => apiRequest('/prescriptions', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => apiRequest('/prescriptions', { method: 'GET' }),
  getById: (id) => apiRequest(`/prescriptions/${id}`, { method: 'GET' }),
  getByPatientId: (patientId) => apiRequest(`/prescriptions/patient/${patientId}`, { method: 'GET' }),
  getByAppointmentId: (appointmentId) => apiRequest(`/prescriptions/appointment/${appointmentId}`, { method: 'GET' }),
  update: (id, data) => apiRequest(`/prescriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/prescriptions/${id}`, { method: 'DELETE' }),
};
