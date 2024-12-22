import type { Client } from '../classes/Client';
import { EventContext } from '../classes/EventContext';

export class EventHandler {
	client: Client;
	constructor(client: Client) {
		this.client = client;
	}

	async start() {
		const events = this.client.managers.eventManager.getEvents();

		for (const event of events) {
			const name = event.name;

			const eventListener = async <Args extends []>(...args: Args) => {
				const ctx: EventContext = {
					client: this.client
				};

				event.run(ctx, ...args).catch((err) => {
					console.error('Event failed:', err);
				});
			};

			this.client[event.once ? 'once' : 'on'](name, eventListener);
		}
	}
}
