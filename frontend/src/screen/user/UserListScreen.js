import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoadingBox from '../../component/LoadingBox';
import MessageBox from '../../component/MessageBox';
import { Store } from '../../Store';
import { getError } from '../../utils';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { Col, Container, Row } from 'react-bootstrap';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return {
				...state,
				users: action.payload.users,
				page: action.payload.page,
				pages: action.payload.pages,
				loading: false
			};
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		case 'DELETE_REQUEST':
			return { ...state, loadingDelete: true, successDelete: false };
		case 'DELETE_SUCCESS':
			return {
				...state,
				loadingDelete: false,
				successDelete: true
			};
		case 'DELETE_FAIL':
			return { ...state, loadingDelete: false };
		case 'DELETE_RESET':
			return { ...state, loadingDelete: false, successDelete: false };
		default:
			return state;
	}
};

const UserListScreen = () => {
	const [ { loading, error, users, pages, successDelete }, dispatch ] = useReducer(reducer, {
		loading: true,
		error: ''
	});

	const { search } = useLocation();
	const sp = new URLSearchParams(search);
	const page = sp.get('page') || 1;

	const { state } = useContext(Store);
	const { userInfo } = state;
	const navigate = useNavigate();

	const refreshPage = () => {
		window.location.reload();
	};

	const deleteHandler = async (userId) => {
		try {
			dispatch({ type: 'DELETE_REQUEST' });
			await axios.delete(`/api/users/${userId}`, {
				headers: { Authorization: `Bearer ${userInfo.token}` }
			});
			toast.success(`User Deleted Successfully`);
			dispatch({ type: 'DELETE_SUCCESS' });
			refreshPage();
		} catch (err) {
			toast(getError(err));
		}
	};

	useEffect(
		() => {
			const fetchData = async () => {
				try {
					const { data } = await axios.get(`/api/users/all?page=${page}`, {
						headers: { Authorization: `Bearer ${userInfo.token}` }
					});
					dispatch({ type: 'FETCH_SUCCESS', payload: data });
				} catch (error) {
					dispatch({
						type: 'FETCH_FAIL',
						payload: getError(error)
					});
				}
			};
			if (successDelete) {
				dispatch({ type: 'DELETE_RESET' });
			} else {
				fetchData();
			}
		},
		[ page, userInfo, successDelete ]
	);

	return (
		<div>
			<Helmet>
				<title> All Users List</title>
			</Helmet>

			<Container style={{ padding: '2em' }}>
				<Row>
					<Col sm={10}>
						<h1>All Users List</h1>
					</Col>
					<Col sm={2}>
						<Button style={{ color: '#fff' }} onClick={() => navigate('/admin/new-user')}>
							Add User
						</Button>
					</Col>
				</Row>
			</Container>

			{loading ? (
				<LoadingBox />
			) : error ? (
				<MessageBox variant="danger">{error}</MessageBox>
			) : (
				<table className="table">
					<thead>
						<tr>
							<th>ID</th>
							<th>NAME</th>
							<th>EMAIL</th>
							<th>ADMIN</th>
							<th>EDUCATOR</th>
							<th>PROF</th>
							<th>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user._id}>
								<td>{user._id}</td>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>{user.isAdmin ? `yes` : `no`}</td>
								<td>{user.isEducator ? `yes` : `no`}</td>
								<td>{user.isProf ? `yes` : `no`}</td>
								<td>
									<Button
										variant="outline-warning"
										size="sm"
										style={{ margin: '5px' }}
										onClick={() => navigate(`/admin/users/${user._id}`)}
									>
										Edit
									</Button>
									<Button
										variant="outline-danger"
										size="sm"
										style={{ margin: '5px' }}
										onClick={() => deleteHandler(user._id)}
									>
										Delete
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
			<div>
				{[ ...Array(pages).keys() ].map((x) => (
					<Link
						className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
						key={x + 1}
						to={`/admin/users/all?page=${x + 1}`}
					>
						{x + 1}
					</Link>
				))}
			</div>
		</div>
	);
};

export default UserListScreen;
