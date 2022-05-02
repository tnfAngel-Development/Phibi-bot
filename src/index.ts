export {};

// External Imports
import { config as dotenvConfig } from 'dotenv';

// Local Imports
import { PhibiClient } from './client';

// Dotenv
dotenvConfig();

// Client
const client = new PhibiClient();

client.start();
