import React, { useState } from 'react';
import { MessageCircle, Send, User, Clock } from 'lucide-react';

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chats] = useState([
    {
      id: 1,
      doctor: 'Доктор Иванов И.П.',
      lastMessage: 'Здравствуйте! Как ваше самочувствие?',
      time: '14:30',
      unread: 2,
    },
    {
      id: 2,
      doctor: 'Доктор Петрова А.С.',
      lastMessage: 'Приходите на прием в назначенное время',
      time: '12:15',
      unread: 0,
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Здесь будет логика отправки сообщения
      setMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Чаты
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Общайтесь с врачами в реальном времени
        </p>
      </div>

      <div className="space-y-4">
        {chats.map((chat) => (
          <div key={chat.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {chat.doctor}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-1">
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock size={14} />
                  <span>{chat.time}</span>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat input */}
      <div className="card">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Введите сообщение..."
            className="flex-1 input"
          />
          <button
            onClick={handleSendMessage}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Send size={16} />
            <span>Отправить</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 