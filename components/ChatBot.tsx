
import React, { useState, useRef, useEffect } from 'react';
import { chatWithBrandExpert } from '../geminiService';
import { BrandIdentity } from '../types';

interface ChatBotProps {
  brandContext: BrandIdentity;
}

export const ChatBot: React.FC<ChatBotProps> = ({ brandContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const aiResponse = await chatWithBrandExpert(userMsg, brandContext);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error: any) {
      console.error(error);
      // Fixed: Handle key selection if requested entity is not found in chat context
      if (error?.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
      setMessages(prev => [...prev, { role: 'ai', text: "Lo siento, tuve un problema conectando con mi cerebro creativo. ¿Podrías repetir?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 glass rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in max-h-[70vh]">
          <div className="bg-indigo-600 p-4 text-white font-semibold flex justify-between items-center">
            <span>Consultor de Marca</span>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50">
            {messages.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center">¡Hola! Soy tu consultor de {brandContext.brandName}. ¿En qué puedo ayudarte hoy?</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl animate-pulse text-xs text-gray-400">Pensando...</div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pregunta sobre tu marca..."
                className="flex-1 text-sm border-none focus:ring-0 p-2"
              />
              <button onClick={handleSend} className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition">
                <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
