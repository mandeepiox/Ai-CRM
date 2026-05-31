'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User } from 'lucide-react';

export default function AIAssistant() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: "Hi! I'm your AI assistant. I know your current contacts and pipeline. Ask me anything — like **which deal should I focus on?** or **draft a follow-up for Priya**." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMsg = async (text: string) => {
    if (!text.trim()) return;
    
    setInput('');
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Error: ' + (data.error || 'Failed to reach AI.') }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: 'Error reaching AI. Check your connection or API key.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMsg(input);
    }
  };

  const askChip = (text: string) => {
    sendMsg(text);
  };

  return (
    <div id="tab-ai" className="panel active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="topbar">
        <h2>AI Assistant</h2>
        <span className="ai-badge">
          <Bot size={14} />
          Llama-3 Powered
        </span>
      </div>
      <div className="ai-content">
        <div className="chip-row">
          <span className="chip" onClick={() => askChip("Summarize pipeline")}>Summarize pipeline</span>
          <span className="chip" onClick={() => askChip("Draft follow-up email")}>Draft follow-up email</span>
          <span className="chip" onClick={() => askChip("Top leads this week")}>Top leads this week</span>
          <span className="chip" onClick={() => askChip("Next action items")}>Next action items</span>
        </div>
        <div className="chat-messages" id="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`msg-wrapper ${msg.role === 'user' ? 'user' : 'ai'}`}>
              <div className={`msg-avatar ${msg.role === 'user' ? 'user' : 'ai'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`msg ${msg.role === 'user' ? 'user' : 'ai'}`}>
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="msg-wrapper ai">
              <div className="msg-avatar ai"><Bot size={18} /></div>
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your contacts, deals, tasks..."
            disabled={isLoading}
          />
          <button className="btn btn-primary" onClick={() => sendMsg(input)} disabled={isLoading}>
            <Send size={16} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
