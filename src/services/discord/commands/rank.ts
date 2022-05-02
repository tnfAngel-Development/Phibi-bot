// Local Imports
import { BaseCommand } from '../classes/BaseCommand';
import { LevelCanvas } from '../classes/RankCanvas';

// Local Types Imports
import type { CommandContext } from '../classes/CommandContext';

// External Imports
import { MessageAttachment } from 'discord.js';

// External Types Imports
import type { GuildMember } from 'discord.js';

module.exports = module.exports = new BaseCommand({
	id: '970795767121985567',
	name: 'rank',
	description: "Get your rank card or another member's rank card",
	options: [
		{
			name: 'member',
			description: 'The member for get the rank card',
			type: 6,
			required: false,
		},
	],
	run: async ({
		client,
		interaction,
		args,
	}: CommandContext): Promise<void> => {
		await interaction.deferReply();

		const levelCanvas = new LevelCanvas(
			client,
			interaction.guild?.members.resolve(args[0] as string) ||
				(interaction.member as GuildMember)
		);

		const canvas = await levelCanvas.generate();

		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			'phibi-rank.png'
		);

		await interaction.editReply({ files: [attachment] });
	},
});
