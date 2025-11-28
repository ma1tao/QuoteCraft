import React, { forwardRef } from 'react';
import { CardConfig, ThemeType, AspectRatio, FontType, DateFormat } from '../types';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

interface CardPreviewProps {
  config: CardConfig;
  scale?: number; // For UI scaling purposes
}

// Helper to get theme classes (base defaults before custom overrides)
const getThemeStyles = (theme: ThemeType, customBg?: string) => {
  switch (theme) {
    case ThemeType.MINIMAL_DARK:
      return { container: 'bg-zinc-900', overlay: '' };
    case ThemeType.MINIMAL_LIGHT:
      return { container: 'bg-white', overlay: '' };
    case ThemeType.GRADIENT_SUNSET:
      return { container: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600', overlay: 'bg-black' };
    case ThemeType.GRADIENT_OCEAN:
      return { container: 'bg-gradient-to-tr from-blue-600 via-teal-400 to-emerald-400', overlay: 'bg-black' };
    case ThemeType.NEON:
      return { container: 'bg-black border-cyan-500/50 shadow-[0_0_50px_rgba(34,211,238,0.2)]', overlay: 'bg-grid-pattern' };
    case ThemeType.PAPER:
      return { container: 'bg-[#f5f0e6] bg-opacity-100', overlay: 'bg-[url("https://www.transparenttextures.com/patterns/cream-paper.png")]' };
    case ThemeType.CUSTOM_IMAGE:
      return { 
        container: 'bg-black relative overflow-hidden', 
        overlay: 'bg-black',
        style: customBg ? { backgroundImage: `url(${customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined 
      };
    default:
      return { container: 'bg-white', overlay: '' };
  }
};

export function formatDate(date: Date, format: DateFormat, lang: string) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const weekdaysZh = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekdaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayZh = weekdaysZh[date.getDay()];
  const weekdayEn = weekdaysEn[date.getDay()];
  switch (format) {
    case DateFormat.ISO_YYYY_MM_DD:
      return `${yyyy}-${mm}-${dd}`;
    case DateFormat.MM_DD_YYYY:
      return `${mm}/${dd}/${yyyy}`;
    case DateFormat.DD_MM_YYYY:
      return `${dd}/${mm}/${yyyy}`;
    case DateFormat.CN_YYYY_MM_DD:
      return `${yyyy}年${mm}月${dd}日`;
    case DateFormat.CN_WEEKDAY_YYYY_MM_DD:
      return lang === 'zh' ? `${weekdayZh}，${yyyy}年${mm}月${dd}日` : `${weekdayEn}, ${yyyy}-${mm}-${dd}`;
    default:
      return `${yyyy}-${mm}-${dd}`;
  }
}

export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ config, scale = 1 }, ref) => {
  const { t, i18n } = useTranslation();
  const themeStyles = getThemeStyles(config.theme, config.customBackgroundImage);
  
  // Dynamic font sizing based on config.fontSize (1-10)
  const baseFontSize = 1.5 + (config.fontSize * 0.25); // Base rem
  
  return (
    <div 
      className="overflow-hidden shadow-2xl transition-all duration-300 ease-in-out select-none"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      <div
        ref={ref}
        id="card-canvas"
        className={clsx(
          "relative flex flex-col p-12 transition-colors duration-500",
          config.ratio,
          themeStyles.container,
          config.font,
          config.alignment === 'text-center' ? 'items-center' : config.alignment === 'text-right' ? 'items-end' : 'items-start',
          "justify-center"
        )}
        style={{
            width: '600px', // Fixed base width for consistency, ratio handles height
            color: config.textColor,
            ...themeStyles.style
        }}
      >
        {/* Overlay for readability/texture */}
        <div 
            className={clsx("absolute inset-0 z-0 pointer-events-none transition-opacity duration-300", themeStyles.overlay)} 
            style={{ opacity: config.overlayOpacity }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-full break-words whitespace-pre-wrap leading-tight tracking-tight"
             style={{ fontSize: `${baseFontSize}rem` }}>
            
            {/* Decorative Quote Mark for some fonts */}
            {(config.font === FontType.SERIF || config.font === FontType.DISPLAY) && (
                 <span className="absolute -top-12 -left-8 text-6xl opacity-20" style={{ fontFamily: 'serif' }}>“</span>
            )}

            {config.text || t('preview.empty')}
        </div>

        {/* Footer / Author */}
        {(config.author || config.showDate) && (
          <div className={clsx(
            "relative z-10 mt-8 flex flex-col gap-1 opacity-80 font-medium uppercase tracking-widest text-sm",
            config.alignment === 'text-center' ? 'items-center' : config.alignment === 'text-right' ? 'items-end' : 'items-start',
          )}>
            {config.author && <span className="border-t-2 border-current pt-2 inline-block">{config.author}</span>}
            {config.showDate && <span className="text-[0.6rem] opacity-60">{formatDate(new Date(), config.dateFormat, i18n.language)}</span>}
          </div>
        )}
        
        <div className="absolute bottom-4 right-4 opacity-30 text-[0.6rem] font-mono z-10">
            {t('brand.watermark')}
        </div>
      </div>
    </div>
  );
});

CardPreview.displayName = "CardPreview";
