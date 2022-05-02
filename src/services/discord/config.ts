// Local Types Imports
import type { PhibiClient } from '../../client';

export interface IAvatarColors extends Record<string, string> {
	cap: string;
	clyde: string;
	froggy: string;
	gusi: string;
	nelly: string;
	phibi: string;
	wumpus: string;
}

export class DiscordClientConfig {
	bot: { readonly token: string; id: string };
	avatarsColors: IAvatarColors;
	slashCommands: { update: boolean; guildTest: any; delay: number };
	settings: { rateLimit: boolean; debug: boolean };
	links: { invite: string };
	levelingConfig: {
		xpCooldown: number;
		xpToAdd: number;
		nextLevelXP: number;
	};
	constructor() {
		const discordBotID = process.env.DISCORD_ID as string;

		this.bot = {
			get token() {
				return process.env.DISCORD_TOKEN as string;
			},
			id: discordBotID,
		};

		this.avatarsColors = {
			cap: '#edb997',
			clyde: '#ffe75c',
			froggy: '#29CC7A',
			gusi: '#ff78b9',
			nelly: '#ffaed7',
			phibi: '#34f4cf',
			wumpus: '#6990ff',
		};

		this.levelingConfig = {
			xpCooldown: 0,
			xpToAdd: 1,
			nextLevelXP: 20,
		};

		this.slashCommands = {
			update: false,
			guildTest: null,
			delay: 5000,
		};

		this.settings = {
			rateLimit: true,
			debug: false,
		};

		this.links = {
			invite: `https://discord.com/oauth2/authorize?client_id=${discordBotID}&permissions=8&scope=bot%20applications.commands`,
		};
	}
}
