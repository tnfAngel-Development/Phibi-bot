import { isEmoji } from "./isEmoji";

export const getCharScript = (char: string): string => {
	// First check if it's an emoji using improved detection
	if (isEmoji(char)) return "emoji";

	const code = char.codePointAt(0);
	if (code === undefined) return "latin";

	// Korean ranges
	if (
		(code >= 0xac00 && code <= 0xd7af) || // Hangul Syllables
		(code >= 0x1100 && code <= 0x11ff) || // Hangul Jamo
		(code >= 0x3130 && code <= 0x318f)
	) {
		// Hangul Compatibility Jamo
		return "korean";
	}

	// Japanese ranges
	if (
		(code >= 0x3040 && code <= 0x309f) || // Hiragana
		(code >= 0x30a0 && code <= 0x30ff) || // Katakana
		(code >= 0x31f0 && code <= 0x31ff) || // Katakana Phonetic Extensions
		(code >= 0xff00 && code <= 0xffef)
	) {
		// Halfwidth and Fullwidth Forms
		return "japanese";
	}

	// Chinese ranges (Simplified and Traditional)
	if (
		(code >= 0x4e00 && code <= 0x9fff) || // CJK Unified Ideographs
		(code >= 0x3400 && code <= 0x4dbf) || // CJK Extension A
		(code >= 0x20000 && code <= 0x2a6df) || // CJK Extension B
		(code >= 0x2a700 && code <= 0x2b73f)
	) {
		// CJK Extension C
		return "han";
	}

	// Thai range
	if (code >= 0x0e00 && code <= 0x0e7f) return "thai";

	// Arabic range
	if (
		(code >= 0x0600 && code <= 0x06ff) ||
		(code >= 0x0750 && code <= 0x077f) ||
		(code >= 0x08a0 && code <= 0x08ff)
	) {
		return "arabic";
	}

	// Other non-Latin characters
	if (code > 255) return "symbol";

	return "latin";
};
