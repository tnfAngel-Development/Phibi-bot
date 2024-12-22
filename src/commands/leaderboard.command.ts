import { AttachmentBuilder, type GuildMember, SlashCommandBuilder } from 'discord.js';
import { Command } from '../classes/Command';
import { LeaderboardCanvas } from '../classes/LeaderboardCanvas';

export default new Command({
	id: 'leaderboard',
	config: () => ({
		slash: new SlashCommandBuilder()
			.setName('leaderboard')
			.setDescription('Returns the local or global leaderboard.')
			.addSubcommand((b) =>
				b
					.setName('global')
					.setDescription('Global leaderboard, returns the top 5 users with more level in all guilds')
			)
			.addSubcommand((b) =>
				b
					.setName('local')
					.setDescription('Local leaderboard, returns the top 5 users with more level in this guild')
			)
	}),
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const type = interaction.options.getSubcommand(true);

		const leaderboardCanvas = new LeaderboardCanvas(interaction.member as GuildMember, type);

		const canvas = await leaderboardCanvas.generate();

		const attachment = new AttachmentBuilder(canvas.toBuffer('image/png')).setName('phibi-leaderboard.png');

		await interaction.editReply({ files: [attachment] });
	}
});
