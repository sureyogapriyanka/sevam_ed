// Message service for handling chat messages

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    try {
        const response = await fetch(url, config);

        // Handle successful responses
        if (response.ok) {
            const data = await response.json();
            return { data, error: null };
        }

        // Handle error responses
        const errorData = await response.json();
        return { data: null, error: errorData.message || 'An error occurred' };
    } catch (error) {
        return { data: null, error: 'Network error - please try again' };
    }
};

// Message APIs
export const messageService = {
    // Get messages between current user and another user
    getByUserId: async (userId: string) => {
        return apiRequest(`/messages/user/${userId}`, {
            method: 'GET',
        });
    },

    // Get all messages for current user
    getAll: async () => {
        return apiRequest('/messages/user', {
            method: 'GET',
        });
    },

    // Send a new message
    send: async (messageData: {
        receiverId: string;
        content: string;
        messageType?: string;
        attachments?: string[];
    }) => {
        return apiRequest('/messages', {
            method: 'POST',
            body: JSON.stringify(messageData),
        });
    },

    // Mark message as read
    markAsRead: async (messageId: string) => {
        return apiRequest(`/messages/${messageId}/read`, {
            method: 'PUT',
        });
    },

    // Get unread message count
    getUnreadCount: async () => {
        return apiRequest('/messages/unread-count', {
            method: 'GET',
        });
    },
};

export default messageService;
