import mongoose from 'mongoose';

const yearSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		description: { type: String },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	{
		timestamps: true
	}
);

const Year = mongoose.model('Year', yearSchema);
export default Year;
