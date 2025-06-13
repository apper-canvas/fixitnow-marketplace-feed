import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { userService } from '../services';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await userService.getAll();
      const pros = users.filter(user => user.type === 'pro');
      
      // Create mock conversations
      const mockConversations = pros.slice(0, 3).map((pro, index) => ({
        id: `conv_${pro.id}`,
        pro: pro,
        lastMessage: {
          text: index === 0 ? "I can start working on your plumbing issue tomorrow morning. What time works best for you?" :
                index === 1 ? "I've reviewed your task details and can provide a better quote after seeing the damage in person." :
                "Thank you for choosing me for your electrical work. I'll be there at 2 PM as scheduled.",
          timestamp: new Date(Date.now() - Math.random() * 86400000),
          fromPro: true
        },
        unreadCount: index === 0 ? 2 : index === 1 ? 0 : 1,
        messages: [
          {
            id: 1,
            text: "Hi! I saw your task posting for " + (index === 0 ? "plumbing repair" : index === 1 ? "kitchen renovation" : "electrical work") + ". I'm available to help.",
            timestamp: new Date(Date.now() - Math.random() * 86400000 - 3600000),
            fromPro: true
          },
          {
            id: 2,
            text: "That sounds great! When would you be available to take a look?",
            timestamp: new Date(Date.now() - Math.random() * 86400000 - 1800000),
            fromPro: false
          },
          {
            id: 3,
            text: index === 0 ? "I can start working on your plumbing issue tomorrow morning. What time works best for you?" :
                  index === 1 ? "I've reviewed your task details and can provide a better quote after seeing the damage in person." :
                  "Thank you for choosing me for your electrical work. I'll be there at 2 PM as scheduled.",
            timestamp: new Date(Date.now() - Math.random() * 86400000),
            fromPro: true
          }
        ]
      }));
      
      setConversations(mockConversations);
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      timestamp: new Date(),
      fromPro: false
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: message
          }
        : conv
    ));

    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: message
    }));

    setNewMessage('');
    toast.success('Message sent!');
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="h-full bg-surface-50 p-4">
        <div className="h-full max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-96">
              <div className="bg-surface-200 rounded-lg"></div>
              <div className="md:col-span-2 bg-surface-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-surface-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-4 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-bold text-xl text-surface-900">Messages</h1>
          <p className="text-sm text-surface-600">
            {conversations.length} conversations
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 overflow-hidden">
        {conversations.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg"
          >
            <ApperIcon name="MessageCircle" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No messages yet</h3>
            <p className="text-surface-500 mb-6">
              Start a conversation with a professional to get help with your tasks
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
            >
              Browse Professionals
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {/* Conversation List */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="p-4 border-b border-surface-200">
                <h3 className="font-semibold text-surface-900">Conversations</h3>
              </div>
              
              <div className="overflow-y-auto h-full">
                {conversations.map((conversation) => (
                  <motion.button
                    key={conversation.id}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 text-left border-b border-surface-100 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-primary/5 border-primary/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: conversation.pro.avatarColor || '#6B7280' }}
                        >
                          {conversation.pro.name?.charAt(0)}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-surface-900 truncate">
                            {conversation.pro.name}
                          </h4>
                          <span className="text-xs text-surface-500">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-surface-600 truncate">
                          {conversation.lastMessage.text}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2 bg-white rounded-lg flex flex-col overflow-hidden">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-surface-200 flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: selectedConversation.pro.avatarColor || '#6B7280' }}
                    >
                      {selectedConversation.pro.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900">
                        {selectedConversation.pro.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Star" className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-sm text-surface-600">
                          {selectedConversation.pro.rating} • {selectedConversation.pro.completedJobs} jobs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {selectedConversation.messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex ${message.fromPro ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.fromPro 
                              ? 'bg-surface-100 text-surface-900' 
                              : 'bg-primary text-white'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.fromPro ? 'text-surface-500' : 'text-blue-100'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-surface-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 flex items-center justify-center"
                      >
                        <ApperIcon name="Send" className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <ApperIcon name="MessageCircle" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                    <h3 className="font-medium text-surface-900 mb-2">Select a conversation</h3>
                    <p className="text-surface-500">Choose a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;