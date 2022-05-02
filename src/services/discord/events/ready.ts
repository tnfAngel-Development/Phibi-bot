// Local Types Imports
import type { PhibiClient } from '../../../client';

// External Types Imports
import type { ClientUser } from 'discord.js';

module.exports = async (client: PhibiClient): Promise<void> => {
	const clientUser = client.discord.user as ClientUser;

	clientUser.setActivity({
		name: 'tnfAngel Dev',
		type: 'WATCHING',
	});

	client.discord.log.info(
		`Discord Client ready as ${client.logColors.cyan(
			clientUser.username
		)}${client.logColors.magenta(`#${clientUser.discriminator}`)}`
	);
};
