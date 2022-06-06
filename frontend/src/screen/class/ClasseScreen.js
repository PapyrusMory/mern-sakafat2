import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { getError } from '../../utils';
import { Store } from '../../Store';
import StudentListByClasseScreen from '../student/StudentListByClasseScreen';
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

const ClasseScreen = () => {
	const [ { loading, error, loadingCreate }, dispatch ] = useReducer(reducer, {
		loading: true,
		error: ''
	});

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;
	const params = useParams();
	const { id } = params;

	const navigate = useNavigate();
	const [ name, setName ] = useState('');
	const [ description, setDescription ] = useState('');
	const [ yearId, setYearId ] = useState({});

	useEffect(
		() => {
			const fetchData = async () => {
				try {
					dispatch({ type: 'FETCH_REQUEST' });
					const { data } = await axios.get(`/api/classes/${id}`, {
						headers: { Authorization: `Bearer ${userInfo.token}` }
					});
					setName(data.name);
					setDescription(data.description);
					setYearId(data.yearId);

					dispatch({ type: 'FETCH_SUCCESS' });
					ctxDispatch({ type: 'CREATE_CLASSE', payload: data });
					localStorage.setItem('classeInfo', JSON.stringify(data));
					console.log(data);
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
	return (
		<div>
			<Helmet>
				<title>
					{name} - {description}
				</title>
			</Helmet>
			<Container style={{ padding: '.25em' }}>
				<h1 className="my-3"> {name}</h1>
				<h6 className="my-3">
					{yearId.name} - {description}
				</h6>
			</Container>
			<hr />
			<StudentListByClasseScreen />
		</div>
	);
};

export default ClasseScreen;
