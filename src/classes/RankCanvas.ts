import { readdirSync } from "fs";
import { join as joinPaths } from "path";
import { GlobalFonts, createCanvas, loadImage } from "@napi-rs/canvas";
import type { GuildMember } from "discord.js";
import { avatarsColors, levelingConfig } from "../constants";
import { roundRect } from "../functions/roundRect";
import { setFont } from "../functions/setFont";
import { renderMultiFontText } from "../functions/renderMultiFontText";
import { userModel } from "../schemas/UserModel";
import { Util } from "./Util";

// Register emoji font
GlobalFonts.registerFromPath(
	joinPaths(__dirname, "../assets/fonts/NotoColorEmoji.ttf"),
	"Noto Color Emoji"
);
GlobalFonts.registerFromPath(
	joinPaths(__dirname, "../assets/fonts/segoe-ui-symbol.ttf"),
	"Segoe UI Symbol"
);
GlobalFonts.registerFromPath(
	joinPaths(__dirname, "../assets/fonts/gg sans Bold.ttf"),
	"Asap"
);
GlobalFonts.registerFromPath(
	joinPaths(__dirname, "../assets/fonts/gg sans Medium.ttf"),
	"gg sans"
);
// Register new Asian language fonts
GlobalFonts.registerFromPath(
	joinPaths(__dirname, "../assets/fonts/NotoSansArabic-Bold.ttf"),
	"Noto Sans Arabic"
);
GlobalFonts.registerFromPath(
	joinPaths(__dirname, "../assets/fonts/NotoSansJP-Bold.ttf"),
	"Noto Sans JP"
);
GlobalFonts.registerFromPath(
	joinPaths(__dirname, "../assets/fonts/NotoSansKR-Bold.ttf"),
	"Noto Sans KR"
);
GlobalFonts.registerFromPath(
	joinPaths(__dirname, "../assets/fonts/NotoSansSC-Bold.ttf"),
	"Noto Sans SC"
);
GlobalFonts.registerFromPath(
	joinPaths(__dirname, "../assets/fonts/NotoSansTC-Bold.ttf"),
	"Noto Sans TC"
);
GlobalFonts.registerFromPath(
	joinPaths(__dirname, "../assets/fonts/NotoSansThai-Bold.ttf"),
	"Noto Sans Thai"
);

export class LevelCanvas {
	private readonly member: GuildMember;

	constructor(member: GuildMember) {
		this.member = member;
	}

	async generate() {
		const canvas = createCanvas(700, 250);
		const context = canvas.getContext("2d");

		context.save();

		const backgroundImage = await loadImage(
			joinPaths(__dirname, "../assets/images/levelBackground.png")
		);
		context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

		const globalData = await userModel.find({}).exec();
		globalData.sort((a, b): number => b.totalXP - a.totalXP);
		const localData = globalData.filter(
			(data): boolean => data.guildID === this.member.guild.id
		);
		const userData = localData.find(
			(data) => data.userID === this.member.user.id
		);

		const characters = readdirSync(
			joinPaths(__dirname, "../assets/characters/")
		);
		let userCharacter = "";

		if (characters.includes(`${this.member.user.username}.png`)) {
			userCharacter = `${this.member.user.username}.png`;
		} else if (this.member.user.bot) {
			userCharacter = "Clyde.png";
		} else {
			userCharacter = userData?.character
				? `${userData.character}.png`
				: Util.seedShuffle(
						characters.filter(
							(findAvatar: string): boolean =>
								findAvatar !== "Clyde.png" &&
								findAvatar !== "Phibi.png"
						),
						parseInt(this.member.user.discriminator)
				  )[0];
		}

		const level = userData ? userData.level : 0;
		const currentXP = userData ? userData.currentXP : 0;
		const nextLevelXP =
			(!level ? 1 : level + 1) * levelingConfig.nextLevelXP;
		const levelPercentage = Math.floor((currentXP / nextLevelXP) * 100);

		const displayName = this.member.displayName;
		const secondaryFont = "gg sans";
		const mainFont = "Asap";
		const backgroundColor = "#3a3c41";
		const mainColor =
			avatarsColors[userCharacter.toLowerCase().split(".")[0]!];
		const secondaryColor = `${mainColor}90`;
		const tertiaryColor = "#8F9396";

		context.beginPath();
		context.arc(125, 125, 80, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();
		context.fillStyle = backgroundColor;
		context.fillRect(0, 0, canvas.width, canvas.height);

		const avatar = await loadImage(
			joinPaths(__dirname, "../assets/characters/", userCharacter)
		);
		context.drawImage(avatar, 50, 50, 150, 150);
		context.restore();

		// Prepare base font for multi-font rendering
		const baseFont = setFont(canvas, displayName, 300, mainFont, 50, 10);

// Render username with multi-font support
context.fillStyle = mainColor;
renderMultiFontText(
	context,
	displayName,
	canvas.width / 2.8,
	canvas.height / 3.3,
	baseFont,
	canvas.width - 50,
	true  // Enable bold for non-emoji
);

		// Rest of the code remains the same...
		const topWords = ["Level", "Local", "Global"];
		const topText = `${topWords[0]}    ${topWords[1]}    ${topWords[2]}`;

		context.font = setFont(
			canvas,
			topText,
			300,
			secondaryFont,
			38,
			10,
			"medium"
		);
		context.fillStyle = tertiaryColor;
		context.fillText(topWords[0], canvas.width / 2.8, canvas.height / 2.2);
		context.fillText(topWords[1], canvas.width / 2.0, canvas.height / 2.2);
		context.fillText(topWords[2], canvas.width / 1.55, canvas.height / 2.2);

		const localRank =
			localData.findIndex((data) => data.userID === this.member.user.id) +
			1;
		const globalRank =
			globalData.findIndex(
				(data) => data.userID === this.member.user.id
			) + 1;
		const bottomWords = [
			`${level}`,
			localRank ? `#${localRank}` : "n/a",
			globalRank ? `#${globalRank}` : "n/a",
		];

		const bottomText = `${bottomWords[0]}    ${bottomWords[1]}    ${bottomWords[2]}`;
		context.font = setFont(
			canvas,
			bottomText,
			300,
			mainFont,
			38,
			10,
			"bold"
		);
		context.fillStyle = secondaryColor;
		context.fillText(
			bottomWords[0],
			canvas.width / 2.8,
			canvas.height / 1.7
		);
		context.fillText(
			bottomWords[1],
			canvas.width / 2.0,
			canvas.height / 1.7
		);
		context.fillText(
			bottomWords[2],
			canvas.width / 1.55,
			canvas.height / 1.7
		);

		context.beginPath();
		context.fillStyle = backgroundColor;
		roundRect(
			context,
			canvas.width / 2.8,
			canvas.height / 1.4,
			100 * 3,
			15,
			15
		);
		context.fill();

		context.beginPath();
		roundRect(
			context,
			canvas.width / 2.8,
			canvas.height / 1.4,
			100 * 3,
			15,
			15
		);
		context.clip();

		context.beginPath();
		context.fillStyle = mainColor;
		roundRect(
			context,
			canvas.width / 2.8,
			canvas.height / 1.4,
			levelPercentage * 3,
			15,
			15
		);
		context.fill();

		return canvas;
	}
}
