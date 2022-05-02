// External Types Imports
import type { CanvasRenderingContext2D } from 'canvas';

export const roundRect = (
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number
): CanvasRenderingContext2D => {
	if (w < 2 * r) r = w / 2;

	if (h < 2 * r) r = h / 2;
	context.beginPath();
	context.moveTo(x + r, y);
	context.arcTo(x + w, y, x + w, y + h, r);
	context.arcTo(x + w, y + h, x, y + h, r);
	context.arcTo(x, y + h, x, y, r);
	context.arcTo(x, y, x + w, y, r);
	context.closePath();

	return context;
};
