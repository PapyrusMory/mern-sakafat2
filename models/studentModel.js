import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		birthDate: { type: String },
		birthPlace: { type: String },
		age: { type: String },
		sex: { type: Object },
		city: { type: String },
		country: { type: String },
		tel: { type: String },
		nationality: { type: String },
		redouble: { type: Object },
		etsOrigin: { type: String },
		previousClasse: { type: String },
		nextClasse: { type: String },
		dadName: { type: String },
		dadJob: { type: String },
		dadContact: { type: String },
		dadPlace: { type: String },
		momName: { type: String },
		momPlace: { type: String },
		momJob: { type: String },
		momContact: { type: String },
		affec: { type: Object },
		matricule: { type: String, required: true },
		schooling: { type: String },
		remise: { type: String },
		inscription: { type: String },
		versement: { type: String },
		image: { type: String },
		classeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Classe'
		}
	},
	{
		timestamps: true
	}
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
