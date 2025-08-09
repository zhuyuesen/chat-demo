import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, RotateCcw } from 'lucide-react';

const ChatDemo = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "你好！我是AI助手，有什么可以帮助你的吗？",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 模拟AI回复
  const simulateAIResponse = (userMessage) => {
    const responses = [
      "这是一个很有趣的问题！让我来为你分析一下...",
      "我理解你的意思。根据我的知识，我认为...",
      "感谢你的提问！这让我想到了几个要点：",
      "这确实是一个值得思考的话题。我的观点是...",
      "你提出了一个很好的问题！让我详细解释一下..."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return `${randomResponse}\n\n针对"${userMessage}"，我建议你可以从多个角度来考虑这个问题。如果你需要更具体的建议，请提供更多细节。`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // 模拟API调用延迟
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: simulateAIResponse(inputMessage),
        sender: "ai",
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        content: "你好！我是AI助手，有什么可以帮助你的吗？",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
      }
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AI Chat Demo</h1>
              <p className="text-sm text-gray-500">智能对话助手</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="清空对话"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">清空</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-green-400 to-blue-500' 
                  : 'bg-gradient-to-r from-purple-400 to-pink-500'
              }`}>
                {message.sender === 'user' ? 
                  <User className="w-4 h-4 text-white" /> : 
                  <Bot className="w-4 h-4 text-white" />
                }
              </div>
              
              <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl group ${
                message.sender === 'user' ? 'items-end' : 'items-start'
              }`}>
                <div
                  className={`relative px-4 py-3 rounded-2xl shadow-md ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white text-gray-800 border'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  
                  <button
                    onClick={() => copyMessage(message.content)}
                    className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                      message.sender === 'user' ? 'text-white hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="复制消息"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                
                <div className={`text-xs text-gray-500 mt-1 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-md border">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入你的消息... (Enter发送，Shift+Enter换行)"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            AI助手正在模拟回复中，这只是一个演示项目
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDemo;