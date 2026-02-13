
import React, { useState } from 'react';
import { BrandIdentity } from '../types';
import { generateBrandImage } from '../geminiService';

interface BrandDashboardProps {
  brand: BrandIdentity;
}

export const BrandDashboard: React.FC<BrandDashboardProps> = ({ brand }) => {
  const [primaryLogo, setPrimaryLogo] = useState<string | null>(null);
  const [secondaryMark, setSecondaryMark] = useState<string | null>(null);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [isGeneratingMark, setIsGeneratingMark] = useState(false);

  const handleGenerateLogo = async () => {
    setIsGeneratingLogo(true);
    try {
      const url = await generateBrandImage(brand.logoPrompt);
      setPrimaryLogo(url);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const handleGenerateMark = async () => {
    setIsGeneratingMark(true);
    try {
      const url = await generateBrandImage(brand.secondaryMarkPrompt);
      setSecondaryMark(url);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsGeneratingMark(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-fade-in">
      {/* Header Section */}
      <section className="text-center py-16 bg-white rounded-[3rem] shadow-sm border border-gray-100">
        <h1 className="text-6xl font-serif font-black text-gray-900 tracking-tight mb-4">
          {brand.brandName}
        </h1>
        <p className="text-xl text-indigo-600 font-medium tracking-widest uppercase mb-8">
          {brand.slogan}
        </p>
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-gray-500 leading-relaxed italic">
            "{brand.missionStatement}"
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Visual Identity Section */}
        <div className="space-y-12">
          <div className="glass p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-bold">Logotipo Primario</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleGenerateLogo}
                  disabled={isGeneratingLogo}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition"
                >
                  {isGeneratingLogo ? 'Generando...' : primaryLogo ? 'Regenerar' : 'Generar Logo'}
                </button>
              </div>
            </div>
            
            <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 group relative">
              {primaryLogo ? (
                <img src={primaryLogo} alt="Logo" className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" />
              ) : (
                <div className="text-center p-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-gray-400">Haz clic en generar para crear el logotipo con IA</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-bold">Marca Secundaria</h3>
              <button 
                onClick={handleGenerateMark}
                disabled={isGeneratingMark}
                className="text-indigo-600 font-medium hover:underline text-sm disabled:text-gray-400"
              >
                {isGeneratingMark ? 'Creando...' : 'Generar Marca'}
              </button>
            </div>
            <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
              {secondaryMark ? (
                <img src={secondaryMark} alt="Secondary Mark" className="w-full h-full object-contain p-12" />
              ) : (
                <div className="text-center opacity-40 grayscale">
                  <p className="text-sm">Icono o variante de marca</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Color Palette Section */}
        <div className="space-y-12">
          <div className="glass p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-2xl font-serif font-bold mb-8 text-center">Paleta Cromática</h3>
            <div className="flex h-64 rounded-2xl overflow-hidden shadow-lg mb-8">
              {brand.colorPalette.map((color, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 flex flex-col items-center justify-end pb-4 transition-all hover:flex-[1.5] group cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 px-2 py-1 rounded backdrop-blur-sm" style={{ color: idx > 2 ? 'white' : 'black' }}>
                    {color.hex}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {brand.colorPalette.map((color, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full shrink-0 shadow-sm border border-gray-100" style={{ backgroundColor: color.hex }}></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{color.name} <span className="text-xs text-gray-400 font-normal ml-2">{color.hex}</span></h4>
                    <p className="text-sm text-gray-500 leading-snug">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Section */}
          <div className="glass p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-2xl font-serif font-bold mb-8">Tipografía Sugerida</h3>
            <div className="space-y-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-indigo-600 font-bold mb-3">Encabezados</p>
                <h4 className="text-4xl leading-tight text-gray-900" style={{ fontFamily: 'Playfair Display' }}>
                  {brand.typography.headerFont}
                </h4>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-indigo-600 font-bold mb-3">Cuerpo de Texto</p>
                <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter' }}>
                  {brand.typography.bodyFont}: Abcdefghijklmnopqrstuvwxyz 1234567890
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 italic">
                  "{brand.typography.pairingReason}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Voice / Additional section */}
      <section className="bg-indigo-900 text-indigo-50 p-12 rounded-[3rem] shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-3xl font-serif font-bold mb-4">Voz y Tono</h3>
          <p className="text-xl leading-relaxed max-w-3xl opacity-90">
            {brand.brandVoice}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>
      </section>
    </div>
  );
};
