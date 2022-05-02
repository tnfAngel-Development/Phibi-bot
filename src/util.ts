export class PhibiClientUtil {
	cutString: (text: string, size: number, dots?: boolean) => string;
	zeroFormat: (digits: number | string) => string;
	localeString: (number: number) => string;
	wait: (time: number) => any;
	constructor() {
		this.cutString = (text: string, size: number, dots = true): string => {
			return text.length > size
				? `${text.slice(0, size)}${dots ? '...' : ''}`
				: text;
		};
		this.zeroFormat = (digits: number | string): string => {
			const stringDigits = digits.toString();

			return stringDigits.length === 1
				? `0${stringDigits}`
				: stringDigits;
		};
		this.localeString = (number: number): string => {
			return number.toLocaleString('en-US');
		};
		this.wait = (time: number): Promise<void> => {
			return new Promise((resolve) => setTimeout(resolve, time));
		};
	}
}
