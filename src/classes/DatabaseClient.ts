import mongoose from 'mongoose';

export class DatabaseClient {
	async connect(dbURI: string) {
		if (!dbURI) throw new Error('DB URI is not valid.');

		console.log('Connecting to database...');

		await mongoose.connect(dbURI).catch((err) => console.error('Unable to connect to the database:', err));

		mongoose.connection.on('open', () => {
			console.log('Database connection is ready.');
		});

		mongoose.connection.on('error', (err: Error) => {
			console.error('Database connection error:', err);
		});
	}
}
