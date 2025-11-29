import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageCircle, Search, MoreVertical } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { chatApi } from '../api/chatApi';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.user?.id || user?.id;

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    const conversationId = location.state?.conversationId;
    if (conversationId) {
      if (chats.length > 0) {
        const chat = chats.find(c => c._id === conversationId);
        if (chat) {
          setSelectedChat(chat);
        }
      } else {
        // If chats not loaded yet, reload them
        loadChats();
      }
    }
  }, [location.state, chats]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat._id);
      if (socket?.connected) {
        socket.emit('join-conversation', selectedChat._id);
      }
      setChats(prev => prev.map(chat => 
        chat._id === selectedChat._id ? { ...chat, hasUnread: false, unreadCount: 0 } : chat
      ));
    }
  }, [selectedChat?._id, socket?.connected]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      if (selectedChat && message.conversationId === selectedChat._id) {
        setMessages(prev => {
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
      setChats(prev => {
        const updated = prev.map(chat => {
          if (chat._id === message.conversationId) {
            const isUnread = selectedChat?._id !== message.conversationId;
            return { 
              ...chat, 
              lastMessage: message, 
              updatedAt: message.createdAt, 
              hasUnread: isUnread,
              unreadCount: isUnread ? (chat.unreadCount || 0) + 1 : 0
            };
          }
          return chat;
        });
        return updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      });
    };

    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket, selectedChat?._id]);

  const loadChats = async () => {
    try {
      const response = await chatApi.getConversations();
      const conversations = response.data.data || response.data || [];
      
      const chatsWithUnread = await Promise.all(
        conversations.map(async (chat: any) => {
          try {
            const messagesRes = await chatApi.getMessages(chat._id);
            const messages = messagesRes.data.data || [];
            const unreadCount = messages.filter((msg: any) => 
              msg.sender !== currentUserId && 
              msg.sender?._id !== currentUserId &&
              !msg.readBy?.some((r: any) => r.user === currentUserId || r.user?._id === currentUserId)
            ).length;
            return { ...chat, unreadCount, hasUnread: unreadCount > 0 };
          } catch {
            return { ...chat, unreadCount: 0, hasUnread: false };
          }
        })
      );
      
      const sortedChats = chatsWithUnread.sort((a: any, b: any) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setChats(sortedChats);
    } catch (error: any) {
      console.error('Failed to load chats:', error);
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const response = await chatApi.getMessages(chatId);
      setMessages(response.data.data || response.data || []);
    } catch (error: any) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || isSending || !socket) return;

    setIsSending(true);
    const messageContent = newMessage;
    setNewMessage('');

    try {
      socket.emit('send-message', {
        conversationId: selectedChat._id,
        content: messageContent,
      });
    } catch (error: any) {
      toast.error('Failed to send message');
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getOtherParticipant = (chat: any) => {
    return chat.participants?.find((p: any) => p._id !== currentUserId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-violet-200">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950/50 to-slate-950 pointer-events-none z-0" />
      
      <div className="relative z-10 pt-20 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)] flex rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${selectedChat ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex-col`}
          >
            <div className="p-4 sm:p-6 border-b border-white/10">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                Messages
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {chats.length > 0 ? (
                chats.map((chat) => {
                  const otherUser = getOtherParticipant(chat);
                  return (
                    <ChatListItem
                      key={chat._id}
                      chat={chat}
                      otherUser={otherUser}
                      isSelected={selectedChat?._id === chat._id}
                      onClick={() => setSelectedChat(chat)}
                    />
                  );
                })
              ) : (
                <div className="p-4 sm:p-6 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-400">No conversations yet</p>
                </div>
              )}
            </div>
          </motion.div>

          <div className={`${selectedChat ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
            {selectedChat ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between"
                >
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="lg:hidden mr-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white text-sm sm:text-base truncate">
                        {getOtherParticipant(selectedChat)?.name || 'Unknown User'}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 truncate">
                        {selectedChat.itemId?.title || 'Chat'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <MessageBubble
                        key={message._id}
                        message={message}
                        isOwn={message.sender?._id === currentUserId || message.sender === currentUserId}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 lg:p-6 bg-slate-900/40 backdrop-blur-xl border-t border-white/10"
                >
                  <div className="flex gap-2 sm:gap-3 lg:gap-4 items-end">
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full bg-slate-950/50 border border-white/10 focus:border-violet-500 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all resize-none max-h-32"
                        style={{ minHeight: '44px' }}
                      />
                    </div>
                    
                    <motion.button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Select a conversation</h3>
                  <p className="text-slate-400">Choose a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatListItem = ({ chat, otherUser, isSelected, onClick }: any) => {
  const unreadCount = chat.unreadCount || 0;
  const displayCount = unreadCount > 4 ? '4+' : unreadCount;
  
  return (
    <motion.div
      whileHover={{ x: 5 }}
      onClick={onClick}
      className={`p-3 sm:p-4 cursor-pointer transition-all border-l-4 relative active:bg-white/5 ${
        isSelected 
          ? 'bg-violet-500/10 border-violet-500' 
          : 'border-transparent hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          {chat.hasUnread && unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-5 bg-violet-500 rounded-full border-2 border-slate-900 flex items-center justify-center px-1">
              <span className="text-[10px] sm:text-xs font-bold text-white">{displayCount}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white truncate text-sm sm:text-base">
            {otherUser?.name || 'Unknown User'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 truncate">
            {chat.itemId?.title || 'Chat'}
          </p>
        </div>
        
        <div className="text-[10px] sm:text-xs text-slate-500 flex-shrink-0">
          {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};

const MessageBubble = ({ message, isOwn, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
  >
    <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl backdrop-blur-md border shadow-lg ${
      isOwn 
        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-violet-500/20' 
        : 'bg-slate-900/60 text-white border-white/10'
    }`}>
      <p className="text-sm sm:text-base leading-relaxed break-words">{message.content}</p>
      <p className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 ${isOwn ? 'text-violet-100' : 'text-slate-400'}`}>
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </motion.div>
);

export default Chat;
