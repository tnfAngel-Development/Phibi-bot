export {};

// External Imports
import { Schema, model } from 'mongoose';

const schema = new Schema({
	guildID: { type: String, default: '' },
	level: { type: Number, default: 0 },
	roles: { type: Array, default: [] },
});

export const levelRoleModel = model('levelRole', schema);
