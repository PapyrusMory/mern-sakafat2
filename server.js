import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import yearRouter from './routes/yearRoutes.js';
import classRouter from './routes/classRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import studentRouter from './routes/studentRoutes.js';

dotenv.config();

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('connected to db');
	})
	.catch((err) => {
		console.log(err);
	});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/years', yearRouter);
app.use('/api/classes', classRouter);
app.use('/api/students', studentRouter);
app.use('/api/upload', uploadRouter);

app.use((err, req, res, next) => {
	res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`serve at http://localhost:${port}`);
});
