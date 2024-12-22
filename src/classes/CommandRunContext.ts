import { ChatInputCommandInteraction } from 'discord.js';
import type { Client } from './Client';

export interface ICommandRunContext {
	client: Client;
	interaction: ChatInputCommandInteraction;
}

export class CommandRunContext implements ICommandRunContext {
	client: Client;
	interaction: ChatInputCommandInteraction;

	constructor({ client, interaction }: ICommandRunContext) {
		this.client = client;
		this.interaction = interaction;
	}
}
