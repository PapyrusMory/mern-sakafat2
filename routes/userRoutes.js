import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { isAuth, generateToken, isAdmin } from '../utils.js';

const userRouter = express.Router();

userRouter.post(
	'/new',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			isAdmin: req.body.isAdmin,
			isEducator: req.body.isEducator,
			isProf: req.body.isProf,
			password: bcrypt.hashSync(req.body.password)
		});

		const user = await newUser.save();
		res.send({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			isEducator: user.isEducator,
			isProf: user.isProf,
			token: generateToken(user)
		});
	})
);

userRouter.post(
	'/signin',
	expressAsyncHandler(async (req, res) => {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			if (bcrypt.compareSync(req.body.password, user.password)) {
				res.send({
					_id: user._id,
					name: user.name,
					email: user.email,
					isAdmin: user.isAdmin,
					isProf: user.isProf,
					isEducator: user.isEducator,
					token: generateToken(user)
				});
				return;
			}
		}
		res.status(401).send({ message: 'Invalid email or password' });
	})
);

userRouter.put(
	'/:id',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const user = await User.findById(req.params.id);
		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			user.isAdmin = Boolean(req.body.isAdmin);
			user.isEducator = Boolean(req.body.isEducator);
			user.isProf = Boolean(req.body.isProf);
			const updatedUser = await user.save();
			res.send({ message: 'User Updated', user: updatedUser });
		} else {
			res.status(404).send({ message: 'User Not Found' });
		}
	})
);

const PAGE_SIZE = 4;

userRouter.get(
	'/all',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const { query } = req;
		const page = query.page || 1;
		const pageSize = query.pageSize || PAGE_SIZE;

		const users = await User.find().skip(pageSize * (page - 1)).limit(pageSize);
		const countUsers = await User.countDocuments();
		res.send({
			users,
			countUsers,
			pages: Math.ceil(countUsers / pageSize)
		});
	})
);

userRouter.get(
	'/:id',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const user = await User.findById(req.params.id);
		if (user) {
			res.send(user);
		} else {
			res.status(404).send({ message: 'User Not Found' });
		}
	})
);

userRouter.delete(
	'/:id',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const user = await User.findById(req.params.id);
		if (user) {
			if (user.email === 'mory@mory.com') {
				res.status(400).send({ message: 'Can Not Delete Admin User' });
				return;
			}
			await user.remove();
			res.send({ message: 'User Deleted' });
		} else {
			res.status(404).send({ message: 'User Not Found' });
		}
	})
);

export default userRouter;
