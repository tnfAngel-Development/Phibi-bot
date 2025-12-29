import type { ClientEvents } from 'discord.js';
import type { IClientEvent } from '../classes/ClientEvent';
import eventsIndex from '../events/index';

export class EventManager {
	getEvents(): IClientEvent<keyof ClientEvents>[] {
		return Object.values(eventsIndex) as IClientEvent<keyof ClientEvents>[];
	}

	getEvent(
		predicate: (event: IClientEvent<keyof ClientEvents>) => boolean
	): IClientEvent<keyof ClientEvents> | undefined {
		return this.getEvents().find(predicate);
	}
}
