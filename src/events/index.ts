import EventsInteractionCreate from './interactionCreate.event.ts';
import EventsMessageCreate from './messageCreate.event.ts';
import EventsReady from './ready.event.ts';

export default {
	[EventsInteractionCreate.name]: EventsInteractionCreate,
	[EventsMessageCreate.name]: EventsMessageCreate,
	[EventsReady.name]: EventsReady
} as const;
