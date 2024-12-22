import { Schema, model } from 'mongoose';

const schema = new Schema({
	guildID: { type: String, index: true, default: '' },
	userID: { type: String, index: true, default: '' },
	level: { type: Number, default: 0 },
	totalXP: { type: Number, default: 0 },
	currentXP: { type: Number, default: 0 },
	character: { type: String, default: '' }
});

export interface IUserModel {
	guildID: string;
	userID: string;
	level: number;
	totalXP: number;
	currentXP: number;
	character: string;
}

export const userModel = model('user', schema);
