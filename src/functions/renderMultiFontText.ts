import type { SKRSContext2D } from '@napi-rs/canvas';
import { isEmoji } from './isEmoji';

export const renderMultiFontText = (
  context: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  mainFont: string,
  emojiFont: string,
  symbolFont: string, // Add this parameter
  maxWidth?: number
) => {
  let currentX = x;
  const characters = Array.from(text);
  
  for (const char of characters) {
    const codePoint = char.codePointAt(0)!;
    
    // Use appropriate font based on character type
    if (isEmoji(char)) {
      context.font = emojiFont;
    } else if (codePoint > 255) {
      // Special characters (non-emoji, non-ASCII)
      context.font = symbolFont;
    } else {
      context.font = mainFont;
    }
    
    if (maxWidth && currentX + context.measureText(char).width > maxWidth) {
      context.fillText('...', currentX, y);
      return;
    }
    
    context.fillText(char, currentX, y);
    currentX += context.measureText(char).width;
  }
};
