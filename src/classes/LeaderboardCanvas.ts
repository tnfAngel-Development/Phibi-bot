import { readdirSync } from 'fs';
import { join as joinPaths } from 'path';
import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas';
import type { GuildMember } from 'discord.js';
import { avatarsColors } from '../constants';
import { setFont } from '../functions/setFont';
import { userModel } from '../schemas/UserModel';
import type { IUserModel } from '../schemas/UserModel';
import { Util } from './Util';

GlobalFonts.registerFromPath(joinPaths(__dirname, '../assets/fonts/Asap.ttf'), 'Asap');

export class LeaderboardCanvas {
	member: GuildMember;
	type: string;
	constructor(member: GuildMember, type: string) {
		this.member = member;
		this.type = type;
	}
	async generate() {
		const canvas = createCanvas(800, 1000);
		const context = canvas.getContext('2d');

		context.save();

		const backgroundImage = await loadImage(joinPaths(__dirname, '../assets/images/leaderboardBackground.png'));

		context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

		const characters = readdirSync(joinPaths(__dirname, '../assets/characters/'));

		const addUser = async (userData: IUserModel, index: number) => {
			const offset = 160 * index;

			const discordUser =
				(await this.member.client.users.fetch(userData.userID.toString()).catch(() => null)) ||
				this.member.client.user;

			let userCharacter = '';

			if (characters.includes(`${discordUser.username}.png`)) {
				userCharacter = `${discordUser.username}.png`;
			} else if (discordUser.bot) {
				userCharacter = 'Clyde.png';
			} else {
				userCharacter = userData.character
					? `${userData.character}.png`
					: Util.seedShuffle(
							characters.filter(
								(findAvatar: string): boolean =>
									findAvatar !== 'Clyde.png' && findAvatar !== 'Phibi.png'
							),
							parseInt(discordUser.discriminator)
						)[0];
			}

			const level = userData ? userData.level : 0;

			const username = discordUser.username;
			const discriminator = discordUser.discriminator;
			const fullUsername = `${username}#${discriminator}`;

			const mainFont = 'asap';
			const backgroundColor = '#3a3c41';
			const mainColor = avatarsColors[userCharacter.toLowerCase().split('.')[0]!];
			const secondaryColor = `${mainColor}90`;
			const tertiaryColor = '#8F9396';

			context.save();

			context.beginPath();
			context.arc(160, 170 + offset, 70, 0, Math.PI * 2, true);
			context.closePath();
			context.clip();

			context.fillStyle = backgroundColor;
			context.fillRect(0, 0, canvas.width, canvas.height);

			const avatar = await loadImage(joinPaths(__dirname, '../assets/characters/', userCharacter));

			context.drawImage(avatar, 100, 110 + offset, 120, 120);

			context.restore();

			context.font = setFont(canvas, fullUsername, 300, mainFont, 50, 10, 'bold');
			context.fillStyle = mainColor;
			context.fillText(username, canvas.width / 2.8, 150 + offset);
			context.fillStyle = secondaryColor;
			context.fillText(
				`#${discriminator}`,
				canvas.width / 2.8 + context.measureText(username).width,
				150 + offset
			);
			context.fillStyle = tertiaryColor;
			context.fillText(`Level: ${level} XP: ${userData.currentXP}`, canvas.width / 2.8, 200 + offset);
		};

		if (this.type === 'global') {
			const globalUsers: IUserModel[] = await userModel.find({}).exec();

			globalUsers.sort((a, b) => b.totalXP - a.totalXP);

			for (let i = 0; i < 5; i++) {
				const userData = globalUsers[i];
				if (userData) {
					await addUser(userData, i);
				}
			}
		} else if (this.type === 'local') {
			const localUsers: IUserModel[] = await userModel.find({ guildID: this.member.guild.id }).exec();

			localUsers.sort((a, b) => b.totalXP - a.totalXP);
			for (let i = 0; i < 5; i++) {
				const userData = localUsers[i];
				if (userData) {
					await addUser(userData, i);
				}
			}
		}

		return canvas;
	}
}
