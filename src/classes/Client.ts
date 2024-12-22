import colors from 'colors/safe';
import { Client as DiscordClient, REST, Routes } from 'discord.js';
import { EventHandler } from '../handlers/eventHandler';
import { CommandManager } from '../managers/commandManager';
import { EventManager } from '../managers/eventManager';

// Client
export class Client extends DiscordClient {
	public managers = {
		eventManager: new EventManager(),
		commandManager: new CommandManager()
	};

	private readonly eventHandler = new EventHandler(this);

	async start(): Promise<void> {
		console.info(`Starting ${colors.cyan('Discord Client')}...`);

		this.eventHandler.start();

		const token = process.env['DISCORD_TOKEN'] as string;

		const rest = new REST().setToken(token);

		await rest.put(Routes.applicationCommands(process.env['DISCORD_ID'] ?? ''), {
			body: [...this.managers.commandManager.getCommands().map((cmd) => cmd.getConfig({ client: this }).slash)]
		});

		console.log('Posted commands');

		super.login(token);
	}
}
