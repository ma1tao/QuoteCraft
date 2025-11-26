export enum FontType {
  SANS = 'font-sans',
  SERIF = 'font-serif',
  DISPLAY = 'font-display',
  MONO = 'font-mono',
  HANDWRITING = 'font-handwriting',
  CONDENSED = 'font-condensed',
  MARKER = 'font-marker',
}

export enum AspectRatio {
  SQUARE = 'aspect-square', // 1:1
  PORTRAIT = 'aspect-[3/4]', // 3:4
  STORY = 'aspect-[9/16]', // 9:16
  LANDSCAPE = 'aspect-[16/9]', // 16:9
}

export enum ThemeType {
  MINIMAL_DARK = 'minimal-dark',
  MINIMAL_LIGHT = 'minimal-light',
  GRADIENT_SUNSET = 'gradient-sunset',
  GRADIENT_OCEAN = 'gradient-ocean',
  NEON = 'neon',
  PAPER = 'paper',
  CUSTOM_IMAGE = 'custom-image',
}

export interface CardConfig {
  text: string;
  author: string;
  font: FontType;
  ratio: AspectRatio;
  theme: ThemeType;
  customBackgroundImage?: string; // Base64 or URL
  fontSize: number; // Scale 1-10
  alignment: 'text-left' | 'text-center' | 'text-right';
  showDate: boolean;
  textColor: string;
  overlayOpacity: number; // 0 to 1
}

export interface PolishResult {
  polishedText: string;
  suggestedAuthor?: string;
}