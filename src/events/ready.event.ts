import { ActivityType, Events, PresenceUpdateStatus } from 'discord.js';
import { ClientEvent } from '../classes/ClientEvent';

export default new ClientEvent({
	name: Events.ClientReady,
	once: false,
	run: async ({ client }) => {
		client.user?.setPresence({
			status: PresenceUpdateStatus.Online,
			activities: [
				{
					name: 'tnfAngel.com',
					type: ActivityType.Watching
				}
			]
		});

		console.log(`Logged in as ${client.user?.displayName}!`);
	}
});
