import CommandsLeaderboard from './leaderboard.command.ts';
import CommandsRank from './rank.command.ts';
import CommandsSettings from './settings.command.ts';

export default {
	[CommandsLeaderboard.id]: CommandsLeaderboard,
	[CommandsRank.id]: CommandsRank,
	[CommandsSettings.id]: CommandsSettings
} as const;
