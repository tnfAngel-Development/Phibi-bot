// External Imports
import { connect, connection } from 'mongoose';

// External Types Imports
import type { Connection, ConnectOptions } from 'mongoose';

// Local Types Imports
import type { PhibiClient } from '../../client';

// Client
export class DatabaseClient {
	client: PhibiClient;
	log: {
		error: (message: string) => void;
		warn: (message: string) => void;
		info: (message: string) => void;
		debug: (message: string) => void;
	};
	dbConfig: { uri: string; user: string; password: string };
	dbOptions: ConnectOptions;
	connection: Connection;

	constructor(client: PhibiClient) {
		this.client = client;

		this.log = {
			error: (message: string): void =>
				this.client.log.error(
					`[ ${this.client.logColors.green('DATABASE')} ] ${message}`
				),
			warn: (message: string): void =>
				this.client.log.warn(
					`[ ${this.client.logColors.green('DATABASE')} ] ${message}`
				),
			info: (message: string): void =>
				this.client.log.info(
					`[ ${this.client.logColors.green('DATABASE')} ] ${message}`
				),
			debug: (message: string): void =>
				this.client.log.debug(
					`[ ${this.client.logColors.green('DATABASE')} ] ${message}`
				),
		};

		// Config
		this.dbConfig = {
			uri: process.env.DB_URI as string,
			user: process.env.DB_USER as string,
			password: process.env.DB_PASSWORD as string,
		};

		// Options
		this.dbOptions = {
			user: this.dbConfig.user,
			pass: this.dbConfig.password,
		};

		this.connection = connection;
	}

	async start() {
		this.log.info(
			`Starting ${this.client.logColors.cyan('Database Client')}...`
		);

		connect(this.dbConfig.uri, this.dbOptions);

		this.connection.once('open', (): void => {
			this.log.info(
				`Connection is ${this.client.logColors.cyan('ready')}.`
			);
		});

		this.connection.on('error', (err: Error): void => {
			this.log.error(
				`Connection error: ${this.client.logColors.red(
					JSON.stringify(err, null, 2)
				)}`
			);
		});
	}
}
