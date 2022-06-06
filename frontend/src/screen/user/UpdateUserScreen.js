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
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ confirmPassword, setConfirmPassword ] = useState('');
	const [ isAdmin, setIsAdmin ] = useState(false);
	const [ isEducator, setIsEducator ] = useState(false);
	const [ isProf, setIsProf ] = useState(false);

	useEffect(
		() => {
			const fetchData = async () => {
				try {
					dispatch({ type: 'FETCH_REQUEST' });
					const { data } = await axios.get(`/api/users/${id}`, {
						headers: { Authorization: `Bearer ${userInfo.token}` }
					});
					setName(data.name);
					setEmail(data.email);
					setIsAdmin(data.isAdmin);
					setIsProf(data.isProf);
					setIsEducator(data.isEducator);
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
				`/api/users/${id}`,
				{
					_id: id,
					name,
					email,
					isAdmin,
					isEducator,
					isProf,
					password,
					confirmPassword
				},
				{
					headers: { Authorization: `Bearer ${userInfo.token}` }
				}
			);

			dispatch({ type: 'UPDATE_SUCCESS' });
			toast.success('User Updated Successfully');
			navigate('/admin/users/all');
		} catch (err) {
			toast.error(getError(err));
		}
	};

	return (
		<Container className="small-container">
			<div className="wrapper">
				<Helmet>
					<title>Edit User {id}</title>
				</Helmet>
				<h1 className="my-3">Edit User</h1>

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
						<Form.Group className="mb-3" controlId="email">
							<Form.Label>Email</Form.Label>
							<Form.Control value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="password">
							<Form.Label>Change Password</Form.Label>
							<Form.Control type="password" onChange={(e) => setPassword(e.target.value)} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="confirmPassword">
							<Form.Label>Confirm New Password</Form.Label>
							<Form.Control type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
						</Form.Group>

						<Form.Check
							className="mb-3"
							type="checkbox"
							id="isAdmin"
							label="Is Admin ?"
							checked={isAdmin}
							onChange={(e) => setIsAdmin(e.target.checked)}
						/>

						<Form.Check
							className="mb-3"
							type="checkbox"
							id="isEducator"
							label="Is Educator ?"
							checked={isEducator}
							onChange={(e) => setIsEducator(e.target.checked)}
						/>

						<Form.Check
							className="mb-3"
							type="checkbox"
							id="isProf"
							label="Is Prof ?"
							checked={isProf}
							onChange={(e) => setIsProf(e.target.checked)}
						/>

						{userInfo &&
							userInfo.isAdmin(
								<div className="mb-3">
									<Button disabled={loadingUpdate} type="submit">
										Update
									</Button>
									{loadingUpdate && <LoadingBox />}
								</div>
							)}
					</Form>
				)}
			</div>
		</Container>
	);
};

export default UpdateUserScreen;
