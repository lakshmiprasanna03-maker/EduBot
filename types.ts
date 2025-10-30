
export type MessageRole = 'user' | 'model';

export interface Message {
  role: MessageRole;
  text: string;
}
