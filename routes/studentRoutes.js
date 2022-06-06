import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Student from '../models/studentModel.js';
import { isAuth, isAdmin, isEducator } from '../utils.js';

const studentRouter = express.Router();

studentRouter.post(
	'/new',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const newStudent = new Student({
			name: req.body.name,
			birthDate: req.body.birthDate,
			birthPlace: req.body.birthPlace,
			age: req.body.age,
			sex: req.body.sex,
			city: req.body.city,
			country: req.body.country,
			tel: req.body.tel,
			nationality: req.body.nationality,
			redouble: req.body.redouble,
			etsOrigin: req.body.etsOrigin,
			previousClasse: req.body.previousClasse,
			nextClasse: req.body.nextClasse,
			dadName: req.body.dadName,
			dadJob: req.body.dadJob,
			dadContact: req.body.dadContact,
			dadPlace: req.body.dadPlace,
			momName: req.body.momName,
			momPlace: req.body.momPlace,
			momJob: req.body.momJob,
			momContact: req.body.momContact,
			affec: req.body.affec,
			matricule: req.body.matricule,
			schooling: req.body.schooling,
			remise: req.body.remise,
			inscription: req.body.inscription,
			versement: req.body.versement,
			image: req.body.image,
			classeId: req.body.classeId
		});

		const student = await newStudent.save();
		res.status(201).send({ message: 'New Student Created', student });
	})
);

const PAGE_SIZE = 10;

studentRouter.get(
	'/all',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const { query } = req;
		const page = query.page || 1;
		const pageSize = query.pageSize || PAGE_SIZE;

		const students = await Student.find()
			.populate('classeId', '_id name')
			.sort({ name: -1 })
			.skip(pageSize * (page - 1))
			.limit(pageSize);
		const countStudents = await Student.countDocuments();
		res.send({
			students,
			countStudents,
			pages: Math.ceil(countStudents / pageSize)
		});
	})
);

studentRouter.get(
	'/:classeId/students',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const { query } = req;
		const page = query.page || 1;
		const pageSize = query.pageSize || PAGE_SIZE;

		const students = await Student.find({ classeId: req.params.classeId })
			.populate('classeId', '_id name')
			.sort({ name: -1 })
			.skip(pageSize * (page - 1))
			.limit(pageSize);
		const countStudents = await Student.countDocuments();
		res.send({
			students,
			countStudents,
			pages: Math.ceil(countStudents / pageSize)
		});
	})
);

studentRouter.get(
	'/:id',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const student = await Student.findById(req.params.id).populate('classeId', '_id name').exec();
		if (student) {
			res.send(student);
		} else {
			res.status(404).send({ message: 'Student Not Found' });
		}
	})
);

studentRouter.delete(
	'/:id',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const student = await Student.findById(req.params.id);
		if (student) {
			await student.remove();
			res.send({ message: 'Student Deleted' });
		} else {
			res.status(404).send({ message: 'Student Not Found' });
		}
	})
);

studentRouter.put(
	'/:id',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const student = await Student.findById(req.params.id);
		if (student) {
			student.name = req.body.name || student.name;
			student.birthDate = req.body.birthDate || student.birthDate;
			student.birthPlace = req.body.birthPlace || student.birthPlace;
			student.age = req.body.age || student.age;
			student.sex = req.body.sex || student.sex;
			student.city = req.body.city || student.city;
			student.country = req.body.country || student.country;
			student.tel = req.body.tel || student.tel;
			student.nationality = req.body.nationality || student.nationality;
			student.redouble = req.body.redouble || student.redouble;
			student.etsOrigin = req.body.etsOrigin || student.etsOrigin;
			student.previousClasse = req.body.previousClasse || student.previousClasse;
			student.nextClasse = req.body.nextClasse || student.nextClasse;
			student.dadName = req.body.dadName || student.dadName;
			student.dadJob = req.body.dadJob || student.dadJob;
			student.dadContact = req.body.dadContact || student.dadContact;
			student.dadPlace = req.body.dadPlace || student.dadPlace;
			student.momName = req.body.momName || student.momName;
			student.momPlace = req.body.momPlace || student.momPlace;
			student.momJob = req.body.momJob || student.momJob;
			student.momContact = req.body.momContact || student.momContact;
			student.affec = req.body.affec || student.affec;
			student.matricule = req.body.matricule || student.matricule;
			student.schooling = req.body.schooling || student.schooling;
			student.remise = req.body.remise || student.remise;
			student.inscription = req.body.inscription || student.inscription;
			student.versement = req.body.versement || student.versement;
			student.image = req.body.image || student.image;

			const updatedStudent = await student.save();
			res.send({ message: 'Student Information Updated', student: updatedStudent });
		} else {
			res.status(404).send({ message: 'Class Not Found' });
		}
	})
);

export default studentRouter;
