import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../../component/LoadingBox';
import MessageBox from '../../component/MessageBox';
import { Store } from '../../Store';
import { getError } from '../../utils';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { Col, Container, Row } from 'react-bootstrap';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return {
				...state,
				students: action.payload.students,
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

const ClasseListByYearScreen = () => {
	const [ { loading, error, students, pages, successDelete }, dispatch ] = useReducer(reducer, {
		loading: true,
		error: ''
	});

	const { search } = useLocation();
	const sp = new URLSearchParams(search);
	const page = sp.get('page') || 1;

	const { state } = useContext(Store);
	const { userInfo } = state;
	const navigate = useNavigate();
	const params = useParams();
	const { id } = params;
	console.log(id);

	const refreshPage = () => {
		window.location.reload();
	};

	const deleteHandler = async (studentId) => {
		try {
			dispatch({ type: 'DELETE_REQUEST' });
			await axios.delete(`/api/students/${studentId}`, {
				headers: { Authorization: `Bearer ${userInfo.token}` }
			});
			toast.success(`Student Deleted Successfully`);
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
					const { data } = await axios.get(`/api/students/${id}/students?page=${page}`, {
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
				<title> Students List</title>
			</Helmet>

			<Container style={{ padding: '2em' }}>
				<Row>
					<Col sm={10}>
						<h1>Students List</h1>
					</Col>
					<Col sm={2}>
						<Button style={{ color: '#fff' }} onClick={() => navigate('/manage/students/new')}>
							Add New Student
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
							<th>MATRICULE</th>
							<th>NAME</th>
							<th>SEX</th>
							<th>AFFECTÉ</th>
							<th>REDOUBLE</th>
							<th>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{students.map((student) => (
							<tr key={student._id}>
								<td>
									<Link
										to={`/manage/student/${student._id}`}
										style={{ textDecoration: 'none', color: 'black' }}
									>
										{student.matricule}
									</Link>
								</td>
								<td>
									<Link
										to={`/manage/student/${student._id}`}
										style={{ textDecoration: 'none', color: 'black' }}
									>
										{student.name}
									</Link>
								</td>
								<td>
									<Link
										to={`/manage/student/${student._id}`}
										style={{ textDecoration: 'none', color: 'black' }}
									>
										{student.sex.male === true ? 'M' : 'F'}
									</Link>
								</td>
								<td>
									<Link
										to={`/manage/student/${student._id}`}
										style={{ textDecoration: 'none', color: 'black' }}
									>
										{student.affec.yes === true ? 'YES' : 'NO'}
									</Link>
								</td>
								<td>
									<Link
										to={`/manage/student/${student._id}`}
										style={{ textDecoration: 'none', color: 'black' }}
									>
										{student.redouble.yes === true ? 'YES' : 'NO'}
									</Link>
								</td>
								<td>
									<Button
										variant="outline-warning"
										size="sm"
										style={{ margin: '5px' }}
										onClick={() => navigate(`/manage/student/${student._id}/update`)}
									>
										Edit
									</Button>
									<Button
										variant="outline-danger"
										size="sm"
										style={{ margin: '5px' }}
										onClick={() => deleteHandler(student._id)}
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
						to={`/manage/students/${id}/students?page=${x + 1}`}
					>
						{x + 1}
					</Link>
				))}
			</div>
		</div>
	);
};

export default ClasseListByYearScreen;
