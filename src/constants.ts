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
	xpCooldown: 0,
	xpToAdd: 1,
	nextLevelXP: 20
};

export const settings = {
	rateLimit: true,
	debug: false
};

export const discordBotID = process.env.DISCORD_ID as string;

export const links = {
	invite: `https://discord.com/oauth2/authorize?client_id=${discordBotID}&permissions=8&scope=bot%20applications.commands`
};
