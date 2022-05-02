// Local Types Imports
import type { CommandContext } from './CommandContext';

// External Types Imports
import type { Snowflake } from 'discord.js';

interface ISlashCommandChoise {
	name: string;
	value: string;
}

interface ISlashCommandOptions {
	name: string;
	description: string;
	type: number;
	required?: boolean;
	choices?: ISlashCommandChoise[];
	options?: ISlashCommandOptions[];
}

interface ICommandData {
	id: Snowflake;
	name: string;
	description: string;
	options: ISlashCommandOptions[];
	run: (ctx: CommandContext) => Promise<void>;
}

export class BaseCommand {
	id: Snowflake;
	name: string;
	description: string;
	options: ISlashCommandOptions[];
	run: (ctx: CommandContext) => Promise<void>;
	constructor(commandData: ICommandData) {
		this.id = commandData.id;
		this.name = commandData.name;
		this.description = commandData.description;
		this.options = commandData.options;

		this.run = commandData.run;
	}
}
