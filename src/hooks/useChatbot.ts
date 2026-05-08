import { useState, useCallback, useEffect } from 'react';
import { queryAI } from '../services/aiService';
import type { ChatMessage, ISSData, NewsArticle, PeopleInSpaceData } from '../types';
import toast from 'react-hot-toast';

const MAX_MESSAGES = 30;
const STORAGE_KEY = 'chat_history';

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
  } catch {}
}

export function useChatbot(
  issData: ISSData | null,
  articles: NewsArticle[],
  people: PeopleInSpaceData | null
) {
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg].slice(-MAX_MESSAGES));
      setIsTyping(true);

      try {
        const reply = await queryAI(content, issData, articles, people);
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg].slice(-MAX_MESSAGES));
      } catch (err: any) {
        toast.error('AI unavailable — check your HF token');
        const errMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '⚠️ AI service is temporarily unavailable. Please try again.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [issData, articles, people]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Chat cleared');
  }, []);

  return { messages, isTyping, isOpen, setIsOpen, sendMessage, clearChat };
}
