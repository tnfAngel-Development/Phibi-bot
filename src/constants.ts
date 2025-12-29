export const avatarsColors: Record<string, string> = {
	cap: '#edb997',
	clyde: '#ffe75c',
	froggy: '#29CC7A',
	gusi: '#ff78b9',
	nelly: '#ffaed7',
	phibi: '#34f4cf',
	wumpus: '#6990ff'
};

export const levelingConfig = {
	xpCooldown: process.env['XP_COOLDOWN'] ? parseInt(process.env['XP_COOLDOWN']) : 60,
	xpToAdd: process.env['XP_TO_ADD'] ? parseInt(process.env['XP_TO_ADD']) : 2,
	nextLevelXP: process.env['NEXT_LEVEL_XP'] ? parseInt(process.env['NEXT_LEVEL_XP']) : 30
};

export const settings = {
	rateLimit: true,
	debug: false
};

export const discordBotID = process.env.DISCORD_ID as string;

export const links = {
	invite: `https://discord.com/oauth2/authorize?client_id=${discordBotID}&permissions=8&scope=bot%20applications.commands`
};
