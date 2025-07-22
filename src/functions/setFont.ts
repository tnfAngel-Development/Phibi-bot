import type { Canvas } from "@napi-rs/canvas";

export const setFont = (
	canvasArg: Canvas,
	text: string,
	limit = 300,
	font = "gg sans",
	fontSize = 70,
	fontDecrement = 10
): string => {
	const canvasContext = canvasArg.getContext("2d");

	do {
		fontSize -= fontDecrement;
		canvasContext.font = `${fontSize}px ${font}`;
	} while (canvasContext.measureText(text).width > canvasArg.width - limit);

	return canvasContext.font;
};
