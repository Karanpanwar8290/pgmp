export type Message = {
  role: 'user' | 'model';
  content: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt?: any;
  userId?: string;
}

export type ChatListItem = {
  id: string;
  title: string;
}
