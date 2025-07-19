const emojiRegex =
	/(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji_Component})/gu;
export const isEmoji = (text: string) => emojiRegex.test(text);
