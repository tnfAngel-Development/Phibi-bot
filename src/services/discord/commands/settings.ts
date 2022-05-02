// Local Imports
import { BaseCommand } from '../classes/BaseCommand';
import { userModel } from '../schemas/UserModel';
import { levelRoleModel } from '../schemas/LevelRole';

// Local Types Imports
import type { CommandContext } from '../classes/CommandContext';

// External Imports
import { readdirSync } from 'fs';
import { MessageAttachment } from 'discord.js';
import { join as joinPaths } from 'path';

// External Types Imports
import type { Guild, GuildMember, Role, Snowflake } from 'discord.js';

module.exports = module.exports = new BaseCommand({
	id: '970795789695746058',
	name: 'settings',
	description: 'Bot, guild, leveling & profile settings',
	options: [
		{
			name: 'profile',
			description: 'Profile settings',
			type: 2,
			options: [
				{
					name: 'character',
					description: 'Changes Discord character of your profile',
					type: 1,
					options: [
						{
							name: 'new_character',
							description: 'The new character you will have',
							type: 3,
							required: true,
							choices: readdirSync(
								joinPaths(__dirname, '../characters/')
							).map((char: string) => {
								return {
									name: char.split('.')[0],
									value: char.split('.')[0],
								};
							}),
						},
					],
				},
			],
		},
		{
			name: 'leveling',
			description: 'Leveling settings',
			type: 2,
			options: [
				{
					name: 'add_level_role',
					description: 'Add a new role by level',
					type: 1,
					options: [
						{
							name: 'level',
							description:
								'The level required to obtain the role',
							type: 4,
							required: true,
						},
						{
							name: 'role',
							description:
								'The role to add obtained upon reaching the level',
							type: 8,
							required: true,
						},
					],
				},
				{
					name: 'remove_level_role',
					description: 'Remove a existent role by level',
					type: 1,
					options: [
						{
							name: 'level',
							description:
								'The level at which the role is located',
							type: 4,
							required: true,
						},
						{
							name: 'role',
							description: 'The role to remove in that level',
							type: 8,
							required: true,
						},
					],
				},
				{
					name: 'view_level_roles',
					description: "View the guild's roles by level!",
					type: 1,
				},
			],
		},
		{
			name: 'autorole',
			description: 'Autorole settings',
			type: 2,
			options: [
				{
					name: 'add_level_role',
					description: 'Add a new role by level',
					type: 1,
					options: [
						{
							name: 'level',
							description:
								'The level required to obtain the role',
							type: 4,
							required: true,
						},
						{
							name: 'role',
							description:
								'The role to add obtained upon reaching the level',
							type: 8,
							required: true,
						},
					],
				},
				{
					name: 'remove_level_role',
					description: 'Remove a existent role by level',
					type: 1,
					options: [
						{
							name: 'level',
							description:
								'The level at which the role is located',
							type: 4,
							required: true,
						},
						{
							name: 'role',
							description: 'The role to remove in that level',
							type: 8,
							required: true,
						},
					],
				},
				{
					name: 'view_level_roles',
					description: "View the guild's roles by level!",
					type: 1,
				},
			],
		},
	],
	run: async ({ interaction }: CommandContext): Promise<any> => {
		const group = interaction.options.getSubcommandGroup();

		const subcommand = interaction.options.getSubcommand();

		const member = interaction.member as GuildMember;

		const guild = interaction.guild as Guild;

		const botGuildMember = guild.me as GuildMember;

		await interaction.deferReply({ ephemeral: true });

		if (group === 'profile') {
			if (subcommand === 'character') {
				const character =
					interaction.options.getString('new_character');

				await interaction.editReply({
					content: `Ok! From now on you will be ${character}!`,
				});

				userModel
					.findOneAndUpdate(
						{
							guildID: member.guild.id,
							userID: interaction.user.id,
						},
						{
							$set: {
								character: character,
							},
						},
						{ upsert: true }
					)
					.exec();
			}
		} else if (group === 'leveling') {
			const level = interaction.options.getInteger('level') as number;
			const role = interaction.options.getRole('role') as Role;

			if (subcommand === 'add_level_role') {
				if (level < 1)
					return interaction.editReply({
						content: 'The level provided must be greater than 100.',
					});

				if (level > 1000)
					return interaction.editReply({
						content: 'The level provided is too big.',
					});

				if (member.roles.highest.comparePositionTo(role) < 0)
					return interaction.editReply({
						content:
							"You can't add the role provided because your highest role is not higher than that role.",
					});

				if (botGuildMember.roles.highest.comparePositionTo(role) < 0)
					return interaction.editReply({
						content:
							"I can't add the role provided because my role is not high enougth.",
					});

				if (role.tags && role.tags.botId)
					return interaction.editReply({
						content:
							"I can't add the role provided because that role is only for a bot application.",
					});

				if (role.tags && role.tags.integrationId)
					return interaction.editReply({
						content:
							"I can't add the role provided because that role is for a special integration.",
					});

				if (role.tags && role.tags.premiumSubscriberRole)
					return interaction.editReply({
						content:
							"I can't add the role provided because that role is only for server boosters.",
					});

				const roleData = await levelRoleModel
					.findOne({
						guildID: guild.id,
						level: level,
					})
					.exec();

				const roles = roleData && roleData.roles ? roleData.roles : [];

				if (roles.includes(role.id))
					return interaction.editReply({
						content:
							'Looks like that role was already added! Try another role!',
					});

				if (roles.length >= 10)
					return interaction.editReply({
						content:
							'Hey! There is a limit of 10 roles per level! To add that role you will have to remove one first.',
					});

				roles.push(role.id);

				await interaction.editReply({
					content: `Ok! Now the role <@&${role.id}> will be given on level ${level}.`,
				});

				await levelRoleModel
					.findOneAndUpdate(
						{
							guildID: guild.id,
							level: level,
						},
						{
							$set: {
								roles: roles,
							},
						},
						{ upsert: true }
					)
					.exec();
			} else if (subcommand === 'remove_level_role') {
				if (level < 1)
					return interaction.editReply({
						content: 'The level provided must be greater than 100.',
					});

				if (level > 1000)
					return interaction.editReply({
						content: 'The level provided is too big.',
					});

				if (member.roles.highest.comparePositionTo(role) < 0)
					return interaction.editReply({
						content:
							"You can't remove the role provided because your highest role is not higher than that role.",
					});

				if (botGuildMember.roles.highest.comparePositionTo(role) < 0)
					return interaction.editReply({
						content:
							"I can't remove the role provided because my role is not high enougth.",
					});

				if (role.tags && role.tags.botId)
					return interaction.editReply({
						content:
							"I can't remove the role provided because that role is only for a bot application.",
					});

				if (role.tags && role.tags.integrationId)
					return interaction.editReply({
						content:
							"I can't remove the role provided because that role is for a special integration.",
					});

				if (role.tags && role.tags.premiumSubscriberRole)
					return interaction.editReply({
						content:
							"I can't remove the role provided because that role is only for server boosters.",
					});

				const roleData = await levelRoleModel
					.findOne({
						guildID: guild.id,
						level: level,
					})
					.exec();

				const roles = roleData && roleData.roles ? roleData.roles : [];

				if (!roles.includes(role.id))
					return interaction.editReply({
						content:
							'Looks like that role was not already added! Try another role!',
					});

				await interaction.editReply({
					content: `Perfect! From now on the role <@&${role.id}> will not be given at level ${level}.`,
				});

				const newRoles = roles.filter(
					(filterRole: Snowflake): boolean => filterRole !== role.id
				);

				if (newRoles.length) {
					await levelRoleModel
						.findOneAndUpdate(
							{
								guildID: guild.id,
								level: level,
							},
							{
								$set: {
									roles: newRoles,
								},
							},
							{ upsert: true }
						)
						.exec();
				} else {
					await levelRoleModel
						.findOneAndDelete({
							guildID: guild.id,
							level: level,
						})
						.exec();
				}
			} else if (subcommand === 'view_level_roles') {
				const rolesData = await levelRoleModel
					.find({
						guildID: guild.id,
					})
					.exec();

				if (!rolesData.length)
					return interaction.editReply({
						content:
							"Hmm... Looks like this guild doesn't have roles per level yet :(.",
					});

				rolesData.sort((a, b) => a.level - b.level);

				const content = rolesData
					.map(
						(roleData): string =>
							`Level: ${roleData.level}\nRoles: ${roleData.roles
								.map(
									(mapRole: Snowflake): string =>
										`@${
											guild.roles.resolve(mapRole)
												?.name || 'Unknown role'
										} (${mapRole})`
								)
								.join(', ')}`
					)
					.join('\n\n');

				if (content.length > 1048576)
					return interaction.editReply({
						content:
							"Woops! Looks like the attachment is too large and i can't send it.",
					});

				const buf = Buffer.from(content, 'utf-8');

				const attachment = new MessageAttachment(
					buf,
					'Level-Roles.Phibi.txt'
				);

				await interaction.editReply({
					content: `Of course! These are the levels by role of ${guild.name}.`,

					files: [attachment],
				});
			}
		}
	},
});
