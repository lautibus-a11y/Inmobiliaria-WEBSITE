import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User, Bot, MapPin, Bed, ShowerHead, ExternalLink, MessageCircle, Phone } from 'lucide-react';
import { processChatbotMessage, ChatbotResponse } from '../../utils/chatbotLogic';
import { Property } from '../../types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  properties?: Property[];
  isFallback?: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: '¡Hola! Soy el asistente virtual de Ivana Molina Bienes Raíces 👋. Puedo ayudarte a encontrar propiedades o responder tus consultas sobre nuestros servicios.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Quick replies
  const quickReplies = [
    "¿Cuáles son los horarios?",
    "Quiero ver propiedades aptas crédito",
    "¿Qué casas hay en venta?",
    "¿Cómo coordino una visita?",
    "Solicitar una tasación"
  ];

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate network/thinking delay for better UX
    setTimeout(() => {
      const response: ChatbotResponse = processChatbotMessage(text);
      const isFallback = response.text.includes("En este momento no encontré información específica");
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.text,
        properties: response.properties,
        isFallback
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  return (
    <>
      {/* Floating Toggle Button (Above WhatsApp) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-[88px] right-6 z-[60] w-14 h-14 bg-neutral-900 border border-white/20 text-white rounded-full shadow-2xl hover:bg-neutral-800 hover:scale-110 transition-all flex items-center justify-center group"
            aria-label="Abrir Asistente Virtual"
          >
            {/* Robot SVG with Web Colors */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-neutral-200 transition-colors">
              <rect x="3" y="11" width="18" height="10" rx="2" fill="rgba(255,255,255,0.1)"></rect>
              <circle cx="12" cy="5" r="2"></circle>
              <path d="M12 7v4"></path>
              <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3"></line>
              <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3"></line>
            </svg>
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-max bg-white text-neutral-900 text-xs font-sans p-2 px-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-neutral-100 font-medium">
              Asistente Virtual
              <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border-r border-t border-neutral-100"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95, pointerEvents: 'none' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[70] bg-neutral-950 border border-white/10 shadow-2xl shadow-black/50 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right right-4 sm:right-6 bottom-24 w-[calc(100vw-32px)] sm:w-[380px] rounded-2xl h-[450px] max-h-[60dvh] sm:h-[550px] sm:max-h-[70vh]"
          >
            {/* Header */}
            <div className="bg-neutral-900 border-b border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">Asistente Virtual</h3>
                  <p className="text-[10px] text-green-400 font-mono tracking-widest uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span> En línea
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-white transition-colors p-1"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={chatContainerRef} style={{ scrollbarWidth: 'thin' }}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                    {msg.sender === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                        <Bot size={12} className="text-white/70" />
                      </div>
                    )}
                    
                    <div className={`max-w-[85%] flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-neutral-200 text-neutral-900 rounded-tr-sm' 
                          : 'bg-neutral-800/80 text-white rounded-tl-sm border border-white/5'
                      }`}>
                        {msg.text}
                      </div>

                      {/* Display matched properties inline */}
                      {msg.properties && msg.properties.length > 0 && (
                        <div className="flex flex-col gap-2 mt-1 w-full max-w-[280px]">
                          {msg.properties.map(prop => (
                            <div key={prop.id} className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden flex flex-col hover:border-white/30 transition-colors">
                              <img src={prop.image} alt={prop.title} className="w-full h-24 object-cover filter brightness-[0.85]" />
                              <div className="p-3">
                                <h4 className="text-xs font-semibold text-white truncate">{prop.title}</h4>
                                <p className="text-[10px] text-neutral-400 truncate mb-2">{prop.location}</p>
                                <a href={`#todas-propiedades`} className="text-[10px] font-mono tracking-widest text-neutral-300 hover:text-white uppercase flex items-center gap-1">
                                  Ver detalles <ExternalLink size={10} />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Fallback actions */}
                      {msg.isFallback && (
                        <div className="flex flex-col gap-2 mt-2 w-full">
                          <a 
                            href={`https://wa.me/5491168091223?text=${encodeURIComponent('Hola, estaba buscando información en el chat y necesito hablar con un asesor.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 hover:bg-green-500 text-white text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold"
                          >
                            <Phone size={14} /> Hablar por WhatsApp
                          </a>
                          <div className="bg-neutral-900 border border-white/10 p-3 rounded-xl mt-1 flex flex-col gap-2">
                            <span className="text-[10px] text-neutral-400 font-mono uppercase mb-1">Dejanos tus datos</span>
                            <input type="text" placeholder="Tu Nombre" className="bg-neutral-950 border border-white/10 rounded-lg p-2 text-[16px] sm:text-xs text-white" />
                            <input type="tel" placeholder="Tu Teléfono" className="bg-neutral-950 border border-white/10 rounded-lg p-2 text-[16px] sm:text-xs text-white" />
                            <input type="email" placeholder="Tu Email" className="bg-neutral-950 border border-white/10 rounded-lg p-2 text-[16px] sm:text-xs text-white" />
                            <button className="bg-white text-neutral-900 text-xs py-2 rounded-lg font-semibold mt-1 hover:bg-neutral-200" onClick={() => {
                              setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: '¡Tus datos fueron enviados con éxito! Un asesor se contactará con vos a la brevedad.' }]);
                            }}>
                              Enviar Datos
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center shrink-0">
                      <Bot size={12} className="text-white/70" />
                    </div>
                    <div className="bg-neutral-800/80 border border-white/5 p-3.5 rounded-2xl rounded-tl-sm flex items-center gap-1">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

            {/* Quick Replies */}
            {messages.length < 3 && !isTyping && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(reply)}
                    className="text-[10px] md:text-xs bg-neutral-900 border border-white/10 text-neutral-300 py-1.5 px-3 rounded-full hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 bg-neutral-900 border-t border-white/10 flex items-end gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribí tu consulta..."
                  className="flex-1 bg-neutral-950 border border-white/10 rounded-xl py-2.5 px-4 text-[16px] sm:text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 shrink-0 bg-white text-neutral-900 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors"
                >
                  <Send size={14} className="ml-1" />
                </button>
              </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
