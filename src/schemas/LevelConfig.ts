import { Schema, model } from 'mongoose';

const schema = new Schema({
	guildID: { type: String, index: true, default: '' },
	removeOldRoles: { type: Boolean, default: false },
	levelLog: { type: String, default: '' }
});

export const levelConfigModel = model('levelConfig', schema);
