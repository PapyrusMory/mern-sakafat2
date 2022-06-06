import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { getError } from '../../utils';
import { Store } from '../../Store';
import LoadingBox from '../../component/LoadingBox';
import MessageBox from '../../component/MessageBox';
import '../signin/SigninScreen.css';

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		case 'UPDATE_REQUEST':
			return { ...state, loadingUpdate: true };
		case 'UPDATE_SUCCESS':
			return { ...state, loadingUpdate: false };
		case 'UPDATE_FAIL':
			return { ...state, loadingUpdate: false };
		default:
			return state;
	}
}

const UpdateUserScreen = () => {
	const [ { loading, error, loadingUpdate }, dispatch ] = useReducer(reducer, {
		loading: true,
		error: ''
	});

	const { state } = useContext(Store);
	const { userInfo } = state;
	const params = useParams();
	const { id } = params;

	const navigate = useNavigate();
	const [ name, setName ] = useState('');
	const [ description, setDescription ] = useState('');

	useEffect(
		() => {
			const fetchData = async () => {
				try {
					dispatch({ type: 'FETCH_REQUEST' });
					const { data } = await axios.get(`/api/years/${id}`, {
						headers: { Authorization: `Bearer ${userInfo.token}` }
					});
					setName(data.name);
					setDescription(data.description);

					dispatch({ type: 'FETCH_SUCCESS' });
				} catch (err) {
					dispatch({
						type: 'FETCH_FAIL',
						payload: getError(err)
					});
				}
			};
			fetchData();
		},
		[ userInfo, id ]
	);

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			dispatch({ type: 'UPDATE_REQUEST' });
			const { data } = await axios.put(
				`/api/years/${id}`,
				{
					_id: id,
					name,
					description
				},
				{
					headers: { Authorization: `Bearer ${userInfo.token}` }
				}
			);

			dispatch({ type: 'UPDATE_SUCCESS' });
			toast.success('User Updated Successfully');
			navigate('/manage/years/all');
		} catch (err) {
			toast.error(getError(err));
		}
	};

	return (
		<Container className="small-container">
			<div className="wrapper">
				<Helmet>
					<title>Edit Year {name}</title>
				</Helmet>
				<h1 className="my-3">Edit Year {name}</h1>

				{loading ? (
					<LoadingBox />
				) : error ? (
					<MessageBox variant="danger">{error}</MessageBox>
				) : (
					<Form onSubmit={submitHandler}>
						<Form.Group className="mb-3" controlId="name">
							<Form.Label>Name</Form.Label>
							<Form.Control value={name} onChange={(e) => setName(e.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="description">
							<Form.Label>Description</Form.Label>
							<Form.Control value={description} onChange={(e) => setDescription(e.target.value)} />
						</Form.Group>

						<div className="mb-3">
							<Button disabled={loadingUpdate} type="submit">
								Update
							</Button>
							{loadingUpdate && <LoadingBox />}
						</div>
					</Form>
				)}
			</div>
		</Container>
	);
};

export default UpdateUserScreen;
