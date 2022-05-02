// Local Imports
import { userModel } from '../schemas/UserModel';
import { levelRoleModel } from '../schemas/LevelRole';

// Local Types Imports
import type { PhibiClient } from '../../../client';

// External Types Imports
import type {
	DiscordAPIError,
	Guild,
	GuildMember,
	Message,
	Snowflake,
	TextChannel,
} from 'discord.js';

const cooldown = new Map();

module.exports = async (
	client: PhibiClient,
	message: Message<boolean>
): Promise<any> => {
	if (message.channel.type !== 'GUILD_TEXT' || message.author.bot) return;

	const guild = message.guild as Guild;

	const member = message.member as GuildMember;

	if (!cooldown.has(message.author.id))
		cooldown.set(message.author.id, Date.now());

	const userCooldown = cooldown.get(message.author.id);

	const { levelingConfig } = client.discord.config;

	if (userCooldown && Date.now() - userCooldown > levelingConfig.xpCooldown) {
		cooldown.set(message.author.id, Date.now());

		const data = await userModel
			.findOne({
				guildID: guild.id,
				userID: message.author.id,
			})
			.exec();

		const level = data ? data.level : 1;

		const nextLevelXP =
			(!level ? 1 : level + 1) * levelingConfig.nextLevelXP;

		const xpToAdd = levelingConfig.xpToAdd;

		if (!data || (data && data.currentXP < nextLevelXP))
			return userModel
				.findOneAndUpdate(
					{ guildID: guild.id, userID: message.author.id },
					{ $inc: { totalXP: xpToAdd, currentXP: xpToAdd } },
					{ upsert: true }
				)
				.exec();

		const newData = await userModel
			.findOneAndUpdate(
				{ guildID: guild.id, userID: message.author.id },
				{ $inc: { level: 1 }, $set: { currentXP: 0 } },
				{ upsert: true, new: true }
			)
			.exec();

		const levelRank = await levelRoleModel
			.findOne({
				guildID: guild.id,
				level: newData.level,
			})
			.exec();

		const channel = guild.channels.cache.get('') as TextChannel | undefined; // TODO: Get channel

		const levelUpMessage = `${member.toString()} Level up! ${client.discord.util.toCode(
			`${newData.level - 1}`
		)} => ${client.discord.util.toCode(`${newData.level}`)}`;

		if (levelRank) {
			for (const roleId of levelRank.roles) {
				const apiError = await member.roles
					.add(roleId)
					.then((): false => false)
					.catch((error: DiscordAPIError): DiscordAPIError => error);

				if (apiError) {
					if (apiError.httpStatus === 404) {
						const roleData = await levelRoleModel
							.findOne({
								guildID: guild.id,
								level: newData.level,
							})
							.exec();

						const roles =
							roleData && roleData.roles ? roleData.roles : [];

						if (!roles.includes(roleId)) return;

						const newRoles = roles.filter(
							(filterRole: Snowflake): boolean =>
								filterRole !== roleId
						);

						if (newRoles.length) {
							await levelRoleModel
								.findOneAndUpdate(
									{
										guildID: guild.id,
										level: newData.level,
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
									level: newData.level,
								})
								.exec();
						}
					}
				}
			}

			if (levelingConfig) {
				// TODO: Remove Old Roles
				const oldRanks = await levelRoleModel
					.find({
						guildID: guild.id,
						level: { $lt: newData.level },
					})
					.exec();

				oldRanks
					.filter((rank): boolean =>
						rank.roles.some((roleID: Snowflake): boolean =>
							member.roles.cache.has(roleID)
						)
					)
					.forEach((ranksModel) =>
						member.roles
							.remove(ranksModel.roles)
							.catch((): false => false)
					);
			}

			if (channel)
				return channel.send({
					content: levelUpMessage,
				});
		}

		if (channel)
			return channel.send({
				content: levelUpMessage,
			});

		return message.channel
			.send({
				content: levelUpMessage,
			})
			.then(async (levelMessage: Message): Promise<void> => {
				await client.util.wait(5000);
				await levelMessage.delete();
			});
	}
};
