import { readdirSync } from "fs";
import { join as joinPaths } from "path";
import { GlobalFonts, createCanvas, loadImage } from "@napi-rs/canvas";
import type { GuildMember } from "discord.js";
import { avatarsColors } from "../constants";
import { setFont } from "../functions/setFont";
import { renderMultiFontText } from "../functions/renderMultiFontText";
import { userModel } from "../schemas/UserModel";
import type { IUserModel } from "../schemas/UserModel";
import { Util } from "./Util";

// Register fonts
GlobalFonts.registerFromPath(joinPaths(__dirname, "../assets/fonts/NotoColorEmoji.ttf"), "Noto Color Emoji");
GlobalFonts.registerFromPath(joinPaths(__dirname, "../assets/fonts/segoe-ui-symbol.ttf"), "Segoe UI Symbol");
GlobalFonts.registerFromPath(joinPaths(__dirname, "../assets/fonts/gg sans Bold.ttf"), "Asap");
GlobalFonts.registerFromPath(joinPaths(__dirname, "../assets/fonts/gg sans Medium.ttf"), "gg sans");
GlobalFonts.registerFromPath(joinPaths(__dirname, "../assets/fonts/NotoSansArabic-Bold.ttf"), "Noto Sans Arabic");
GlobalFonts.registerFromPath(joinPaths(__dirname, "../assets/fonts/NotoSansJP-Bold.ttf"), "Noto Sans JP");
GlobalFonts.registerFromPath(joinPaths(__dirname, "../assets/fonts/NotoSansKR-Bold.ttf"), "Noto Sans KR");
GlobalFonts.registerFromPath(joinPaths(__dirname, "../assets/fonts/NotoSansSC-Bold.ttf"), "Noto Sans SC");
GlobalFonts.registerFromPath(joinPaths(__dirname, "../assets/fonts/NotoSansTC-Bold.ttf"), "Noto Sans TC");
GlobalFonts.registerFromPath(joinPaths(__dirname, "../assets/fonts/NotoSansThai-Bold.ttf"), "Noto Sans Thai");

export class LeaderboardCanvas {
	member: GuildMember;
	type: string;

	constructor(member: GuildMember, type: string) {
		this.member = member;
		this.type = type;
	}

