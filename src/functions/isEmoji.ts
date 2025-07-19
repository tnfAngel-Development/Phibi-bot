const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
export const isEmoji = (text: string) => emojiRegex.test(text);
