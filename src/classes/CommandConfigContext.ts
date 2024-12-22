import type { Client } from './Client';

export interface ICommandConfigContext {
	client: Client;
}

export class CommandConfigContext implements ICommandConfigContext {
	client: Client;

	constructor({ client }: ICommandConfigContext) {
		this.client = client;
	}
}