	async generate() {
		const canvas = createCanvas(800, 1000);
		const context = canvas.getContext("2d");
		context.save();

		const backgroundImage = await loadImage(
			joinPaths(__dirname, "../assets/images/leaderboardBackground.png")
		);
		context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

		const characters = readdirSync(
			joinPaths(__dirname, "../assets/characters/")
		);

		// Pre-load rank icons including developer icon
		const rankIcons = {
			top1: await loadImage(joinPaths(__dirname, "../assets/images/top1.png")),
			top2: await loadImage(joinPaths(__dirname, "../assets/images/top2.png")),
			top3: await loadImage(joinPaths(__dirname, "../assets/images/top3.png")),
			default: await loadImage(joinPaths(__dirname, "../assets/images/default.png")),
			developer: await loadImage(joinPaths(__dirname, "../assets/images/developer.png"))
		};

		// Define special developer user IDs
		const developerIds = [
			'456361646273593345',
			'633600812970541056'
		];

		const addUser = async (userData: IUserModel, index: number) => {
			const offset = 160 * index;
			const discordUser =
				(await this.member.client.users
					.fetch(userData.userID.toString())
					.catch(() => null)) || this.member.client.user;

			let userCharacter = "";
			if (characters.includes(`${discordUser.username}.png`)) {
				userCharacter = `${discordUser.username}.png`;
			} else if (discordUser.bot) {
				userCharacter = "Clyde.png";
			} else {
				userCharacter = userData.character
					? `${userData.character}.png`
					: Util.seedShuffle(
							characters.filter(
								(findAvatar) =>
									findAvatar !== "Clyde.png" &&
									findAvatar !== "Phibi.png"
							),
							parseInt(discordUser.id)
					  )[0];
			}

			const level = userData ? userData.level : 0;
			let displayName: string;
			if (this.type === "local") {
				try {
					const guildMember = await this.member.guild.members.fetch(
						userData.userID.toString()
					);
					displayName = guildMember.displayName;
				} catch {
					displayName = discordUser.globalName || discordUser.username;
				}
			} else {
				displayName = discordUser.globalName || discordUser.username;
			}

			const secondaryFont = "gg sans";
			const mainFont = "Asap";
			const backgroundColor = "#3a3c41";
			const mainColor =
				avatarsColors[userCharacter.toLowerCase().split(".")[0]!];
			const tertiaryColor = "#8F9396";

			context.save();
			context.beginPath();
			context.arc(160, 170 + offset, 70, 0, Math.PI * 2, true);
			context.closePath();
			context.clip();
			context.fillStyle = backgroundColor;
			context.fillRect(0, 0, canvas.width, canvas.height);

			const avatar = await loadImage(
				joinPaths(__dirname, "../assets/characters/", userCharacter)
			);
			context.drawImage(avatar, 100, 110 + offset, 120, 120);
			context.restore();

			// Prepare base font for multi-font rendering (increased size)
			const baseFont = setFont(
				canvas,
				displayName,
				300,
				mainFont,
				70, // Increased name font size
				20,
			);

			context.fillStyle = mainColor;
			renderMultiFontText(
				context,
				displayName,
				canvas.width / 3.0,
				150 + offset,
				baseFont,
				canvas.width - 250,
				true  // Enable bold for non-emoji
			);

			context.fillStyle = tertiaryColor;
			context.font = `${40}px '${mainFont}'`;
			const baseX = canvas.width / 3.0;
			const baseY = 220 + offset;

			const levelLabel = "Level: ";
			context.fillText(levelLabel, baseX, baseY);
			const levelLabelWidth = context.measureText(levelLabel).width;

			context.font = `bold ${40}px '${mainFont}'`;
			context.fillStyle = mainColor;
			const levelValue = level.toString();
			const levelValueWidth = context.measureText(levelValue).width;
			context.fillText(levelValue, baseX + levelLabelWidth, baseY);

			const spacingAfterLevel = 30;
			const spacingReductionXPValue = -10;

			context.font = `${40}px '${secondaryFont}'`;
			context.fillStyle = tertiaryColor;
			const xpLabel = "・XP:";
			const xpLabelWidth = context.measureText(xpLabel).width;
			const xpLabelX = baseX + levelLabelWidth + levelValueWidth + spacingAfterLevel;
			context.fillText(xpLabel, xpLabelX, baseY);

			context.font = `bold ${40}px '${mainFont}'`;
			context.fillStyle = mainColor;
			const xpValue = userData.currentXP.toString();
			const xpValueX = xpLabelX + xpLabelWidth - spacingReductionXPValue;
			context.fillText(xpValue, xpValueX, baseY);

			// Add ranking icon
			const rank = index + 1;
			const userId = userData.userID.toString();
			
			let rankIcon;
			// Check for developer status first
			if (developerIds.includes(userId)) {
				rankIcon = rankIcons.developer;
			} else {
				// Regular ranking logic
				switch (rank) {
					case 1:
						rankIcon = rankIcons.top1;
						break;
					case 2:
						rankIcon = rankIcons.top2;
						break;
					case 3:
						rankIcon = rankIcons.top3;
						break;
					default:
						rankIcon = rankIcons.default;
				}
			}

			// Draw rank icon (resized to 80x80)
			const iconSize = 80;
			const iconX = canvas.width - 145;
			const iconY = 130 + offset;
			context.drawImage(rankIcon, iconX, iconY, iconSize, iconSize);
		};

		if (this.type === "global") {
			const globalUsers: IUserModel[] = await userModel.find({}).exec();
			globalUsers.sort((a, b) => b.totalXP - a.totalXP);

			for (let i = 0; i < 5; i++) {
				if (globalUsers[i]) await addUser(globalUsers[i], i);
			}
		} else if (this.type === "local") {
			const localUsers: IUserModel[] = await userModel
				.find({ guildID: this.member.guild.id })
				.exec();
			localUsers.sort((a, b) => b.totalXP - a.totalXP);

			for (let i = 0; i < 5; i++) {
				if (localUsers[i]) await addUser(localUsers[i], i);
			}
		}

		return canvas;
	}
}
