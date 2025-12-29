import { readFileSync } from 'node:fs';
import type { characters } from './constants';

import capCharacter from './assets/characters/Cap.png' with { type: 'file' };
import clydeCharacter from './assets/characters/Clyde.png' with { type: 'file' };
import froggyCharacter from './assets/characters/Froggy.png' with { type: 'file' };
import gusiCharacter from './assets/characters/Gusi.png' with { type: 'file' };
import nellyCharacter from './assets/characters/Nelly.png' with { type: 'file' };
import phibiCharacter from './assets/characters/Phibi.png' with { type: 'file' };
import wumpusCharacter from './assets/characters/Wumpus.png' with { type: 'file' };

import asapFont from './assets/fonts/Asap.ttf' with { type: 'file' };
import backgroundImage from './assets/images/leaderboardBackground.png' with { type: 'file' };

export const asapFontFile = readFileSync(asapFont);
export const backgroundImageFile = readFileSync(backgroundImage);
export const clydeCharacterFile = readFileSync(clydeCharacter);

export const characterFiles: Record<(typeof characters)[number], Buffer> = {
	'Cap.png': readFileSync(capCharacter),
	'Clyde.png': readFileSync(clydeCharacter),
	'Froggy.png': readFileSync(froggyCharacter),
	'Gusi.png': readFileSync(gusiCharacter),
	'Nelly.png': readFileSync(nellyCharacter),
	'Phibi.png': readFileSync(phibiCharacter),
	'Wumpus.png': readFileSync(wumpusCharacter)
};
