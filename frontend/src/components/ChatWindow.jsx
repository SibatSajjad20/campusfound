import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { chatApi } from '../api/chatApi';

const ChatWindow = ({ conversation, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      loadMessages();
      if (socket) {
        console.log('Joining conversation:', conversation._id);
        socket.emit('join-conversation', conversation._id);
        socket.on('new-message', handleNewMessage);
        socket.on('error', (error) => {
          console.error('Socket error:', error);
        });
        
        return () => {
          socket.off('new-message', handleNewMessage);
          socket.off('error');
        };
      }
    }
  }, [conversation, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await chatApi.getMessages(conversation._id);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      console.log('Sending message:', {
        conversationId: conversation._id,
        content: newMessage.trim()
      });
      socket.emit('send-message', {
        conversationId: conversation._id,
        content: newMessage.trim()
      });
      setNewMessage('');
    } else {
      console.log('Cannot send message:', { hasMessage: !!newMessage.trim(), hasSocket: !!socket });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const otherParticipant = conversation.participants.find(p => p._id !== conversation.currentUserId);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg h-[500px] flex flex-col shadow-2xl border">
        <div className="p-4 border-b bg-gradient-to-r from-[#2E073F] to-[#AD49E1] text-white rounded-t-2xl flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">
              💬 {otherParticipant?.name}
            </h3>
            <p className="text-sm opacity-90">
              About: {conversation.itemId?.title}
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {loading ? (
            <div className="text-center text-gray-500 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AD49E1] mx-auto mb-2"></div>
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>👋 Start the conversation!</p>
              <p className="text-sm">Send a message about the item.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${message.sender._id === conversation.currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs`}>
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm ${
                      message.sender._id === conversation.currentUserId
                        ? 'bg-gradient-to-r from-[#2E073F] to-[#AD49E1] text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${
                    message.sender._id === conversation.currentUserId ? 'text-right' : 'text-left'
                  }`}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t bg-white rounded-b-2xl">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Message ${otherParticipant?.name}...`}
              className="flex-1 px-4 py-3 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#AD49E1] focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-[#2E073F] to-[#AD49E1] text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;