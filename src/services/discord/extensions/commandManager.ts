// Local Types Imports
import type { BaseCommand } from '../classes/BaseCommand';

// External Imports
import { readdirSync } from 'fs';

export class CommandManager {
	getCommands(): BaseCommand[] {
		const path = '../commands/';
		const commands: BaseCommand[] = [];

		function addCommand(commandPath: string) {
			const command = require(commandPath);

			commands.push(command);
		}

		const filePaths = readdirSync(
			path.replace('../', './src/services/discord/')
		);

		for (const filePath of filePaths) {
			if (filePath.endsWith('.ts')) {
				addCommand(`${path}${filePath}`);
			}
		}

		return commands;
	}

	getCommand(findFN: any): BaseCommand | undefined {
		return this.getCommands().find(findFN);
	}
}
