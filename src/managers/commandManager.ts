import { Command } from '../classes/Command';
import commandsIndex from '../commands/index';

export class CommandManager {
	getCommands(): Command[] {
		return Object.values(commandsIndex) as Command[];
	}

	getCommand(predicate: (command: Command) => boolean): Command | undefined {
		return this.getCommands().find(predicate);
	}
}
