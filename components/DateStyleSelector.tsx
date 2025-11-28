import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DateFormat } from '../types';
import { clsx } from 'clsx';
import { formatDate } from './CardPreview';

interface DateStyleSelectorProps {
  value: DateFormat;
  onChange: (value: DateFormat) => void;
  disabled?: boolean;
}

export const DateStyleSelector: React.FC<DateStyleSelectorProps> = ({ value, onChange, disabled }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { value: DateFormat.ISO_YYYY_MM_DD, label: t('author.dateStyle_iso') },
    { value: DateFormat.MM_DD_YYYY, label: t('author.dateStyle_mdy') },
    { value: DateFormat.DD_MM_YYYY, label: t('author.dateStyle_dmy') },
    { value: DateFormat.CN_YYYY_MM_DD, label: t('author.dateStyle_cn') },
    { value: DateFormat.CN_WEEKDAY_YYYY_MM_DD, label: t('author.dateStyle_cnWeekday') },
  ];

  const selectedOption = options.find(opt => opt.value === value) || options[0];
  
  // Preview date for visual feedback
  const previewDate = new Date();

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className={clsx(
        "text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors",
        disabled ? "text-zinc-600" : "text-zinc-400"
      )}>
        <Calendar size={14} />
        {t('author.dateStyle')}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={clsx(
            "w-full flex items-center justify-between rounded-xl p-3 text-sm transition-all border",
            disabled 
              ? "bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed" 
              : isOpen
                ? "bg-zinc-900 border-indigo-500 text-white ring-1 ring-indigo-500"
                : "bg-black/40 border-white/10 text-white hover:border-white/20 hover:bg-white/5"
          )}
        >
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-medium">{selectedOption.label}</span>
            {!disabled && (
               <span className="text-[10px] text-zinc-500 font-mono">
                 {formatDate(previewDate, value, i18n.language)}
               </span>
            )}
          </div>
          <ChevronDown 
            size={16} 
            className={clsx(
              "transition-transform duration-200",
              isOpen ? "rotate-180 text-indigo-400" : "text-zinc-500"
            )} 
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-2 bg-neutral-900 border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="max-h-64 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "w-full text-left px-3 py-2.5 text-sm flex items-center justify-between transition-colors group",
                    value === option.value 
                      ? "bg-indigo-500/10 text-indigo-300" 
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    <span>{option.label}</span>
                    <span className={clsx(
                        "text-[10px] font-mono transition-colors",
                        value === option.value ? "text-indigo-400/70" : "text-zinc-600 group-hover:text-zinc-500"
                    )}>
                        {formatDate(previewDate, option.value, i18n.language)}
                    </span>
                  </div>
                  {value === option.value && (
                    <Check size={14} className="text-indigo-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
