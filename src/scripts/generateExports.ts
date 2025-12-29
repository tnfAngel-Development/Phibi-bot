import fs from 'node:fs';
import path from 'node:path';

console.log(`Generating exports for src`);

function getFiles(dir: string, files_: string[]) {
	files_ = files_ || [];
	const files = fs.readdirSync(dir);

	for (const i in files) {
		const name = dir + '/' + files[i];

		if (fs.statSync(name).isDirectory()) getFiles(name, files_);
		else files_.push(name);
	}

	return files_;
}

function generateIndex(dir: string, fileSuffix: string, objectAccess: string, pathToRemove: string) {
	const files = getFiles(dir, []).filter((p) => p.includes(fileSuffix));

	let importStatements = '';
	let filesObjects = '';

	let i = 0;

	for (const file of files) {
		const relativePath = path.relative(__dirname, file).replace(/\\/g, '/');

		const splittedPath = relativePath.substring(0, relativePath.length - 3).split('/');

		const fileName = splittedPath
			.slice(1, splittedPath.length)
			.map((part, index, array) => {
				let processedPart = part;
				if (index === array.length - 1) {
					processedPart = processedPart.replace(fileSuffix, '');
				}
				const cleanedPart = processedPart
					.split(/[^a-zA-Z0-9]+/)
					.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
					.join('');

				if (index === array.length - 1) {
					return cleanedPart.charAt(0).toUpperCase() + cleanedPart.slice(1);
				} else if (index !== 0) {
					return cleanedPart.charAt(0).toUpperCase() + cleanedPart.slice(1);
				} else return cleanedPart;
			})
			.join('');

		importStatements += `import ${fileName} from '${file.replace(pathToRemove, '')}';\n`;
		filesObjects += `	[${fileName}${objectAccess}]: ${fileName}${i !== files.length - 1 ? ',' : ''}\n`;
		i++;
	}

	return `${importStatements}\nexport default {\n${filesObjects}} as const;\n`;
}

await Bun.write('./src/commands/index.ts', generateIndex('./src/commands', '.command', '.id', 'src/commands/'));
await Bun.write('./src/events/index.ts', generateIndex('./src/events', '.event', '.name', 'src/events/'));
