import type { SKRSContext2D } from "@napi-rs/canvas";
import { getCharScript } from "./fontUtils";

export const renderMultiFontText = (
	context: SKRSContext2D,
	text: string,
	x: number,
	y: number,
	baseFont: string,
	maxWidth?: number,
	useBold = true  // New parameter to control bold usage
) => {
	let currentX = x;

	// Create a TextMetrics object to track rendering
	const metrics = context.measureText(text);

	// Use Intl.Segmenter for grapheme cluster segmentation
	const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
	const segments = Array.from(segmenter.segment(text));

	// Extract base font size from baseFont string
	const fontSizeMatch = baseFont.match(/(\d+)px/);
	const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1], 10) : 40;

	for (const segment of segments) {
		const char = segment.segment;
		const script = getCharScript(char);

		let fontFamily;
		switch (script) {
			case "emoji":
				fontFamily = "Noto Color Emoji";
				break;
			case "arabic":
				fontFamily = "Noto Sans Arabic";
				break;
			case "thai":
				fontFamily = "Noto Sans Thai";
				break;
			case "japanese":
				fontFamily = "Noto Sans JP";
				break;
			case "korean":
				fontFamily = "Noto Sans KR";
				break;
			case "han":
				fontFamily = "Noto Sans SC";
				break;
			case "symbol":
				fontFamily = "Segoe UI Symbol";
				break;
			default:
				// For Latin and others, extract font family from baseFont
				const match = baseFont.match(/"([^"]+)"/);
				fontFamily = match ? match[1] : "Asap";
		}

		// Set the font with conditional bold
		const fontWeight = (useBold && script !== "emoji" && script !== "symbol")
			? "bold "
			: "";
		context.font = `${fontWeight}${fontSize}px "${fontFamily}"`;

		// Check if we're exceeding max width
		const charWidth = context.measureText(char).width;
		if (maxWidth && currentX + charWidth > maxWidth) {
			context.fillText("...", currentX, y);
			return;
		}

		context.fillText(char, currentX, y);
		currentX += charWidth;
	}
};
