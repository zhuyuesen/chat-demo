import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, RotateCcw, AlertCircle } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import { CHAT_MUTATION, GET_MODELS_QUERY, HELLO_QUERY } from '../apollo/queries';

const ChatDemo = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "你好！我是DeepSeek AI助手，有什么可以帮助你的吗？",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState('deepseek-chat');
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // GraphQL hooks
  // eslint-disable-next-line no-unused-vars
  const { data: helloData, error: helloError } = useQuery(HELLO_QUERY, {
    onCompleted: () => setConnectionStatus('connected'),
    onError: () => setConnectionStatus('error')
  });
  
  const { data: modelsData, error: modelsError } = useQuery(GET_MODELS_QUERY);
  
  const [sendChatMessage, { loading: isLoading, error: chatError }] = useMutation(CHAT_MUTATION);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 构建消息历史记录用于 GraphQL 请求
  const buildChatHistory = (newUserMessage) => {
    const chatHistory = messages
      .filter(msg => msg.sender !== 'system') // 过滤掉系统消息
      .map(msg => ({
        role: msg.sender === 'user' ? 'USER' : 'ASSISTANT',
        content: msg.content
      }));
    
    // 添加新的用户消息
    chatHistory.push({
      role: 'USER',
      content: newUserMessage
    });
    
    return chatHistory;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");

    try {
      // 构建聊天历史记录
      const chatHistory = buildChatHistory(currentInput);
      
      // 发送 GraphQL 变更请求
      const { data } = await sendChatMessage({
        variables: {
          input: {
            messages: chatHistory,
            model: selectedModel,
            temperature: 0.7,
            maxTokens: 2000
          }
        }
      });

      if (data?.chat?.message?.content) {
        const aiResponse = {
          id: Date.now() + 1,
          content: data.chat.message.content,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
          model: data.chat.model,
          usage: data.chat.usage
        };
        
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('未收到有效回复');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        content: `发送失败: ${error.message}`,
        sender: "error",
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
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
        content: "你好！我是DeepSeek AI助手，有什么可以帮助你的吗？",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
      }
    ]);
  };


  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 max-w-4xl mx-auto gap-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">DeepSeek Chat Demo</h1>
              <div className="flex items-center space-x-2">
                <p className="text-xs sm:text-sm text-gray-500">智能对话助手</p>
                {connectionStatus === 'connected' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
                {(connectionStatus === 'error' || helloError || modelsError) && (
                  <AlertCircle className="w-3 h-3 text-red-500" />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            {modelsData?.models && (
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="选择模型"
              >
                {modelsData.models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            )}
            <button
              onClick={clearChat}
              className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-0"
              title="清空对话"
            >
              <RotateCcw className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline text-sm">清空</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 sm:space-x-3 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-green-400 to-blue-500'
                  : message.sender === 'error'
                  ? 'bg-gradient-to-r from-red-400 to-red-500'
                  : 'bg-gradient-to-r from-purple-400 to-pink-500'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                ) : message.sender === 'error' ? (
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                ) : (
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                )}
              </div>
              
              <div className={`max-w-[calc(100vw-4rem)] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl group ${
                message.sender === 'user' ? 'items-end' : 'items-start'
              }`}>
                <div
                  className={`relative px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-md ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : message.sender === 'error'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-white text-gray-800 border'
                  }`}
                >
                  <div className="break-words">
                    {message.sender === 'ai' ? (
                      <ReactMarkdown
                        className={`prose prose-sm max-w-none ${
                          message.sender === 'user' ? 'prose-invert' : ''
                        }`}
                        components={{
                          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                          code: ({inline, children}) => 
                            inline ? (
                              <code className="px-1 py-0.5 bg-gray-200 text-gray-800 rounded text-sm">
                                {children}
                              </code>
                            ) : (
                              <pre className="bg-gray-100 p-2 rounded mt-2 mb-2 overflow-x-auto">
                                <code className="text-gray-800 text-sm">{children}</code>
                              </pre>
                            ),
                          ul: ({children}) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                          li: ({children}) => <li className="mb-1">{children}</li>,
                          h1: ({children}) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                          h2: ({children}) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                          blockquote: ({children}) => (
                            <blockquote className="border-l-4 border-gray-300 pl-3 italic mb-2">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => copyMessage(message.content)}
                    className={`absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                      message.sender === 'user' ? 'text-white hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="复制消息"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                
                <div className={`text-xs text-gray-500 mt-1 px-1 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <span>{message.timestamp}</span>
                  {message.model && (
                    <span className="ml-1 sm:ml-2 hidden sm:inline">• {message.model}</span>
                  )}
                  {message.usage && (
                    <span className="ml-1 sm:ml-2 hidden sm:inline">• {message.usage.totalTokens} tokens</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-md border">
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
      <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2 sm:space-x-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入你的消息... (Enter发送，Shift+Enter换行)"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                rows="1"
                style={{ minHeight: '40px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 flex-shrink-0"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          {(helloError || modelsError || chatError) && (
            <div className="mt-2 text-xs text-center text-red-500 px-2">
              连接错误: {helloError?.message || modelsError?.message || chatError?.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDemo;