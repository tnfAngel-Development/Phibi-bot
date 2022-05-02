export class DiscordClientUtil {
	toCodeBlock: (code: string, text: string) => string;
	toCode: (text: string) => string;
	clearMentions: (text: string) => string;
	constructor() {
		this.toCodeBlock = (code: string, text: string): string => {
			return `\`\`\`${code}\n${text}\n\`\`\``;
		};
		this.toCode = (text: string): string => {
			return `\`${text
				.toString()
				.replace(/`/g, '')
				.replace(/[\n\r]/g, '')}\``;
		};
		this.clearMentions = (text: string): string => {
			return text
				.replace(/</g, '')
				.replace(/!/g, '')
				.replace(/@/g, '')
				.replace(/#/g, '')
				.replace(/&/g, '')
				.replace(/>/g, '');
		};
	}
}
