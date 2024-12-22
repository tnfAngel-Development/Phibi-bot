import { readdirSync } from 'fs';
import { join as joinPaths } from 'path';
import { AttachmentBuilder, GuildMember, Role, SlashCommandBuilder } from 'discord.js';
import { Command } from '../classes/Command';
import { levelRoleModel } from '../schemas/LevelRole';
import { userModel } from '../schemas/UserModel';

export default new Command({
	id: 'settings',
	config: () => ({
		slash: new SlashCommandBuilder()
			.setName('settings')
			.setDescription('Bot, guild, leveling & profile settings')
			.addSubcommandGroup((group) =>
				group
					.setName('profile')
					.setDescription('Profile settings')
					.addSubcommand((sub) =>
						sub
							.setName('character')
							.setDescription('Changes Discord character of your profile')
							.addStringOption((option) =>
								option
									.setName('new_character')
									.setDescription('The new character you will have')
									.setRequired(true)
									.addChoices(
										...readdirSync(joinPaths(__dirname, '../assets/characters/')).map((char) => ({
											name: char.split('.')[0]!,
											value: char.split('.')[0]!
										}))
									)
							)
					)
			)
			.addSubcommandGroup((group) =>
				group
					.setName('leveling')
					.setDescription('Leveling settings')
					.addSubcommand((sub) =>
						sub
							.setName('add_level_role')
							.setDescription('Add a new role by level')
							.addIntegerOption((option) =>
								option
									.setName('level')
									.setDescription('The level required to obtain the role')
									.setRequired(true)
							)
							.addRoleOption((option) =>
								option
									.setName('role')
									.setDescription('The role to add obtained upon reaching the level')
									.setRequired(true)
							)
					)
					.addSubcommand((sub) =>
						sub
							.setName('remove_level_role')
							.setDescription('Remove an existent role by level')
							.addIntegerOption((option) =>
								option
									.setName('level')
									.setDescription('The level at which the role is located')
									.setRequired(true)
							)
							.addRoleOption((option) =>
								option
									.setName('role')
									.setDescription('The role to remove in that level')
									.setRequired(true)
							)
					)
					.addSubcommand((sub) =>
						sub.setName('view_level_roles').setDescription("View the guild's roles by level!")
					)
			)
	}),
	run: async ({ interaction }) => {
		const group = interaction.options.getSubcommandGroup();

		const subcommand = interaction.options.getSubcommand();

		const member = interaction.member;

		const guild = interaction.guild;

		const botGuildMember = guild?.members.me;

		if (!member || !guild || !botGuildMember)
			return interaction.reply({
				content: `Sorry, something went wrong.`
			});

		await interaction.deferReply({ ephemeral: true });

		if (group === 'profile') {
			if (subcommand === 'character') {
				const character = interaction.options.getString('new_character');

				const res = await userModel
					.findOneAndUpdate(
						{
							guildID: guild.id,
							userID: interaction.user.id
						},
						{
							$set: {
								character: character
							}
						},
						{ upsert: true }
					)
					.exec()
					.catch(() => null);

				if (!res)
					return interaction.editReply({
						content: `Sorry, something went wrong. Please try again.`
					});

				await interaction.editReply({
					content: `Ok! From now on you will be ${character}!`
				});
			}
		} else if (group === 'leveling') {
			if (!(member instanceof GuildMember))
				return interaction.editReply({
					content: 'Invalid member.'
				});

			if (subcommand === 'add_level_role') {
				const level = interaction.options.getInteger('level', true);
				const role = interaction.options.getRole('role', true);

				if (!(role instanceof Role))
					return interaction.editReply({
						content: 'Invalid role.'
					});

				if (level < 1)
					return interaction.editReply({
						content: 'The level provided must be greater than 100.'
					});

				if (level > 1000)
					return interaction.editReply({
						content: 'The level provided is too big.'
					});

				if (member.roles.highest.comparePositionTo(role) < 0)
					return interaction.editReply({
						content:
							"You can't add the role provided because your highest role is not higher than that role."
					});

				if (botGuildMember.roles.highest.comparePositionTo(role) < 0)
					return interaction.editReply({
						content: "I can't add the role provided because my role is not high enough."
					});

				if (role.tags?.botId)
					return interaction.editReply({
						content: "I can't add the role provided because that role is only for a bot application."
					});

				if (role.tags?.integrationId)
					return interaction.editReply({
						content: "I can't add the role provided because that role is for a special integration."
					});

				if (role.tags?.premiumSubscriberRole)
					return interaction.editReply({
						content: "I can't add the role provided because that role is only for server boosters."
					});

				if (role.tags?.guildConnections)
					return interaction.editReply({
						content: "I can't add the role provided because that role is only for connections."
					});

				if (role.managed)
					return interaction.editReply({
						content: "I can't add the role provided because that role managed by an application."
					});

				const roleData = await levelRoleModel
					.findOne({
						guildID: guild.id,
						level: level
					})
					.exec();

				const roles = roleData && roleData.roles ? roleData.roles : [];

				if (roles.includes(role.id))
					return interaction.editReply({
						content: 'Looks like that role was already added! Try another role!'
					});

				if (roles.length >= 10)
					return interaction.editReply({
						content:
							'Hey! There is a limit of 10 roles per level! To add that role you will have to remove one first.'
					});

				roles.push(role.id);

				const res = await levelRoleModel
					.findOneAndUpdate(
						{
							guildID: guild.id,
							level: level
						},
						{
							$set: {
								roles: roles
							}
						},
						{ upsert: true }
					)
					.exec()
					.catch(() => null);

				if (!res)
					return interaction.editReply({
						content: `Sorry, something went wrong saving your data. Please try again.`
					});

				await interaction.editReply({
					content: `Ok! Now the role <@&${role.id}> will be given on level ${level}.`
				});
			} else if (subcommand === 'remove_level_role') {
				const level = interaction.options.getInteger('level', true);
				const role = interaction.options.getRole('role', true);

				if (!(role instanceof Role))
					return interaction.editReply({
						content: 'Invalid role.'
					});

				if (level < 1)
					return interaction.editReply({
						content: 'The level provided must be greater than 100.'
					});

				if (level > 1000)
					return interaction.editReply({
						content: 'The level provided is too big.'
					});

				if (member.roles.highest.comparePositionTo(role) < 0)
					return interaction.editReply({
						content:
							"You can't remove the role provided because your highest role is not higher than that role."
					});

				if (botGuildMember.roles.highest.comparePositionTo(role) < 0)
					return interaction.editReply({
						content: "I can't remove the role provided because my role is not high enough."
					});

				if (role.tags?.botId)
					return interaction.editReply({
						content: "I can't remove the role provided because that role is only for a bot application."
					});

				if (role.tags?.integrationId)
					return interaction.editReply({
						content: "I can't remove the role provided because that role is for a special integration."
					});

				if (role.tags?.premiumSubscriberRole)
					return interaction.editReply({
						content: "I can't remove the role provided because that role is only for server boosters."
					});

				if (role.tags?.guildConnections)
					return interaction.editReply({
						content: "I can't remove the role provided because that role is only for connections."
					});

				if (role.managed)
					return interaction.editReply({
						content: "I can't remove the role provided because that role managed by an application."
					});

				const roleData = await levelRoleModel
					.findOne({
						guildID: guild.id,
						level: level
					})
					.exec()
					.catch(() => null);

				const roles = roleData && roleData.roles ? roleData.roles : [];

				if (!roles.includes(role.id))
					return interaction.editReply({
						content: 'Looks like that role is not added! Try another role!'
					});

				const newRoles = roles.filter((filterRole): boolean => filterRole !== role.id);

				if (newRoles.length) {
					const res = await levelRoleModel
						.findOneAndUpdate(
							{
								guildID: guild.id,
								level: level
							},
							{
								$set: {
									roles: newRoles
								}
							},
							{ upsert: true }
						)
						.exec()
						.catch(() => null);

					if (!res)
						return interaction.editReply({
							content: `Sorry, something went wrong saving your data. Please try again.`
						});
				} else {
					const res = await levelRoleModel
						.findOneAndDelete({
							guildID: guild.id,
							level: level
						})
						.exec()
						.catch(() => null);

					if (!res)
						return interaction.editReply({
							content: `Sorry, something went wrong saving your data. Please try again.`
						});
				}

				await interaction.editReply({
					content: `Perfect! From now on the role <@&${role.id}> will not be given at level ${level}.`
				});
			} else if (subcommand === 'view_level_roles') {
				const rolesData = await levelRoleModel
					.find({
						guildID: guild.id
					})
					.exec();

				if (!rolesData.length)
					return interaction.editReply({
						content: "Hmm... Looks like this server doesn't have roles per level yet. :("
					});

				rolesData.sort((a, b) => a.level - b.level);

				const content = rolesData
					.map(
						(roleData): string =>
							`Level: ${roleData.level}\nRoles: ${roleData.roles
								.map(
									(mapRole): string =>
										`@${guild.roles.resolve(mapRole)?.name || 'Unknown role'} (${mapRole})`
								)
								.join(', ')}`
					)
					.join('\n\n');

				if (content.length > 1048576)
					return interaction.editReply({
						content: "Woops! Looks like the attachment is too large and I can't send it."
					});

				const buf = Buffer.from(content, 'utf-8');

				const attachment = new AttachmentBuilder(buf).setName('Level-Roles.Phibi.txt');

				await interaction.editReply({
					content: `Of course! These are the levels by role of ${guild.name}.`,
					files: [attachment]
				});
			}
		}
	}
});
