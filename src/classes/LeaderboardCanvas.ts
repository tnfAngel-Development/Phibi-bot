import { readdirSync } from 'fs';
import { join as joinPaths } from 'path';
import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas';
import type { GuildMember } from 'discord.js';
import { avatarsColors } from '../constants';
import { setFont } from '../functions/setFont';
import { userModel } from '../schemas/UserModel';
import type { IUserModel } from '../schemas/UserModel';
import { Util } from './Util';

// Register emoji font
GlobalFonts.registerFromPath(
  joinPaths(__dirname, '../assets/fonts/NotoColorEmoji.ttf'),
  'Noto Color Emoji'
);

GlobalFonts.registerFromPath(joinPaths(__dirname, '../assets/fonts/gg sans Bold.ttf'), 'Asap');
GlobalFonts.registerFromPath(joinPaths(__dirname, '../assets/fonts/gg sans Medium.ttf'), 'gg sans');

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

    // Render text with emoji support
    const renderMultiFontText = (text: string, x: number, y: number, maxWidth?: number) => {
      let currentX = x;
      const characters = Array.from(text);
      const mainFont = 'Asap';
      const regularFont = setFont(canvas, text, 300, mainFont, 50, 10, 'bold');
      const emojiFont = regularFont.replace(mainFont, 'Noto Color Emoji');
      
      for (const char of characters) {
        const isEmojiChar = char.codePointAt(0)! > 255;
        context.font = isEmojiChar ? emojiFont : regularFont;
        
        if (maxWidth && currentX + context.measureText(char).width > maxWidth) {
          context.fillText('...', currentX, y);
          return;
        }
        
        context.fillText(char, currentX, y);
        currentX += context.measureText(char).width;
      }
    };

    const addUser = async (userData: IUserModel, index: number) => {
      const offset = 160 * index;
      const discordUser = (await this.member.client.users.fetch(userData.userID.toString()).catch(() => null)) || this.member.client.user;

      let userCharacter = '';
      if (characters.includes(`${discordUser.username}.png`)) {
        userCharacter = `${discordUser.username}.png`;
      } else if (discordUser.bot) {
        userCharacter = 'Clyde.png';
      } else {
        userCharacter = userData.character
          ? `${userData.character}.png`
          : Util.seedShuffle(
              characters.filter((findAvatar) => findAvatar !== 'Clyde.png' && findAvatar !== 'Phibi.png'),
              parseInt(discordUser.username)
            )[0];
      }

      const level = userData ? userData.level : 0;
      const displayName = discordUser.displayName;
      const secondaryFont = 'gg sans';
      const mainFont = 'Asap';
      const backgroundColor = '#3a3c41';
      const mainColor = avatarsColors[userCharacter.toLowerCase().split('.')[0]!];
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

      // Render username with emoji support
      context.fillStyle = mainColor;
      renderMultiFontText(displayName, canvas.width / 2.8, 150 + offset, canvas.width - 300);

      // Rest of the code remains the same...
      context.fillStyle = tertiaryColor;
      context.font = `${36}px '${secondaryFont}'`;
      
      const baseX = canvas.width / 2.8;
      const baseY = 200 + offset;

      const levelLabel = 'Level: ';
      context.fillText(levelLabel, baseX, baseY);
      const levelLabelWidth = context.measureText(levelLabel).width;

      context.font = `bold ${36}px '${mainFont}'`;
      context.fillStyle = mainColor;
      const levelValue = level.toString();
      context.fillText(levelValue, baseX + levelLabelWidth, baseY);

      context.font = `${36}px '${secondaryFont}'`;
      context.fillStyle = tertiaryColor;
      const xpLabel = ' XP: ';
      const xpLabelWidth = context.measureText(xpLabel).width;
      context.fillText(xpLabel, baseX + levelLabelWidth + context.measureText(levelValue).width, baseY);

      context.font = `bold ${36}px '${mainFont}'`;
      context.fillStyle = mainColor;
      const xpValue = userData.currentXP.toString();
      context.fillText(xpValue, baseX + levelLabelWidth + context.measureText(levelValue + xpLabel).width, baseY);
    };

    if (this.type === 'global') {
      const globalUsers: IUserModel[] = await userModel.find({}).exec();
      globalUsers.sort((a, b) => b.totalXP - a.totalXP);

      for (let i = 0; i < 5; i++) {
        if (globalUsers[i]) await addUser(globalUsers[i], i);
      }
    } else if (this.type === 'local') {
      const localUsers: IUserModel[] = await userModel.find({ guildID: this.member.guild.id }).exec();
      localUsers.sort((a, b) => b.totalXP - a.totalXP);
      for (let i = 0; i < 5; i++) {
        if (localUsers[i]) await addUser(localUsers[i], i);
      }
    }

    return canvas;
  }
}
