// Local Imports
import { BaseCommand } from '../classes/BaseCommand';
import { LeaderboardCanvas } from '../classes/LeaderboardCanvas';

// Local Types Imports
import type { CommandContext } from '../classes/CommandContext';

// External Imports
import { MessageAttachment } from 'discord.js';

// External Types Imports
import type { GuildMember } from 'discord.js';

module.exports = module.exports = new BaseCommand({
	id: '970795744791519353',
	name: 'leaderboard',
	description: 'Returns the local or global leaderboard',
	options: [
		{
			name: 'global',
			description:
				'Global leaderboard, returns the top 5 users with more level in all guilds',
			type: 1,
		},
		{
			name: 'local',
			description:
				'Local leaderboard, returns the top 5 users with more level in this guild',
			type: 1,
		},
	],
	run: async ({ client, interaction }: CommandContext): Promise<void> => {
		await interaction.deferReply();

		const type = interaction.options.getSubcommand();

		const leaderboardCanvas = new LeaderboardCanvas(
			client,
			interaction.member as GuildMember,
			type
		);

		const canvas = await leaderboardCanvas.generate();

		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			'phibi-leaderboard.png'
		);

		await interaction.editReply({ files: [attachment] });
	},
});
