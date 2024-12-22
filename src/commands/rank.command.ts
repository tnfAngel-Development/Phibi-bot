import { AttachmentBuilder, type GuildMember, SlashCommandBuilder } from 'discord.js';
import { Command } from '../classes/Command';
import { LevelCanvas } from '../classes/RankCanvas';

export default new Command({
	id: 'rank',
	config: () => ({
		slash: new SlashCommandBuilder()
			.setName('rank')
			.setDescription("Get your rank card or another member's rank card")
			.addUserOption((b) =>
				b.setName('member').setDescription('The member for get the rank card').setRequired(false)
			)
	}),
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const levelCanvas = new LevelCanvas(
			(interaction.options.getMember('member') || interaction.member) as GuildMember
		);

		const canvas = await levelCanvas.generate();

		const attachment = new AttachmentBuilder(canvas.toBuffer('image/png')).setName('phibi-rank.png');

		await interaction.editReply({ files: [attachment] });
	}
});
