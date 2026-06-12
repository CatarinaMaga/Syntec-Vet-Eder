"use client";

import { UIMessage, useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';
import styles from './ChatbotWidget.module.css';

const transport = new DefaultChatTransport({ api: '/api/chat' });

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, status, error, sendMessage } = useChat({
    transport,
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Olá! 👋 Sou o **Assistente Syntec Vet**. Posso ajudar com informações sobre nossos produtos veterinários, dosagens, indicações e muito mais. Como posso ajudar?'
      } as any
    ]
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEscalate = () => {
    window.open('https://wa.me/5571999216734?text=Olá! Vim pelo Assistente Syntec Vet e gostaria de falar com o representante.', '_blank');
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        className={`${styles.fab} ${isOpen ? styles.fabOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {/* Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.chatOpen : ''}`}>
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderInfo}>
            <div className={styles.chatAvatar}>🤖</div>
            <div>
              <h4 className={styles.chatTitle}>Assistente Syntec</h4>
              <span className={styles.chatStatus}>
                <span className={styles.statusDot} /> Online
              </span>
            </div>
          </div>
          <button className={styles.escalateBtn} onClick={handleEscalate} title="Falar com representante">
            📞
          </button>
        </div>

        <div className={styles.chatMessages}>
          {messages.map((msg) => {
            const textContent = String((msg as any).content || msg.parts?.filter(p => p.type === 'text').map(p => (p as any).text).join('') || '');
            return (
            <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.botMsg}`}>
              <div className={styles.msgBubble}>
                {textContent.split('\n').map((line, i) => (
                  <span key={i}>
                    {line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                    {i < textContent.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
            );
          })}
          
          {isLoading && (
            <div className={`${styles.message} ${styles.botMsg}`}>
              <div className={styles.msgBubble}>
                <div className={styles.typingIndicator}>
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className={`${styles.message} ${styles.botMsg}`}>
              <div className={`${styles.msgBubble} ${styles.errorBubble}`}>
                ⚠️ Erro de conexão. Verifique se a chave de API do Gemini está configurada no arquivo .env.local (GOOGLE_GENERATIVE_AI_API_KEY).
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className={styles.chatInput}>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Pergunte sobre um produto..."
            className={styles.input}
            disabled={isLoading}
          />
          <button type="submit" className={styles.sendBtn} disabled={isLoading || !input.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>
    </>
  );
}
