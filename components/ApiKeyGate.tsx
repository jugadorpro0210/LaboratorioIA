
import React, { useState, useEffect } from 'react';

interface ApiKeyGateProps {
  onValidated: () => void;
}

// Fixed: Removed the conflicting 'declare global' block. 
// The environment already provides 'window.aistudio' with the expected 'AIStudio' type.

export const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onValidated }) => {
  const [checking, setChecking] = useState(true);

  const checkKey = async () => {
    try {
      // Accessing the globally provided aistudio instance
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (hasKey) {
        onValidated();
      } else {
        setChecking(false);
      }
    } catch (e) {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleOpenSelector = async () => {
    // Fixed: Using the global aistudio helper to open the key selection dialog
    await (window as any).aistudio.openSelectKey();
    // After selection, we proceed immediately as instructed to mitigate race conditions
    onValidated();
  };

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Verificando acceso...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 glass rounded-3xl text-center shadow-xl animate-fade-in">
      <div className="mb-6 inline-flex p-4 rounded-full bg-indigo-50">
        <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4">Acceso a Gemini Pro Image</h2>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Para generar logotipos de alta calidad (1K/2K/4K), necesitas seleccionar una clave API de un proyecto con facturación habilitada.
      </p>
      <button
        onClick={handleOpenSelector}
        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg"
      >
        Seleccionar Clave API
      </button>
      {/* Added mandatory link to billing documentation as per guidelines */}
      <a 
        href="https://ai.google.dev/gemini-api/docs/billing" 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
      >
        Aprender sobre facturación en Google AI Studio
      </a>
    </div>
  );
};
