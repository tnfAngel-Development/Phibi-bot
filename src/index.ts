import { GatewayIntentBits } from 'discord.js';
import { Client } from './classes/Client';
import { DatabaseClient } from './classes/DatabaseClient';

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const dbClient = new DatabaseClient();

dbClient.connect(process.env.DB_URI ?? '');

client.start();
