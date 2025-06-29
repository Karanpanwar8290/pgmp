'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SendHorizonal, Bot, Sparkles, Trash2 } from 'lucide-react';
import { chat } from '@/ai/flows/chat';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  role: 'user' | 'model';
  content: string;
};

const CHAT_HISTORY_KEY = 'wellbeing-chat-history';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on initial render
  useEffect(() => {
    try {
      const storedMessages = window.localStorage.getItem(CHAT_HISTORY_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
        console.error("Failed to load chat history from localStorage", error);
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
      } else {
        window.localStorage.removeItem(CHAT_HISTORY_KEY);
      }
    } catch (error) {
        console.error("Failed to save chat history to localStorage", error);
    }
  }, [messages]);


  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const aiResponse = await chat({ history, message: input });

      const modelMessage: Message = { role: 'model', content: aiResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: Message = { role: 'model', content: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    window.localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
            <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">AI Coach</h2>
                <p className="text-muted-foreground">Your personal guide to a healthier you.</p>
            </div>
        </div>
        <Button 
            variant="outline" 
            size="icon" 
            onClick={handleClearHistory} 
            disabled={messages.length === 0 || isLoading}
            aria-label="Clear chat history"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-4 md:p-6 space-y-6">
              {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-20">
                      <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <Bot size={48} className="text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Welcome to your AI Coach!</h3>
                      <p className="max-w-md mt-2">I'm Wellbot, your friendly guide to better wellbeing. You can ask me for fitness tips, stress management techniques, or just chat about your day. How can I help you today? 😊</p>
                  </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={cn("flex items-start gap-4", m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {m.role === 'model' && (
                    <Avatar className="h-9 w-9 border border-primary">
                      <div className="h-full w-full flex items-center justify-center bg-primary">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </Avatar>
                  )}
                  <div className={cn("max-w-lg rounded-xl px-4 py-3 text-sm", m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                  {m.role === 'user' && (
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="woman portrait" />
                      <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4 justify-start">
                    <Avatar className="h-9 w-9 border border-primary">
                      <div className="h-full w-full flex items-center justify-center bg-primary">
                          <Sparkles className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </Avatar>
                    <div className="max-w-md rounded-xl px-4 py-3 bg-secondary text-secondary-foreground">
                      <div className="flex items-center space-x-2">
                          <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                          <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                          <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span>
                      </div>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
      </main>
      <footer className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about exercise, sleep, or stress..."
            autoComplete="off"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <SendHorizonal />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </footer>
    </div>
  )
}
