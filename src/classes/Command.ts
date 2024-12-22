import {
	type SlashCommandBuilder,
	type SlashCommandOptionsOnlyBuilder,
	type SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import type { CommandConfigContext } from './CommandConfigContext';
import type { CommandRunContext } from './CommandRunContext';

export interface ICommand {
	id: string;
	config: (ctx: CommandConfigContext) => {
		slash: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
		isHidden?: boolean;
	};
	run: (ctx: CommandRunContext) => Promise<any>;
}

export class Command implements ICommand {
	id: string;
	config: (ctx: CommandConfigContext) => {
		slash: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
		isHidden?: boolean;
	};
	run: (ctx: CommandRunContext) => Promise<any>;

	constructor(commandOptions: ICommand) {
		this.id = commandOptions.id;
		this.config = commandOptions.config;
		this.run = commandOptions.run;
	}

	getConfig(ctx: CommandConfigContext) {
		return this.config(ctx);
	}
}
