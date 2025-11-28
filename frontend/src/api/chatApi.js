import api from './config';

export const chatApi = {
  getConversations: () => api.get('/chat/conversations'),
  
  getOrCreateConversation: (itemId) => api.get(`/chat/conversations/${itemId}`),
  
  getMessages: (conversationId) => api.get(`/chat/messages/${conversationId}`),
};