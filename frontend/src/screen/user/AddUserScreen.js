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

const AddUserScreen = () => {
	const [ { loadingCreate }, dispatch ] = useReducer(reducer, {
		loading: true,
		error: ''
	});

	const { state } = useContext(Store);
	const { userInfo } = state;

	const navigate = useNavigate();
	const [ name, setName ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ isAdmin, setIsAdmin ] = useState(false);
	const [ isEducator, setIsEducator ] = useState(false);
	const [ isProf, setIsProf ] = useState(false);
	const [ password, setPassword ] = useState('');
	const [ confirmPassword, setConfirmPassword ] = useState('');

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			dispatch({ type: 'CREATE_REQUEST' });
			const { data } = await axios.post(
				`/api/users/new`,
				{
					name,
					email,
					isAdmin,
					isProf,
					isEducator,
					password,
					confirmPassword
				},
				{
					headers: { Authorization: `Bearer ${userInfo.token}` }
				}
			);

			dispatch({
				type: 'CREATE_SUCCESS'
			});
			toast.success('User Successfully Created');
			navigate('/admin/users/all');
		} catch (err) {
			toast.error(getError(err));
		}
	};
	return (
		<Container className="small-container">
			<div className="wrapper">
				<Helmet>
					<title>Add User</title>
				</Helmet>
				<h1 className="my-3">Add User</h1>

				<Form onSubmit={submitHandler}>
					<Form.Group className="mb-3" controlId="name">
						<Form.Label>Name</Form.Label>
						<Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
					</Form.Group>
					<Form.Group className="mb-3" controlId="email">
						<Form.Label>Email</Form.Label>
						<Form.Control value={email} type="email" onChange={(e) => setEmail(e.target.value)} required />
					</Form.Group>

					<Form.Group className="mb-3" controlId="image">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
					</Form.Group>

					<Form.Group className="mb-3" controlId="brand">
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</Form.Group>

					<Form.Check
						className="mb-3"
						type="checkbox"
						id="isAdmin"
						label="Is Admin"
						checked={isAdmin}
						onChange={(e) => setIsAdmin(e.target.checked)}
					/>

					<Form.Check
						className="mb-3"
						type="checkbox"
						id="isEducator"
						label="Is Educator"
						checked={isEducator}
						onChange={(e) => setIsEducator(e.target.checked)}
					/>

					<Form.Check
						className="mb-3"
						type="checkbox"
						id="isProf"
						label="Is Prof"
						checked={isProf}
						onChange={(e) => setIsProf(e.target.checked)}
					/>

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

export default AddUserScreen;
