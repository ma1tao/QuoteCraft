import React, { useState, useRef } from 'react';
import { Download, Wand2, Image as ImageIcon, RefreshCw, Type, Palette, AlignLeft, AlignCenter, AlignRight, Upload, X } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { CardPreview } from './components/CardPreview';
import LanguageSwitcher from './components/LanguageSwitcher';
import { DateStyleSelector } from './components/DateStyleSelector';
import { CardConfig, FontType, AspectRatio, ThemeType, DateFormat } from './types';
 
import { useTranslation } from 'react-i18next';

const DEFAULT_CONFIG: CardConfig = {
  text: "Creativity is intelligence having fun.",
  author: "Albert Einstein",
  font: FontType.SANS,
  ratio: AspectRatio.SQUARE,
  theme: ThemeType.MINIMAL_DARK,
  fontSize: 5,
  alignment: 'text-center',
  showDate: false,
  textColor: '#ffffff',
  overlayOpacity: 0,
  dateFormat: DateFormat.ISO_YYYY_MM_DD,
};

// Preset high-quality backgrounds
const BACKGROUND_PRESETS = [
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", // Nature
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80", // Abstract Gradient
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80", // Neon
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", // Beach
    "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80", // Stars
    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80", // Texture
];

// Preset Text Colors
const COLOR_PRESETS = [
    '#ffffff', '#000000', '#f8fafc', '#18181b', 
    '#f87171', '#fb923c', '#facc15', '#4ade80', 
    '#22d3ee', '#818cf8', '#e879f9', '#fb7185'
];

