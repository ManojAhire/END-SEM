import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Trash2, Send, Bot } from 'lucide-react';
import type { ChatMessage as ChatMsg, ISSData, NewsArticle, PeopleInSpaceData } from '../../types';
import { useChatbot } from '../../hooks/useChatbot';

interface ChatWidgetProps {
  issData: ISSData | null;
  articles: NewsArticle[];
  people: PeopleInSpaceData | null;
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm dark:bg-white/10 bg-gray-100 max-w-[200px]">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Message({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex items-start gap-2 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={`px-4 py-2.5 rounded-2xl text-sm max-w-[80%] leading-relaxed ${
          isUser
            ? 'rounded-tr-sm bg-gradient-to-br from-cyan-500 to-violet-500 text-white'
            : 'rounded-tl-sm dark:bg-white/10 bg-gray-100 dark:text-slate-200 text-gray-800'
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

const SUGGESTED = [
  '🛸 Where is the ISS right now?',
  '⚡ What speed is the ISS travelling?',
  '📰 Summarize the latest tech news',
  '👩‍🚀 Who is in space?',
];

export function ChatWidget({ issData, articles, people }: ChatWidgetProps) {
  const { messages, isTyping, isOpen, setIsOpen, sendMessage, clearChat } =
    useChatbot(issData, articles, people);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendMessage(text);
  };

  return (
    <>
      {/* Floating button */}
      <button
        id="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 shadow-xl shadow-violet-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Toggle chat"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        {!isOpen && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {messages.length > 9 ? '9+' : messages.length}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] h-[520px] flex flex-col rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden animate-slide-up dark:bg-space-900/95 bg-white/95 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-violet-500/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold dark:text-white text-gray-900">ISS AI Assistant</p>
              <p className="text-xs text-cyan-500">Llama-3.2-1B · Dashboard-only</p>
            </div>
            <button
              onClick={clearChat}
              title="Clear chat"
              className="ml-auto p-1.5 rounded-lg dark:hover:bg-white/10 hover:bg-gray-100 transition-colors"
            >
              <Trash2 className="w-4 h-4 dark:text-slate-400 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-xs dark:text-slate-400 text-gray-500 text-center">
                  Ask me about ISS data or loaded news articles
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s.replace(/^.{2}\s/, ''))}
                      className="text-left text-xs p-2.5 rounded-xl dark:bg-white/5 bg-gray-50 dark:hover:bg-white/10 hover:bg-gray-100 dark:text-slate-300 text-gray-600 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg) => <Message key={msg.id} msg={msg} />)}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about ISS or news..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-3 py-2 rounded-xl text-sm dark:bg-white/5 bg-gray-100 dark:text-white text-gray-900 dark:placeholder-slate-500 placeholder-gray-400 border border-white/10 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white disabled:opacity-50 hover:shadow-md hover:shadow-cyan-500/30 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
