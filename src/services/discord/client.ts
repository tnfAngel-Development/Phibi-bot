export {};

// Local Imports
import { DiscordClientUtil } from './util';
import { DiscordClientConfig } from './config';
import { CommandManager } from './extensions/commandManager';
import { SlashCommandsClient } from './classes/SlashCommandClient';

// Local Types Imports
import type { PhibiClient } from '../../client';

// External Imports
import { Client } from 'discord.js';
import { readdirSync } from 'fs';

// External Types Imports
import type { ClientOptions } from 'discord.js';

// Client
export class DiscordClient extends Client {
	client: PhibiClient;
	config: DiscordClientConfig;
	util: DiscordClientUtil;
	extensions: { commandManager: CommandManager };
	slashCommands: SlashCommandsClient;
	log: {
		error: (message: string) => void;
		warn: (message: string) => void;
		info: (message: string) => void;
		debug: (message: string) => void;
	};
	loadHandlers: (eventsPath: string) => Promise<void>;
	constructor(client: PhibiClient, options: ClientOptions) {
		super(options);

		// Client
		this.client = client;

		// Config & util
		this.config = new DiscordClientConfig();
		this.util = new DiscordClientUtil();

		// Extensions
		this.extensions = {
			commandManager: new CommandManager(),
		};

		// Slash Commands
		this.slashCommands = new SlashCommandsClient(
			this.config.bot.token,
			this.config.bot.id
		);

		// Logs
		this.log = {
			error: (message: string): void =>
				this.client.log.error(
					`[ ${this.client.logColors.magenta('DISCORD')} ] ${message}`
				),
			warn: (message: string): void =>
				this.client.log.warn(
					`[ ${this.client.logColors.magenta('DISCORD')} ] ${message}`
				),
			info: (message: string): void =>
				this.client.log.info(
					`[ ${this.client.logColors.magenta('DISCORD')} ] ${message}`
				),
			debug: (message: string): void =>
				this.client.log.debug(
					`[ ${this.client.logColors.magenta('DISCORD')} ] ${message}`
				),
		};

		// Handlers loader
		this.loadHandlers = async (eventsPath: string): Promise<void> => {
			const startDate = new Date();

			const files = readdirSync(
				eventsPath.replace('./', './src/services/discord/')
			);

			for (const file of files) {
				if (file.endsWith('.ts')) {
					const name = file.substring(0, file.length - 3);
					const content = require(`${eventsPath}${file}`);

					this.on(name, content.bind(null, this.client));

					const loadDate = new Date();

					this.log.info(
						`Event ${this.client.logColors.cyan(
							name
						)} loaded (${this.client.logColors.magenta(
							`${loadDate.getTime() - startDate.getTime()}`
						)} ms)`
					);

					delete require.cache[
						require.resolve(`${eventsPath}${file}`)
					];
				}
			}

			if (this.config.slashCommands.update) {
				const commands = this.extensions.commandManager.getCommands();

				for (const command of commands) {
					if (command.id && !this.config.slashCommands.guildTest) {
						await this.slashCommands
							.editCommand(
								{
									name: command.name,
									description: command.description,
									options: command.options,
								},
								command.id
							)
							.then((resCommand: any): void =>
								this.log.info(
									`Slash command ${this.client.logColors.cyan(
										command.name
									)} updated successfully (${this.client.logColors.magenta(
										resCommand.id
									)})`
								)
							)
							.catch((error: Error): void =>
								this.client.log.info(
									JSON.stringify(error, null, 2)
								)
							);
					} else {
						await this.slashCommands
							.createCommand(
								{
									name: command.name,
									description: command.description,
									options: command.options,
								},
								this.config.slashCommands.guildTest
							)
							.then((resCommand: any): void =>
								this.log.info(
									`Slash command ${this.client.logColors.cyan(
										command.name
									)} created successfully (${this.client.logColors.magenta(
										resCommand.id
									)})`
								)
							)
							.catch((error: Error): void =>
								this.client.log.info(
									JSON.stringify(error, null, 2)
								)
							);
					}
					await this.client.util.wait(
						this.config.slashCommands.delay
					);
				}
			}
		};
	}

	async start(): Promise<void> {
		this.log.info(
			`Starting ${this.client.logColors.cyan('Discord Client')}...`
		);
		await this.login(this.config.bot.token);
		await this.loadHandlers('./events/');
	}
}
