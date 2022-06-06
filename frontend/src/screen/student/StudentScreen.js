import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Figure from 'react-bootstrap/Figure';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { getError } from '../../utils';
import { Store } from '../../Store';

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
}

const StudentScreen = () => {
	const [ { loading, error }, dispatch ] = useReducer(reducer, {
		loading: true,
		error: ''
	});

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;
	const params = useParams();
	const { id } = params;

	const navigate = useNavigate();
	const [ name, setName ] = useState('');
	const [ birthDate, setBirthDate ] = useState('');
	const [ birthPlace, setBirthPlace ] = useState('');
	const [ age, setAge ] = useState('');
	const [ sex, setSex ] = useState({
		male: false,
		female: false
	});
	const [ city, setCity ] = useState('');
	const [ country, setCountry ] = useState('');
	const [ tel, setTel ] = useState('');
	const [ nationality, setNationality ] = useState('');
	const [ redouble, setRedouble ] = useState({
		yes: false,
		no: false
	});
	const [ etsOrigin, setEtsOrigin ] = useState('');
	const [ previousClasse, setPreviousClasse ] = useState('');
	const [ nextClasse, setNextClasse ] = useState('');
	const [ dadName, setDadName ] = useState('');
	const [ dadJob, setDadJob ] = useState('');
	const [ dadContact, setDadContact ] = useState('');
	const [ dadPlace, setDadPlace ] = useState('');
	const [ momName, setMomName ] = useState('');
	const [ momJob, setMomJob ] = useState('');
	const [ momContact, setMomContact ] = useState('');
	const [ momPlace, setMomPlace ] = useState('');
	const [ affec, setAffec ] = useState({
		yes: false,
		no: false
	});
	const [ matricule, setMatricule ] = useState('');
	const [ schooling, setSchooling ] = useState(0);
	const [ remise, setRemise ] = useState(0);
	const [ inscription, setInscription ] = useState(0);
	const [ versement, setVersement ] = useState(0);
	const [ image, setImage ] = useState('');
	const [ classeId, setClasseId ] = useState({});

	useEffect(
		() => {
			const fetchData = async () => {
				try {
					dispatch({ type: 'FETCH_REQUEST' });
					const { data } = await axios.get(`/api/students/${id}`, {
						headers: { Authorization: `Bearer ${userInfo.token}` }
					});
					setName(data.name);
					setBirthDate(data.birthDate);
					setBirthPlace(data.birthPlace);
					setAge(data.age);
					setSex(data.sex);
					setCity(data.city);
					setCountry(data.country);
					setTel(data.tel);
					setNationality(data.nationality);
					setRedouble(data.redouble);
					setEtsOrigin(data.etsOrigin);
					setPreviousClasse(data.previousClasse);
					setNextClasse(data.nextClasse);
					setDadName(data.dadName);
					setDadJob(data.dadJob);
					setDadContact(data.dadContact);
					setDadPlace(data.dadPlace);
					setMomName(data.momName);
					setMomJob(data.momJob);
					setMomContact(data.momContact);
					setMomPlace(data.momPlace);
					setAffec(data.affec);
					setMatricule(data.matricule);
					setSchooling(data.schooling);
					setRemise(data.remise);
					setInscription(data.inscription);
					setVersement(data.versement);
					setImage(data.image);
					setClasseId(data.classeId);

					dispatch({ type: 'FETCH_SUCCESS' });
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
				<title>Elève - {matricule}</title>
			</Helmet>
			<Container fluid style={{ padding: '.25em', marginBottom: '40px' }}>
				<h1 className="my-3">
					{name} - {classeId.name}
				</h1>
			</Container>

			<div
				fluid="true"
				id="studentFile"
				style={{
					height: '1448px',
					width: '1024px',
					border: '1px solid rgb(211, 194, 194)',
					flexGrow: 1,
					borderRadius: '10px 10px 10px 10px',
					overflow: 'hidden',
					WebkitBoxShadow: '0px 12px 18px -6px rgba(0, 0, 0, 0.3)',
					boxShadow: '0px 12px 18px -6px rgba(0, 0, 0, 0.3)'
				}}
			>
				<Container style={{ fontSize: '.1rem', textAlign: 'center' }}>
					<Row>
						<Col xs={5} style={{ margin: '20px' }}>
							<h6>MINISTÈRE DE L'ÉDUCATION NATIONAL ET DE L'ALPHABÉTISATION</h6>
							<hr style={{ marginTop: '5px', marginBottom: '4px' }} />
							<h6>DIRECTION REGIONALE DE KORHOGO</h6>
							<hr style={{ marginTop: '5px', marginBottom: '4px' }} />
							<img
								src="https://raw.githubusercontent.com/PapyrusMory/sakafat_islamiat/master/client/assets/images/sakafat.png?token=GHSAT0AAAAAABSOC7QMTVJOBEICX2P45B5GYUHWF6Q"
								alt="logo"
								width="250px"
							/>
						</Col>
						<Col />
						<Col xs={5} style={{ margin: '20px' }}>
							<h6>RÉPUBLIQUE DE CÔTE D'IVOIRE</h6>
							<hr style={{ marginTop: '5px', marginBottom: '4px' }} />
							<h6>UNION - DISCIPLINE - TRAVAIL</h6>
							<hr xs={5} style={{ margin: '15px' }} />
							<h6>ANNÉE SCOLAIRE: </h6>
						</Col>
					</Row>
				</Container>
				<Container>
					<h2 style={{ border: '2px solid black', textAlign: 'center', margin: '20px' }}>
						Informations Personnelles de l'Elève
					</h2>
				</Container>
				<Container style={{ margin: '20px' }}>
					<Row>
						<Col>
							<Figure>
								<Figure.Image
									width={200}
									height={200}
									alt="171x180"
									src={image}
									style={{ padding: '20px' }}
								/>
							</Figure>
						</Col>
						<Col>ddd</Col>
						<Col>dfff</Col>
						<Col>ffff</Col>
					</Row>
				</Container>
			</div>
		</div>
	);
};

export default StudentScreen;
