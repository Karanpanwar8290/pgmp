'use client';

import { useState, useEffect, useRef, useTransition, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import type { ChatListItem, Message } from './types';
import { getChatList, getChat, sendMessage, deleteChat } from './actions';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bot, PlusCircle, SendHorizonal, Sparkles, Trash2, X, DatabaseZap, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { isFirebaseEnabled } from '@/lib/firebase/client';

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const isDbConnected = isFirebaseEnabled();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        setTimeout(() => viewport.scrollTop = viewport.scrollHeight, 0);
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Fetch chat list only if DB is connected and user is available
  useEffect(() => {
    if (user && isDbConnected) {
      setIsListLoading(true);
      getChatList(user.uid).then((list) => {
        setChatList(list);
      }).finally(() => {
        setIsListLoading(false);
      });
    } else {
      setIsListLoading(false);
    }
  }, [user, isDbConnected]);

  const handleSelectChat = useCallback(async (chatId: string) => {
    if (activeChatId === chatId || !isDbConnected) return;
    setIsChatLoading(true);
    setActiveChatId(chatId);
    setMessages([]);
    const chat = await getChat(chatId, user!.uid);
    setMessages(chat?.messages || []);
    setIsChatLoading(false);
  }, [activeChatId, user, isDbConnected]);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInput('');
  };

  const handleDeleteChat = (chatId: string) => {
    if (!user || !isDbConnected) return;
    startTransition(async () => {
        const result = await deleteChat(chatId, user.uid);
        if (result.success) {
          toast({ title: "Chat deleted" });
          setChatList(prev => prev.filter(c => c.id !== chatId));
          if (activeChatId === chatId) {
              handleNewChat();
          }
        } else {
          toast({ title: "Error", description: result.error, variant: 'destructive' });
        }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !user || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const optimisticHistory = [...messages, userMessage];

    setMessages(optimisticHistory);
    const messageToSend = input;
    setInput('');
    setIsLoading(true);
    
    try {
        const result = await sendMessage({
            chatId: activeChatId,
            userId: user.uid,
            message: messageToSend,
            history: messages,
        });

        setMessages(prev => [...prev, result.aiResponse]);

        // If it was a new chat and DB is connected, it now has an ID.
        if (!activeChatId && result.chatId) {
            setActiveChatId(result.chatId);
            setChatList(prev => [{ id: result.chatId!, title: result.title }, ...prev]);
        }
    } catch (error) {
        console.error("Error sending message:", error);
        toast({ title: "Error", description: "Failed to send message.", variant: 'destructive' });
        setMessages(messages); // Revert optimistic update on error
    } finally {
        setIsLoading(false);
    }
  };
  
  const activeChatTitle = (isDbConnected && chatList.find(c => c.id === activeChatId)?.title) || "New Conversation";

  return (
    <div className="flex h-full border rounded-lg overflow-hidden">
      {/* Left Sidebar for Chats */}
      <aside className="w-full max-w-xs border-r flex flex-col bg-background md:w-1/3 lg:w-1/4 shrink-0">
        <div className="p-2 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="md:hidden"> <SidebarTrigger /> </div>
            <h2 className="text-lg font-semibold font-headline">Conversations</h2>
          </div>
          <Button onClick={handleNewChat} size="icon" variant="ghost" disabled={!isDbConnected && !!activeChatId}>
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {!isDbConnected ? (
                <div className="p-4 text-center text-sm text-muted-foreground space-y-2">
                    <DatabaseZap className="mx-auto h-8 w-8 text-amber-500" />
                    <p className="font-semibold">Database Not Connected</p>
                    <p>Chat history is disabled. Your conversations will not be saved.</p>
                </div>
            ) : isListLoading ? (
                Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-9 w-full rounded-md" />)
            ) : chatList.length > 0 ? (
              chatList.map(chat => (
                <div key={chat.id} className="group relative">
                  <Button
                    variant={activeChatId === chat.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start truncate pr-8"
                    onClick={() => handleSelectChat(chat.id)}
                    disabled={isChatLoading}
                  >
                    {chat.title}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100"
                    onClick={() => handleDeleteChat(chat.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                    <History className="mx-auto h-8 w-8 mb-2" />
                    No conversations yet.
                </div>
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold font-headline truncate" title={activeChatTitle}>{activeChatTitle}</h2>
            {activeChatId && <Button variant="outline" size="icon" onClick={handleNewChat}><X className="h-4 w-4" /></Button>}
        </header>

        <main className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-4 md:p-6 space-y-6">
              {isChatLoading ? (
                <div className="flex justify-center items-center h-full"><Bot className="h-8 w-8 animate-spin" /></div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-20">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Bot size={48} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Wellbeing Coach</h3>
                  <p className="max-w-md mt-2">How can I help you today? 😊</p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={cn("flex items-start gap-4", m.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {m.role === 'model' && (
                      <Avatar className="h-9 w-9 border border-primary">
                        <div className="h-full w-full flex items-center justify-center bg-primary"> <Sparkles className="h-5 w-5 text-primary-foreground" /> </div>
                      </Avatar>
                    )}
                    <div className={cn("max-w-xl rounded-xl px-4 py-3 text-sm", m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                    {m.role === 'user' && (
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex items-start gap-4 justify-start">
                  <Avatar className="h-9 w-9 border border-primary">
                    <div className="h-full w-full flex items-center justify-center bg-primary"> <Sparkles className="h-5 w-5 text-primary-foreground" /> </div>
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
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about exercise, sleep, or stress..."
              autoComplete="off"
              disabled={isLoading || isChatLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || isChatLoading || !input.trim()}>
              <SendHorizonal />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </footer>
      </div>
    </div>
  );
}
