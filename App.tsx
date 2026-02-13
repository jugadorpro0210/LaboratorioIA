
import React, { useState } from 'react';
import { generateBrandStrategy } from './geminiService';
import { BrandIdentity } from './types';
import { BrandDashboard } from './components/BrandDashboard';
import { ChatBot } from './components/ChatBot';

type AppState = 'landing' | 'generating' | 'dashboard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('landing');
  const [mission, setMission] = useState('');
  const [brand, setBrand] = useState<BrandIdentity | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartGeneration = async () => {
    if (!mission.trim()) return;
    
    setState('generating');
    setError(null);
    try {
      const brandData = await generateBrandStrategy(mission);
      setBrand(brandData);
      setState('dashboard');
    } catch (e: any) {
      console.error(e);
      setError("Hubo un error al generar la identidad. Por favor intenta de nuevo.");
      setState('landing');
    }
  };

  return (
    <div className="min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl italic">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Identidad AI</span>
        </div>
        {state === 'dashboard' && (
          <button 
            onClick={() => { setMission(''); setState('landing'); setBrand(null); }}
            className="text-gray-400 hover:text-indigo-600 transition font-medium"
          >
            Nueva Marca
          </button>
        )}
      </nav>

      <main className="px-6 py-12">
        {state === 'landing' && (
          <div className="max-w-4xl mx-auto text-center animate-fade-in pt-12">
            <h1 className="text-7xl md:text-8xl font-serif font-black mb-8 leading-[1.1] tracking-tight text-gray-900">
              Tu marca, <span className="text-indigo-600 italic">imaginada</span> por IA.
            </h1>
            <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              Describe la misión de tu empresa y deja que nuestro motor de diseño cree una Biblia de Marca completa en segundos.
            </p>
            
            <div className="relative max-w-2xl mx-auto group">
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="Ej: Creamos café artesanal sostenible que empodera a las comunidades locales..."
                className="w-full h-48 p-8 text-xl glass rounded-[2.5rem] shadow-2xl border-none focus:ring-4 focus:ring-indigo-100 transition-all resize-none placeholder:text-gray-300"
              />
              <button
                onClick={handleStartGeneration}
                className="absolute bottom-4 right-4 bg-indigo-600 text-white px-8 py-4 rounded-3xl font-bold shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2 group"
              >
                Generar Identidad
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </div>
            {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
          </div>
        )}

        {state === 'generating' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
            <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h2 className="text-3xl font-serif font-bold mb-2">Destilando tu Identidad</h2>
            <p className="text-gray-400">Nuestro Gemini está configurando paletas, tipografía y estrategia de marca...</p>
          </div>
        )}

        {state === 'dashboard' && brand && (
          <>
            <BrandDashboard brand={brand} />
            <ChatBot brandContext={brand} />
          </>
        )}
      </main>

      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>© 2024 Identidad AI. Potenciado por Google Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;
