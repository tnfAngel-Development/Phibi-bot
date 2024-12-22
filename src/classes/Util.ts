export abstract class Util {
	static cutString(text: string, size: number, dots = true): string {
		return text.length > size ? `${text.slice(0, size)}${dots ? '...' : ''}` : text;
	}

	static zeroFormat(digits: number | string): string {
		const stringDigits = digits.toString();
		return stringDigits.length === 1 ? `0${stringDigits}` : stringDigits;
	}

	static localeString(number: number): string {
		return number.toLocaleString('en-US');
	}

	static wait(time: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	static toCodeBlock(code: string, text: string): string {
		return `\u0060\u0060\u0060${code.replace(/```/g, '')}\n${text.replace(/```/g, '')}\n\u0060\u0060\u0060`;
	}

	static toCode(text: string): string {
		return `\u0060${text
			.toString()
			.replace(/`/g, '')
			.replace(/[\n\r]/g, '')}\u0060`;
	}

	static toRelativeTimestamp(timestamp: number): string {
		return `<t:${timestamp.toString().slice(0, -3)}:R>`;
	}

	static clearMentions(text: string): string {
		return text
			.replace(/</g, '')
			.replace(/!/g, '')
			.replace(/@/g, '')
			.replace(/#/g, '')
			.replace(/&/g, '')
			.replace(/>/g, '');
	}

	static seedShuffle(targetArray: any[], seed = 1): any[] {
		let currentIndex = targetArray.length;

		const random = () => {
			seed = seed + 1;
			const x = Math.sin(seed) * 10000;
			return x - Math.floor(x);
		};

		while (0 !== currentIndex) {
			const randomIndex = Math.floor(random() * currentIndex);

			currentIndex -= 1;

			const temporaryValue = targetArray[currentIndex];

			targetArray[currentIndex] = targetArray[randomIndex];
			targetArray[randomIndex] = temporaryValue;
		}

		return targetArray;
	}
}
