// Local Types Imports
import type { PhibiClient } from '../../../client';

// External Types Imports
import type { CommandInteraction } from 'discord.js';

interface ICommandContext {
	client: PhibiClient;
	interaction: CommandInteraction;
	args: (string | number | boolean | undefined)[];
}

export class CommandContext {
	client: PhibiClient;
	interaction: CommandInteraction;
	args: (string | number | boolean | undefined)[];
	constructor(commandContext: ICommandContext) {
		this.client = commandContext.client;
		this.interaction = commandContext.interaction;
		this.args = commandContext.args;
	}
}
