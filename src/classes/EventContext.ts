import type { Client } from './Client';

export interface IEventContext {
	client: Client;
}

export class EventContext implements IEventContext {
	client: Client;

	constructor(eventContext: IEventContext) {
		this.client = eventContext.client;
	}
}
