import { PolishResult } from "../types";

/**
 * AI功能已临时取消接入，返回默认值
 */
export const polishTextWithGemini = async (text: string, mode: 'poetic' | 'concise' | 'funny'): Promise<PolishResult> => {
  // AI功能已临时取消，直接返回原文本
  return { polishedText: text, suggestedAuthor: "" };
};

/**
 * AI功能已临时取消接入，返回默认值
 */
export const generateBackgroundWithGemini = async (text: string, aspectRatio: string = "1:1"): Promise<string | null> => {
  // AI功能已临时取消，直接返回null
  return null;
};