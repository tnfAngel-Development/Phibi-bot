export class PhibiClientConfig {
	services: string[];
	environment: string;
	colors: {
		main: string;
		error: string;
		success: string;
		mute: string;
		warn: string;
	};
	intColors: {
		main: number;
		error: number;
		success: number;
		mute: number;
		warn: number;
	};
	info: { readonly fullVersion: string; version: string; channel: string };
	constructor() {
		this.services = ['database', 'discord'];

		this.environment = process.env.NODE_ENV || 'development';

		this.colors = {
			main: '#34f4cf',
			error: '#ED4245',
			success: '#57F287',
			mute: '#EB8634',
			warn: '#FEE75C',
		};

		this.intColors = {
			main: 0x48f3cd,
			error: 0xed4245,
			success: 0x57f287,
			mute: 0xeb8634,
			warn: 0xfee75c,
		};

		this.info = {
			get fullVersion() {
				return `${this.version}-${this.channel}`;
			},
			version: 'v1',
			channel: 'canary',
		};
	}
}
