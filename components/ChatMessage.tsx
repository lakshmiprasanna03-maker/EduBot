
import React from 'react';
import type { Message } from '../types';
import { BotIcon, UserIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, text } = message;
  const isUser = role === 'user';

  const containerClasses = `flex items-start space-x-4 ${isUser ? 'justify-end' : ''}`;
  
  const bubbleClasses = `p-3 md:p-4 rounded-lg max-w-lg xl:max-w-2xl ${
    isUser
      ? 'bg-blue-500 text-white rounded-br-none'
      : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none'
  }`;

  const messageText = (
    <div className={bubbleClasses}>
      <p className="whitespace-pre-wrap">{text}</p>
    </div>
  );

  const icon = isUser ? (
    <UserIcon className="h-8 w-8 text-slate-500" />
  ) : (
    <BotIcon className="h-8 w-8 text-blue-500" />
  );

  return (
    <div className={containerClasses}>
      {!isUser && <div className="flex-shrink-0">{icon}</div>}
      {messageText}
      {isUser && <div className="flex-shrink-0">{icon}</div>}
    </div>
  );
};
