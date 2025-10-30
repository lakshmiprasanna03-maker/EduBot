import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from './constants';
import type { Message } from './types';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { BotIcon, UserIcon } from './components/Icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm EduBot, your friendly AI study buddy. 📚\n\nAsk me anything about your school subjects, or for help with study skills like time management or exam prep. Let's learn together!"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chat = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const initializeChat = useCallback(() => {
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable not set.");
      setMessages(prev => [...prev, { role: 'model', text: "Error: API key is not configured. Please set the API_KEY environment variable."}]);
      setIsLoading(false);
      return;
    }
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    chat.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (userMessageText: string) => {
    if (isLoading || !userMessageText.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', text: userMessageText };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    if (!chat.current) {
      initializeChat();
    }

    if (!chat.current) {
        setIsLoading(false);
        return;
    }

    try {
      const response = await chat.current.sendMessage({ message: userMessageText });
      const botMessage: Message = { role: 'model', text: response.text };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = { role: 'model', text: "Oops! Something went wrong. Please try again." };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white dark:bg-slate-800 font-sans">
      <header className="flex items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 shadow-sm sticky top-0 z-10">
        <BotIcon className="h-8 w-8 text-blue-500" />
        <div className="ml-3">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">EduBot</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your AI Study Buddy</p>
        </div>
      </header>
      
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <BotIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center space-x-1 p-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white max-w-lg">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse delay-0"></span>
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse delay-200"></span>
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse delay-400"></span>
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 sticky bottom-0">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;