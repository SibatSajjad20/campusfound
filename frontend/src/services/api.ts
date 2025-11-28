import axios, { AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  User, 
  LostItem, 
  ReportItemData, 
  Chat, 
  Message, 
  ApiResponse,
  SearchFilters 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/me');
    return response.data.data!;
  },
};

// Items API
export const itemsAPI = {
  getAllItems: async (filters?: SearchFilters): Promise<LostItem[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.type) params.append('type', filters.type);
    
    const response: AxiosResponse<ApiResponse<LostItem[]>> = await api.get(`/items?${params}`);
    return response.data.data!;
  },

  getItemById: async (id: string): Promise<LostItem> => {
    const response: AxiosResponse<ApiResponse<LostItem>> = await api.get(`/items/${id}`);
    return response.data.data!;
  },

  reportItem: async (itemData: ReportItemData): Promise<LostItem> => {
    const formData = new FormData();
    formData.append('title', itemData.title);
    formData.append('description', itemData.description);
    formData.append('category', itemData.category);
    formData.append('location', itemData.location);
    formData.append('type', itemData.type);
    
    if (itemData.image) {
      formData.append('image', itemData.image);
    }

    const response: AxiosResponse<ApiResponse<LostItem>> = await api.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  },

  searchByImage: async (image: File): Promise<LostItem[]> => {
    const formData = new FormData();
    formData.append('image', image);

    // TODO: Verify endpoint path
    const response: AxiosResponse<ApiResponse<LostItem[]>> = await api.post('/items/search/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  },

  getUserItems: async (): Promise<LostItem[]> => {
    const response: AxiosResponse<ApiResponse<LostItem[]>> = await api.get('/items/my-items');
    return response.data.data!;
  },

  // Admin actions
  approveItem: async (id: string): Promise<LostItem> => {
    const response: AxiosResponse<any> = await api.patch(`/items/${id}/approve`);
    return response.data.item;
  },

  rejectItem: async (id: string): Promise<LostItem> => {
    const response: AxiosResponse<any> = await api.patch(`/items/${id}/reject`);
    return response.data.item;
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },

  resolveItem: async (id: string): Promise<LostItem> => {
    const response: AxiosResponse<any> = await api.patch(`/items/${id}/resolve`);
    return response.data.item;
  },
};

// Chat API
export const chatAPI = {
  getChats: async (): Promise<Chat[]> => {
    // TODO: Verify endpoint path
    const response: AxiosResponse<ApiResponse<Chat[]>> = await api.get('/chats');
    return response.data.data!;
  },

  getChatMessages: async (chatId: string): Promise<Message[]> => {
    // TODO: Verify endpoint path
    const response: AxiosResponse<ApiResponse<Message[]>> = await api.get(`/chats/${chatId}/messages`);
    return response.data.data!;
  },

  sendMessage: async (chatId: string, content: string): Promise<Message> => {
    // TODO: Verify endpoint path
    const response: AxiosResponse<ApiResponse<Message>> = await api.post(`/chats/${chatId}/messages`, {
      content,
    });
    return response.data.data!;
  },

  createChat: async (participantId: string): Promise<Chat> => {
    // TODO: Verify endpoint path
    const response: AxiosResponse<ApiResponse<Chat>> = await api.post('/chats', {
      participantId,
    });
    return response.data.data!;
  },
};

// Profile API
export const profileAPI = {
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    // TODO: Verify endpoint path
    const response: AxiosResponse<ApiResponse<User>> = await api.put('/users/profile', profileData);
    return response.data.data!;
  },

  uploadAvatar: async (avatar: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', avatar);

    // TODO: Verify endpoint path
    const response: AxiosResponse<ApiResponse<User>> = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  },
};

export default api;