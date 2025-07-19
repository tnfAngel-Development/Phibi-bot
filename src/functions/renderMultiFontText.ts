import type { SKRSContext2D } from '@napi-rs/canvas';
import { isEmoji } from './isEmoji';

export const renderMultiFontText = (
  context: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  mainFont: string,
  emojiFont: string,
  maxWidth?: number
) => {
  let currentX = x;
  const characters = Array.from(text);
  
  for (const char of characters) {
    context.font = isEmoji(char) ? emojiFont : mainFont;
    
    if (maxWidth && currentX + context.measureText(char).width > maxWidth) {
      context.fillText('...', currentX, y);
      return;
    }
    
    context.fillText(char, currentX, y);
    currentX += context.measureText(char).width;
  }
};
