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
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		case 'CREATE_REQUEST':
			return { ...state, loadingCreate: true };
		case 'CREATE_SUCCESS':
			return { ...state, loadingCreate: false };
		case 'CREATE_FAIL':
			return { ...state, loadingCreate: false };
		default:
			return state;
	}
}

const AddYearScreen = () => {
	const [ { loadingCreate }, dispatch ] = useReducer(reducer, {
		loading: true,
		error: ''
	});

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;

	const navigate = useNavigate();
	const [ name, setName ] = useState('');
	const [ description, setDescription ] = useState('');

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			dispatch({ type: 'CREATE_REQUEST' });

			const { data } = await axios.post(
				`/api/years/new`,
				{
					name,
					description
				},
				{
					headers: { Authorization: `Bearer ${userInfo.token}` }
				}
			);

			dispatch({
				type: 'CREATE_SUCCESS'
			});
			ctxDispatch({ type: 'CREATE_YEAR', payload: data });
			localStorage.setItem('yearInfo', JSON.stringify(data));
			toast.success('Year Successfully Created');
			navigate('/manage/years/all');
		} catch (err) {
			toast.error(getError(err));
		}
	};
	return (
		<Container className="small-container">
			<div className="wrapper">
				<Helmet>
					<title>Add Year</title>
				</Helmet>
				<h1 className="my-3">Add Year</h1>

				<Form onSubmit={submitHandler}>
					<Form.Group className="mb-3" controlId="name">
						<Form.Label>Année Scolaire</Form.Label>
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

export default AddYearScreen;
