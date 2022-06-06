import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getError } from '../../utils';
import { Store } from '../../Store';
import LoadingBox from '../../component/LoadingBox';
import '../signin/SigninScreen.css';

function reducer(state, action) {
	switch (action.type) {
		case 'CREATE_REQUEST':
			return { ...state, loadingCreate: true, classe: action.payload };
		case 'CREATE_SUCCESS':
			return { ...state, loadingCreate: false };
		case 'CREATE_FAIL':
			return { ...state, loadingCreate: false };
		default:
			return state;
	}
}

const AddClassScreen = () => {
	const [ { loadingCreate }, dispatch ] = useReducer(reducer, {
		classe: [],
		loading: true,
		error: ''
	});

	const { state } = useContext(Store);
	const { userInfo, yearInfo } = state;

	const navigate = useNavigate();
	const [ name, setName ] = useState('');
	const [ description, setDescription ] = useState('');

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			dispatch({ type: 'CREATE_REQUEST' });
			const { data } = await axios.post(
				'/api/classes/new',
				{
					name,
					description,
					yearId: yearInfo._id
				},
				{
					headers: { Authorization: `Bearer ${userInfo.token}` }
				}
			);
			dispatch({ type: 'CREATE_SUCCESS', payload: data });
			navigate('/manage/classes/all');
		} catch (err) {
			dispatch({ type: 'CREATE_FAIL' });
			toast.error(getError(err));
		}
	};
	return (
		<Container className="small-container">
			<div className="wrapper">
				<Helmet>
					<title>Add Class</title>
				</Helmet>
				<h1 className="my-3">Add Class</h1>

				<Form onSubmit={submitHandler}>
					<Form.Group className="mb-3" controlId="name">
						<Form.Label>Class</Form.Label>
						<Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
					</Form.Group>
					<Form.Group className="mb-3" controlId="description">
						<Form.Label>Description</Form.Label>
						<Form.Control value={description} onChange={(e) => setDescription(e.target.value)} />
					</Form.Group>
					<div className="mb-3">
						<Button disabled={loadingCreate} type="submit">
							Create
						</Button>
						{loadingCreate && <LoadingBox />}
					</div>
				</Form>
			</div>
		</Container>
	);
};

export default AddClassScreen;
