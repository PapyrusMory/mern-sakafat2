import mongoose from 'mongoose';

const classeSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		yearId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Year'
		}
	},
	{
		timestamps: true
	}
);

const Classe = mongoose.model('Classe', classeSchema);
export default Classe;