export default function App() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<CardConfig>(DEFAULT_CONFIG);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'style' | 'text' | 'bg'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<{ [key: string]: CardConfig }>({});
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Global error handler
  const handleError = (message: string) => {
    setError(message);
    // Auto-dismiss error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  // Clear error manually
  const clearError = () => setError(null);

  // Load saved configs from localStorage on component mount
  React.useEffect(() => {
    const loadSavedConfigs = () => {
      try {
        const saved = localStorage.getItem('quotesnap-configs');
        if (saved) {
          setSavedConfigs(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Failed to load saved configs:', err);
      }
    };
    const loadPreferences = () => {
      try {
        const prefRaw = localStorage.getItem('quotesnap-preferences');
        if (prefRaw) {
          const pref = JSON.parse(prefRaw);
          if (pref?.dateFormat) {
            setConfig(prev => ({ ...prev, dateFormat: pref.dateFormat }));
          }
        }
      } catch (err) {
        console.error('Failed to load preferences:', err);
      }
    };
    loadSavedConfigs();
    loadPreferences();
  }, []);

  React.useEffect(() => {
    try {
      const prefRaw = localStorage.getItem('quotesnap-preferences');
      const base = prefRaw ? JSON.parse(prefRaw) : {};
      const nextPref = { ...base, dateFormat: config.dateFormat };
      localStorage.setItem('quotesnap-preferences', JSON.stringify(nextPref));
    } catch {}
  }, [config.dateFormat]);

  // Save config to localStorage
  const saveConfig = () => {
    try {
      const name = prompt(t('prompt.saveName'));
      if (name) {
        const updatedConfigs = { ...savedConfigs, [name]: config };
        setSavedConfigs(updatedConfigs);
        localStorage.setItem('quotesnap-configs', JSON.stringify(updatedConfigs));
        handleError(t('toast.saved'));
      }
    } catch (err) {
      handleError(t('errors.save'));
      console.error('Save config error:', err);
    }
  };

  // Load config from localStorage
  const loadConfig = (name: string) => {
    try {
      const configToLoad = savedConfigs[name];
      if (configToLoad) {
        setConfig(configToLoad);
        handleError(t('toast.loaded'));
      }
    } catch (err) {
      handleError(t('errors.load'));
      console.error('Load config error:', err);
    }
  };

  // Delete saved config
  const deleteConfig = (name: string) => {
    try {
      const updatedConfigs = { ...savedConfigs };
      delete updatedConfigs[name];
      setSavedConfigs(updatedConfigs);
      localStorage.setItem('quotesnap-configs', JSON.stringify(updatedConfigs));
    } catch (err) {
      handleError(t('errors.delete'));
      console.error('Delete config error:', err);
    }
  };

  // Handlers
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig(prev => ({ ...prev, text: e.target.value }));
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, author: e.target.value }));
  };

  

  

  

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setConfig(prev => ({
          ...prev,
          theme: ThemeType.CUSTOM_IMAGE,
          customBackgroundImage: result,
          overlayOpacity: 0.3, // Add default overlay for readability
          textColor: '#ffffff'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `quotesnap-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      handleError(t('errors.download'));
      console.error('Failed to download image', err);
    }
  };

  const updateTheme = (theme: ThemeType) => {
      let defaultColor = '#ffffff';
      let defaultOpacity = 0;
      
      if (theme === ThemeType.MINIMAL_LIGHT || theme === ThemeType.PAPER) {
          defaultColor = '#18181b';
      }
      if (theme === ThemeType.NEON) {
          defaultColor = '#22d3ee';
          defaultOpacity = 0.5;
      }
      if (theme === ThemeType.GRADIENT_OCEAN || theme === ThemeType.GRADIENT_SUNSET) {
          defaultOpacity = 0.1;
      }

      setConfig(prev => ({ 
          ...prev, 
          theme, 
          textColor: defaultColor,
          overlayOpacity: defaultOpacity,
          // Clear custom bg if switching to a non-image theme
          customBackgroundImage: theme === ThemeType.CUSTOM_IMAGE ? prev.customBackgroundImage : undefined
      }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-zinc-200 font-sans selection:bg-indigo-500/30">
      
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full">
          <div className="bg-red-900/90 backdrop-blur-sm border border-red-500/30 rounded-lg shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-red-300">⚠️</div>
              <span className="text-red-100 text-sm font-medium">{error}</span>
            </div>
            <button 
              onClick={clearError}
              className="text-red-200 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Wand2 size={18} className="text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">{t('brand.title')}</h1>
          </div>
          <div className="flex gap-2 relative">
            <LanguageSwitcher />
            <button 
              onClick={saveConfig}
              className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors px-4 py-2"
            >
              <span className="hidden sm:inline">{t('nav.save')}</span>
            </button>
            
            {/* Share Button */}
            <div className="relative">
              <button 
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors px-4 py-2"
              >
                <span className="hidden sm:inline">{t('nav.share')}</span>
              </button>
              
              {/* Share Options Dropdown */}
              {showShareOptions && (
                <div className="absolute right-0 top-full mt-2 bg-neutral-800 border border-white/10 rounded-lg shadow-xl p-3 w-48 z-50">
                  <div className="space-y-2">
                    <button 
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(window.location.href);
                          handleError(t('toast.linkCopied'));
                          setShowShareOptions(false);
                        } catch (err) {
                          handleError(t('errors.copy'));
                        }
                      }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 rounded-md transition-colors"
                    >
                      <span>{t('nav.copy')}</span>
                    </button>
                    <button 
                      onClick={() => {
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out my quote card created with QuoteCraft!`, '_blank');
                        setShowShareOptions(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 rounded-md transition-colors"
                    >
                      <span>{t('nav.twitter')}</span>
                    </button>
                    <button 
                      onClick={() => {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                        setShowShareOptions(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 rounded-md transition-colors"
                    >
                      <span>{t('nav.facebook')}</span>
                    </button>
                    <button 
                      onClick={() => {
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                        setShowShareOptions(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 rounded-md transition-colors"
                    >
                      <span>{t('nav.linkedin')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleDownload}
              className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Download size={16} />
              <span className="hidden sm:inline">{t('nav.download')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Panel: Controls */}
        <div className="w-full lg:w-[400px] lg:border-r border-white/10 flex flex-col bg-neutral-900/30 h-full overflow-y-auto scrollbar-hide">
          
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button 
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-4 text-xs font-medium uppercase tracking-wide transition-colors flex items-center justify-center gap-2 ${activeTab === 'text' ? 'text-white border-b-2 border-indigo-500 bg-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Type size={14} /> {t('tabs.text')}
            </button>
            <button 
              onClick={() => setActiveTab('style')}
              className={`flex-1 py-4 text-xs font-medium uppercase tracking-wide transition-colors flex items-center justify-center gap-2 ${activeTab === 'style' ? 'text-white border-b-2 border-indigo-500 bg-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Palette size={14} /> {t('tabs.design')}
            </button>
             <button 
              onClick={() => setActiveTab('bg')}
              className={`flex-1 py-4 text-xs font-medium uppercase tracking-wide transition-colors flex items-center justify-center gap-2 ${activeTab === 'bg' ? 'text-white border-b-2 border-indigo-500 bg-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <ImageIcon size={14} /> {t('tabs.background')}
            </button>
          </div>

          <div className="p-6 space-y-8 flex-1 overflow-y-auto">
            
            {activeTab === 'text' && (
              <div className="space-y-6">
                {/* Text Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('editor.message')}</label>
                  <textarea
                    value={config.text}
                    onChange={handleTextChange}
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                    placeholder={t('editor.placeholder')}
                  />
                  <div className="flex gap-2">
                    <button 
                       onClick={() => setConfig(prev => ({ ...prev, text: '' }))}
                       className="px-3 py-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
                    >
                      {t('editor.clear')}
                    </button>
                  </div>
                </div>

                {/* Author Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('author.label')}</label>
                  <input
                    type="text"
                    value={config.author}
                    onChange={handleAuthorChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder={t('author.placeholder')}
                  />
                  <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="showDate"
                        checked={config.showDate}
                        onChange={(e) => setConfig(prev => ({ ...prev, showDate: e.target.checked }))}
                        className="rounded border-zinc-700 bg-zinc-800 text-indigo-500 focus:ring-indigo-500/50"
                    />
                    <label htmlFor="showDate" className="text-sm text-zinc-400">{t('author.includeDate')}</label>
                  </div>
                  <DateStyleSelector
                    value={config.dateFormat}
                    onChange={(val) => setConfig(prev => ({ ...prev, dateFormat: val }))}
                    disabled={!config.showDate}
                  />
                </div>
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-8">
                
                {/* Saved Configs */}
                {Object.keys(savedConfigs).length > 0 && (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('design.saved')}</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {Object.keys(savedConfigs).map((name) => (
                        <div 
                          key={name} 
                          className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg"
                        >
                          <button
                            onClick={() => loadConfig(name)}
                            className="text-left text-sm text-zinc-300 hover:text-white transition-colors flex-1"
                          >
                            {name}
                          </button>
                          <button
                            onClick={() => deleteConfig(name)}
                            className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Themes */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('design.base')}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.values(ThemeType).map((theme) => {
                        if (theme === ThemeType.CUSTOM_IMAGE) return null;
                        return (
                            <button
                                key={theme}
                                onClick={() => updateTheme(theme)}
                                className={`h-10 rounded-lg border transition-all ${config.theme === theme ? 'ring-2 ring-indigo-500 border-transparent scale-105' : 'border-white/10 hover:border-white/30'}`}
                                style={{
                                    background: theme === ThemeType.MINIMAL_DARK ? '#18181b' : 
                                                theme === ThemeType.MINIMAL_LIGHT ? '#ffffff' :
                                                theme === ThemeType.GRADIENT_SUNSET ? 'linear-gradient(to bottom right, #fb923c, #db2777)' :
                                                theme === ThemeType.GRADIENT_OCEAN ? 'linear-gradient(to top right, #2563eb, #34d399)' :
                                                theme === ThemeType.NEON ? '#000' :
                                                theme === ThemeType.PAPER ? '#f5f0e6' : '#333'
                                }}
                                title={theme}
                            />
                        )
                    })}
                  </div>
                </div>

                 {/* Typography */}
                 <div className="space-y-3">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('design.font')}</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(FontType).map(f => (
                            <button
                                key={f}
                                onClick={() => setConfig(prev => ({ ...prev, font: f }))}
                                className={`py-2 px-3 rounded-lg border text-sm text-left transition-all ${f} ${config.font === f ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}
                            >
                                {f.replace('font-', '').charAt(0).toUpperCase() + f.replace('font-', '').slice(1)}
                            </button>
                        ))}
                    </div>
                 </div>

                 {/* Text Color */}
                 <div className="space-y-3">
                     <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('design.color')}</label>
                     <div className="flex flex-wrap gap-2">
                         {COLOR_PRESETS.map(color => (
                             <button
                                key={color}
                                onClick={() => setConfig(prev => ({ ...prev, textColor: color }))}
                                className={`w-8 h-8 rounded-full border border-white/10 ${config.textColor === color ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-neutral-900' : ''}`}
                                style={{ backgroundColor: color }}
                             />
                         ))}
                         <div className="relative w-8 h-8 overflow-hidden rounded-full border border-white/10 group cursor-pointer">
                             <input 
                                type="color" 
                                value={config.textColor}
                                onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                             />
                             <div className="w-full h-full bg-[conic-gradient(from_180deg_at_50%_50%,#FF0000_0deg,#00FF00_120deg,#0000FF_240deg,#FF0000_360deg)] opacity-80 group-hover:opacity-100 transition-opacity" />
                         </div>
                     </div>
                 </div>

                 {/* Font Size & Alignment */}
                 <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-zinc-400">
                            <span>{t('design.size')}</span>
                            <span>{config.fontSize}</span>
                        </div>
                        <input 
                            type="range" min="1" max="10" step="0.5"
                            value={config.fontSize}
                            onChange={(e) => setConfig(prev => ({ ...prev, fontSize: parseFloat(e.target.value) }))}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>
                    <div className="flex gap-2 justify-center">
                         {[
                             { val: 'text-left', icon: AlignLeft },
                             { val: 'text-center', icon: AlignCenter },
                             { val: 'text-right', icon: AlignRight },
                         ].map((a) => (
                            <button
                                key={a.val}
                                onClick={() => setConfig(prev => ({ ...prev, alignment: a.val as any }))}
                                className={`p-2 rounded-md transition-colors ${config.alignment === a.val ? 'bg-indigo-500 text-white' : 'text-zinc-600 hover:bg-white/5 hover:text-zinc-400'}`}
                            >
                                <a.icon size={18} />
                            </button>
                         ))}
                    </div>
                 </div>
                 
                 {/* Layout & Ratio */}
                 <div className="space-y-3 pt-4 border-t border-white/10">
                   <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('design.ratio')}</label>
                   <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-white/10">
                      {[
                          { val: AspectRatio.SQUARE, label: '1:1', icon: 'Square' },
                          { val: AspectRatio.PORTRAIT, label: '3:4', icon: 'Portrait' },
                          { val: AspectRatio.STORY, label: '9:16', icon: 'Story' },
                          { val: AspectRatio.LANDSCAPE, label: '16:9', icon: 'Wide' },
                      ].map(r => (
                          <button
                            key={r.val}
                            onClick={() => setConfig(prev => ({ ...prev, ratio: r.val }))}
                            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${config.ratio === r.val ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                          >
                              {r.label}
                          </button>
                      ))}
                   </div>
                </div>

              </div>
            )}

            {activeTab === 'bg' && (
                <div className="space-y-8">
                    
                    {/* Overlay Opacity */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-zinc-400">
                            <span>{t('background.overlay')}</span>
                            <span>{Math.round(config.overlayOpacity * 100)}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="0.9" step="0.05"
                            value={config.overlayOpacity}
                            onChange={(e) => setConfig(prev => ({ ...prev, overlayOpacity: parseFloat(e.target.value) }))}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>

                    {/* Upload */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('background.custom')}</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-8 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-white/5 transition-all gap-2"
                        >
                            <Upload size={24} />
                            <span className="text-xs font-medium">{t('background.upload')}</span>
                        </button>
                    </div>

                    

                    {/* Presets */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('background.presets')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {BACKGROUND_PRESETS.map((url, i) => (
                                <button
                                    key={i}
                                    onClick={() => setConfig(prev => ({
                                        ...prev,
                                        theme: ThemeType.CUSTOM_IMAGE,
                                        customBackgroundImage: url,
                                        overlayOpacity: 0.3,
                                        textColor: '#ffffff'
                                    }))}
                                    className="aspect-video rounded-lg bg-zinc-800 bg-cover bg-center border border-white/10 hover:border-white/50 transition-all hover:scale-[1.02]"
                                    style={{ backgroundImage: `url(${url})` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-neutral-950 relative flex items-center justify-center p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80 pointer-events-none" />
            
            {/* The actual capture target, centered and scaled */}
            <div className="relative z-10 shadow-2xl shadow-black/50 rounded-sm ring-1 ring-white/10">
                <CardPreview ref={cardRef} config={config} />
            </div>


        </div>
      </main>
    </div>
  );
}
