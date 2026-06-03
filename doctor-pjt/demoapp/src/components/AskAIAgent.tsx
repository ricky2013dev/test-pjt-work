import { useState, useRef, useEffect } from 'react';
import { AI_RESPONSES, AI_FALLBACK } from '../data/aiResponses';

interface Message {
  role: 'user' | 'agent';
  content: string;
  isTyping?: boolean;
}

const SUGGESTIONS = [
  'Which patients need pre-auth this week?',
  'Who has unpaid balances?',
  "Summarize today's schedule",
  'Which patients are high risk today?',
  'Show overdue recalls',
  'Any insurance issues this month?',
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-[7px] h-[7px] rounded-full bg-text3 inline-block"
          style={{
            animation: 'bounce 1.2s infinite ease-in-out',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function AskAIAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getReply = (q: string): string => {
    const lower = q.toLowerCase();
    const match = AI_RESPONSES.find(r => r.match.some(k => lower.includes(k)));
    return match ? match.reply : AI_FALLBACK;
  };

  const sendMessage = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || isTyping) return;

    if (!started) setStarted(true);

    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setInput('');
    setIsTyping(true);

    // Add typing indicator
    setMessages(prev => [...prev, { role: 'agent', content: '', isTyping: true }]);

    setTimeout(() => {
      const reply = getReply(q);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'agent', content: reply, isTyping: false };
        return updated;
      });
      setIsTyping(false);
      setTimeout(() => chatInputRef.current?.focus(), 50);
    }, 1100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Empty state
  if (!started) {
    return (
      <div className="flex flex-col h-[600px]">
        <div className="flex-1 flex flex-col items-center justify-start px-10 py-9 gap-0">
          <div className="text-3xl text-teal mb-3.5 leading-none">✦</div>
          <div className="text-xl font-semibold text-text1 mb-2">Ask anything about your patients</div>

          {/* Input centered */}
          <div className="flex gap-2.5 items-end w-full max-w-[660px] mb-0">
            <textarea
              ref={inputRef}
              className="flex-1 border border-border rounded-xl px-4 py-[11px] text-[13px] text-text1 bg-bg outline-none resize-none min-h-[44px] max-h-[140px] font-[inherit] leading-relaxed transition-all focus:border-teal focus:bg-white focus:shadow-[0_0_0_3px_rgba(42,175,168,0.15)]"
              rows={1}
              placeholder="Ask about a patient, schedule, insurance, treatment history..."
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              className="w-11 h-11 rounded-xl border-none bg-navy text-white cursor-pointer flex-shrink-0 flex items-center justify-center text-base transition-opacity hover:opacity-85 disabled:opacity-35 disabled:cursor-default"
              onClick={() => sendMessage()}
              disabled={isTyping || !input.trim()}
            >
              ➤
            </button>
          </div>

          <div className="text-[13px] text-text3 max-w-[420px] leading-[1.7] text-center mt-2 mb-4">
            Ask about schedules, action items, insurance, treatment and more.
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 justify-center max-w-[700px]">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                className="bg-white border border-border rounded-full px-[18px] py-[7px] text-xs text-text2 cursor-pointer whitespace-nowrap transition-all hover:bg-teal-light hover:border-teal hover:text-navy"
                onClick={() => sendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Chat state
  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-10 py-7 flex flex-col gap-5 scroll-smooth">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 items-start max-w-[820px] ${msg.role === 'user' ? 'flex-row-reverse self-end' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-[30px] h-[30px] rounded-full flex-shrink-0 flex items-center justify-center font-bold ${
                msg.role === 'agent'
                  ? 'text-white text-sm'
                  : 'bg-navy text-white text-[11px]'
              }`}
              style={msg.role === 'agent' ? { background: 'linear-gradient(135deg, #2aafa8, #1b3a4b)' } : undefined}
            >
              {msg.role === 'agent' ? '✦' : 'SK'}
            </div>

            {/* Bubble */}
            <div
              className={`px-4 py-3 rounded-2xl text-[13px] leading-[1.65] max-w-[680px] ${
                msg.role === 'agent'
                  ? 'bg-bg border border-border text-text1 rounded-tl-[4px]'
                  : 'bg-navy text-white rounded-tr-[4px]'
              }`}
            >
              {msg.isTyping ? (
                <TypingDots />
              ) : msg.role === 'agent' ? (
                <div
                  className="[&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mt-1.5 [&_ul]:ml-4 [&_li]:mb-1 [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom input */}
      <div className="border-t border-border px-10 py-3.5 flex gap-2.5 items-end bg-white">
        <textarea
          ref={chatInputRef}
          className="flex-1 border border-border rounded-xl px-4 py-[11px] text-[13px] text-text1 bg-bg outline-none resize-none min-h-[44px] max-h-[140px] font-[inherit] leading-relaxed transition-all focus:border-teal focus:bg-white focus:shadow-[0_0_0_3px_rgba(42,175,168,0.15)]"
          rows={1}
          placeholder="Ask a follow-up question..."
          value={input}
          onChange={e => {
            setInput(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          className="w-11 h-11 rounded-xl border-none bg-navy text-white cursor-pointer flex-shrink-0 flex items-center justify-center text-base transition-opacity hover:opacity-85 disabled:opacity-35 disabled:cursor-default"
          onClick={() => sendMessage()}
          disabled={isTyping || !input.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
