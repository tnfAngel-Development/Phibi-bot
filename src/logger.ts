// External Imports
import { addColors, createLogger, transports, format } from 'winston';

// External Types Imports
import type { Logger } from 'winston';

export class PhibiClientLoggerColors {
	red: (text: string) => string;
	green: (text: string) => string;
	yellow: (text: string) => string;
	blue: (text: string) => string;
	magenta: (text: string) => string;
	cyan: (text: string) => string;
	constructor() {
		this.red = (text: string): string => `\x1B[1;31m${text}\x1B[1;0m`;
		this.green = (text: string): string => `\x1B[1;32m${text}\x1B[1;0m`;
		this.yellow = (text: string): string => `\x1B[1;33m${text}\x1B[1;0m`;
		this.blue = (text: string): string => `\x1B[1;34m${text}\x1B[1;0m`;
		this.magenta = (text: string): string => `\x1B[1;35m${text}\x1B[1;0m`;
		this.cyan = (text: string): string => `\x1B[1;36m${text}\x1B[1;0m`;
	}
}

export class PhibiClientLogger {
	logColors: PhibiClientLoggerColors;
	loggerConfig: {
		levels: { error: number; warn: number; info: number; debug: number };
		colors: { error: string; warn: string; info: string; debug: string };
	};
	logger: Logger;
	constructor() {
		this.logColors = new PhibiClientLoggerColors();

		this.loggerConfig = {
			levels: {
				error: 0,
				warn: 1,
				info: 2,
				debug: 3,
			},
			colors: {
				error: 'red',
				warn: 'yellow',
				info: 'blue',
				debug: 'cyan',
			},
		};

		const zeroFormat = (digits: number | string): string => {
			const stringDigits = digits.toString();

			return stringDigits.length === 1
				? `0${stringDigits}`
				: stringDigits;
		};

		const getDate = (): string => {
			const date = new Date();

			const dateStr = `${[
				zeroFormat(date.getDate()),
				zeroFormat(date.getMonth() + 1),
				zeroFormat(date.getFullYear()),
			].join('/')} ${zeroFormat(date.getHours())}:${zeroFormat(
				date.getMinutes()
			)}:${zeroFormat(date.getSeconds())}`;

			return `[ ${this.logColors.yellow(dateStr)} ]`;
		};

		addColors(this.loggerConfig.colors);

		this.logger = createLogger({
			exitOnError: false,
			levels: this.loggerConfig.levels,
			transports: [
				new transports.Console({
					handleExceptions: true,
					handleRejections: true,
					format: format.combine(
						format.colorize({
							all: false,
						}),
						format.printf(
							(logData): string =>
								`${getDate()} [ ${logData.level} ] ${
									logData.message
								}`
						)
					),
				}),
				new transports.File({
					filename: './debug/debug.log',
				}),
			],
		});
	}
}
