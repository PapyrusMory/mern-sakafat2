import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Year from '../models/yearModel.js';
import { isAuth, isAdmin, isEducator } from '../utils.js';

const yearRouter = express.Router();

yearRouter.post(
	'/new',
	isAuth,
	isEducator || isAdmin,
	expressAsyncHandler(async (req, res) => {
		const newYear = new Year({
			name: req.body.name,
			description: req.body.description,
			year: req.year._id
		});

		const year = await newYear.save();
		res.status(201).send({ message: 'New Year Created', year });
	})
);

const PAGE_SIZE = 4;

yearRouter.get(
	'/all',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const { query } = req;
		const page = query.page || 1;
		const pageSize = query.pageSize || PAGE_SIZE;

		const years = await Year.find().sort({ createdAt: -1 }).skip(pageSize * (page - 1)).limit(pageSize);
		const countYears = await Year.countDocuments();
		res.send({
			years,
			countYears,
			pages: Math.ceil(countYears / pageSize)
		});
	})
);

yearRouter.get(
	'/:id',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const year = await Year.findById(req.params.id);
		if (year) {
			res.send(year);
		} else {
			res.status(404).send({ message: 'Year Not Found' });
		}
	})
);

yearRouter.delete(
	'/:id',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const year = await Year.findById(req.params.id);
		if (year) {
			await year.remove();
			res.send({ message: 'Year Deleted' });
		} else {
			res.status(404).send({ message: 'Year Not Found' });
		}
	})
);

yearRouter.put(
	'/:id',
	isAuth,
	isAdmin || isEducator,
	expressAsyncHandler(async (req, res) => {
		const year = await Year.findById(req.params.id);
		if (year) {
			year.name = req.body.name || year.name;
			year.description = req.body.description || year.description;

			const updatedYear = await year.save();
			res.send({ message: 'Year Updated', year: updatedYear });
		} else {
			res.status(404).send({ message: 'Year Not Found' });
		}
	})
);

export default yearRouter;
