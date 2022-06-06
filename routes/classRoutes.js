import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Classe from '../models/classModel.js';
import { isAuth, isAdmin, isEducator } from '../utils.js';

const classRouter = express.Router();

classRouter.post(
	'/new',
	isAuth,
	isEducator || isAdmin,
	expressAsyncHandler(async (req, res) => {
		const newClasse = new Classe({
			name: req.body.name,
			description: req.body.description,
			yearId: req.body.yearId
		});

		const classe = await newClasse.save();
		res.status(201).send({ message: 'New Class Created', classe });
	})
);

const PAGE_SIZE = 10;

classRouter.get(
	'/all',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const { query } = req;
		const page = query.page || 1;
		const pageSize = query.pageSize || PAGE_SIZE;

		const classes = await Classe.find().sort({ createdAt: 1 }).skip(pageSize * (page - 1)).limit(pageSize);
		const countClasses = await Classe.countDocuments();
		res.send({
			classes,
			countClasses,
			pages: Math.ceil(countClasses / pageSize)
		});
	})
);

classRouter.get(
	'/:yearId/classes',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const { query } = req;
		const page = query.page || 1;
		const pageSize = query.pageSize || PAGE_SIZE;

		const classes = await Classe.find({ yearId: req.params.yearId })
			.populate('yearId', '_id name')
			.sort({ name: -1 })
			.skip(pageSize * (page - 1))
			.limit(pageSize);
		const countClasses = await Classe.countDocuments();
		res.send({
			classes,
			countClasses,
			pages: Math.ceil(countClasses / pageSize)
		});
	})
);

classRouter.get(
	'/:id',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const classe = await Classe.findById(req.params.id).populate('yearId', '_id name').exec();
		if (classe) {
			res.send(classe);
		} else {
			res.status(404).send({ message: 'Class Not Found' });
		}
	})
);

classRouter.delete(
	'/:id',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const classe = await Classe.findById(req.params.id);
		if (classe) {
			await classe.remove();
			res.send({ message: 'Class Deleted' });
		} else {
			res.status(404).send({ message: 'Class Not Found' });
		}
	})
);

classRouter.put(
	'/:id',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const classe = await Classe.findById(req.params.id);
		if (classe) {
			classe.name = req.body.name || classe.name;
			classe.description = req.body.description || classe.description;

			const updatedClasse = await classe.save();
			res.send({ message: 'Class Updated', classe: updatedClasse });
		} else {
			res.status(404).send({ message: 'Class Not Found' });
		}
	})
);

export default classRouter;
