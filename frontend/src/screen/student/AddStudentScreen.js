import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import { Container, Form, Button, Row, Col, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getError } from '../../utils';
import { Store } from '../../Store';
import LoadingBox from '../../component/LoadingBox';
import './AddStudentScreen.css';

function reducer(state, action) {
	switch (action.type) {
		case 'CREATE_REQUEST':
			return { ...state, loadingCreate: true, student: action.payload };
		case 'CREATE_SUCCESS':
			return { ...state, loadingCreate: false };
		case 'CREATE_FAIL':
			return { ...state, loadingCreate: false };
		case 'UPLOAD_REQUEST':
			return { ...state, loadingUpload: true, errorUpload: '' };
		case 'UPLOAD_SUCCESS':
			return {
				...state,
				loadingUpload: false,
				errorUpload: ''
			};
		case 'UPLOAD_FAIL':
			return { ...state, loadingUpload: false, errorUpload: action.payload };
		default:
			return state;
	}
}

const AddStudentScreen = () => {
	const [ { loadingCreate, loadingUpload }, dispatch ] = useReducer(reducer, {
		student: [],
		loading: true,
		error: ''
	});

	const { state } = useContext(Store);
	const { userInfo, classeInfo } = state;

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

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			dispatch({ type: 'CREATE_REQUEST' });
			const { data } = await axios.post(
				'/api/students/new',
				{
					name,
					birthDate,
					birthPlace,
					age,
					sex,
					city,
					country,
					tel,
					nationality,
					redouble,
					etsOrigin,
					previousClasse,
					nextClasse,
					dadName,
					dadJob,
					dadContact,
					dadPlace,
					momName,
					momPlace,
					momJob,
					momContact,
					affec,
					matricule,
					schooling,
					remise,
					inscription,
					versement,
					image,
					classeId: classeInfo._id
				},
				{
					headers: { Authorization: `Bearer ${userInfo.token}` }
				}
			);
			dispatch({ type: 'CREATE_SUCCESS', payload: data });
			console.log(data);
			navigate(`/manage/classe/${classeInfo._id}`);
		} catch (err) {
			dispatch({ type: 'CREATE_FAIL' });
			toast.error(getError(err));
		}
	};

	const uploadFileHandler = async (e) => {
		const file = e.target.files[0];
		const bodyFormData = new FormData();
		bodyFormData.append('file', file);
		try {
			dispatch({ type: 'UPLOAD_REQUEST' });
			const { data } = await axios.post('/api/upload', bodyFormData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: `Bearer ${userInfo.token}`
				}
			});
			console.log(data);
			dispatch({ type: 'UPLOAD_SUCCESS' });

			toast.success('Image Uploaded Successfully');
			setImage(data.secure_url);
		} catch (err) {
			toast.error(getError(err));
			dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
		}
	};

	return (
		<Container className="small-container">
			<div className="wrapper">
				<Helmet>
					<title>Add Student</title>
				</Helmet>
				<h1 className="my-3">Add Student</h1>

				<Form onSubmit={submitHandler}>
					<Container style={{ padding: '2em' }}>
						<h5>Student Information</h5>
						<Row className="mb-3">
							<Col sm={12} md={6}>
								<Form.Group className="mb-3" controlId="imageFile">
									<Form.Label>Upload File</Form.Label>
									<Form.Control type="file" onChange={uploadFileHandler} />
									{loadingUpload && <LoadingBox />}
								</Form.Group>
							</Col>
							<Col sm={12} md={6}>
								<Form.Group className="mb-3" controlId="image">
									<Form.Label>Image</Form.Label>
									<Form.Control value={image} onChange={(e) => setImage(e.target.value)} />
								</Form.Group>
							</Col>
						</Row>
						<Row className="mb-3">
							<Col sm={12} md={4} className="mt-1">
								<div>Sex</div>
								<div className="form-check form-check-inline">
									<input
										className="form-check-input"
										type="radio"
										name="sex"
										id="male"
										value="male"
										checked={sex.male}
										onChange={(e) => setSex({ male: e.target.checked, female: !e.target.checked })}
									/>
									<label className="form-check-label" htmlFor="male">
										M
									</label>
								</div>
								<div className="form-check form-check-inline">
									<input
										className="form-check-input"
										type="radio"
										name="sex"
										id="female"
										value="female"
										checked={sex.female}
										onChange={(e) => setSex({ male: !e.target.checked, female: e.target.checked })}
									/>
									<label className="form-check-label" htmlFor="female">
										F
									</label>
								</div>
							</Col>
							<Col sm={12} md={4} className="mt-1">
								<div>Affecté</div>
								<div className="form-check form-check-inline">
									<input
										className="form-check-input"
										type="radio"
										name="affec"
										id="yes"
										value="yes"
										checked={affec.yes}
										onChange={(e) => setAffec({ yes: e.target.checked, no: !e.target.checked })}
									/>
									<label className="form-check-label" htmlFor="yes">
										Oui
									</label>
								</div>
								<div className="form-check form-check-inline">
									<input
										className="form-check-input"
										type="radio"
										name="affec"
										id="no"
										value="no"
										checked={affec.no}
										onChange={(e) => setAffec({ yes: !e.target.checked, no: e.target.checked })}
									/>
									<label className="form-check-label" htmlFor="no">
										Non
									</label>
								</div>
							</Col>
							<Col sm={12} md={4} className="mt-1">
								<div>Redouble</div>
								<div className="form-check form-check-inline">
									<input
										className="form-check-input"
										type="radio"
										name="redouble"
										id="yes"
										value="yes"
										checked={redouble.yes}
										onChange={(e) => setRedouble({ yes: e.target.checked, no: !e.target.checked })}
									/>
									<label className="form-check-label" htmlFor="yes">
										Oui
									</label>
								</div>
								<div className="form-check form-check-inline">
									<input
										className="form-check-input"
										type="radio"
										name="redouble"
										id="no"
										value="no"
										checked={redouble.no}
										onChange={(e) => setRedouble({ yes: !e.target.checked, no: e.target.checked })}
									/>
									<label className="form-check-label" htmlFor="no">
										Non
									</label>
								</div>
							</Col>
						</Row>
						<Row>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="matricule">
									<Form.Label>Matricule</Form.Label>
									<Form.Control
										value={matricule}
										onChange={(e) => setMatricule(e.target.value)}
										required
									/>
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="name">
									<Form.Label>Name</Form.Label>
									<Form.Control value={name} onChange={(e) => setName(e.target.value)} />
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="birthDate">
									<Form.Label>Birth Date</Form.Label>
									<Form.Control value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="birthPlace">
									<Form.Label>Birth Place</Form.Label>
									<Form.Control
										value={birthPlace}
										onChange={(e) => setBirthPlace(e.target.value)}
										required
									/>
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="age">
									<Form.Label>Age</Form.Label>
									<Form.Control value={age} onChange={(e) => setAge(e.target.value)} />
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="city">
									<Form.Label>City</Form.Label>
									<Form.Control value={city} onChange={(e) => setCity(e.target.value)} />
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="country">
									<Form.Label>Country</Form.Label>
									<Form.Control
										value={country}
										onChange={(e) => setCountry(e.target.value)}
										required
									/>
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="tel">
									<Form.Label>Tel</Form.Label>
									<Form.Control value={tel} onChange={(e) => setTel(e.target.value)} />
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="nationality">
									<Form.Label>Nationality</Form.Label>
									<Form.Control
										value={nationality}
										onChange={(e) => setNationality(e.target.value)}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row style={{ paddingBottom: '2em' }}>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="etsOrigin">
									<Form.Label>Origin</Form.Label>
									<Form.Control value={etsOrigin} onChange={(e) => setEtsOrigin(e.target.value)} />
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="previousClasse">
									<Form.Label>Previous Class</Form.Label>
									<Form.Control
										value={previousClasse}
										onChange={(e) => setPreviousClasse(e.target.value)}
									/>
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="nextClasse">
									<Form.Label>Next Class</Form.Label>
									<Form.Control value={nextClasse} onChange={(e) => setNextClasse(e.target.value)} />
								</Form.Group>
							</Col>
						</Row>
						<hr />
						<h5>Student Parent Information</h5>
						<Row>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="dadName">
									<Form.Label>Dad Name</Form.Label>
									<Form.Control value={dadName} onChange={(e) => setDadName(e.target.value)} />
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="dadContact">
									<Form.Label>Dad Contact</Form.Label>
									<Form.Control value={dadContact} onChange={(e) => setDadContact(e.target.value)} />
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="dadJob">
									<Form.Label>Dad Job</Form.Label>
									<Form.Control value={dadJob} onChange={(e) => setDadJob(e.target.value)} />
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="dadPlace">
									<Form.Label>Dad Place</Form.Label>
									<Form.Control
										value={dadPlace}
										onChange={(e) => setDadPlace(e.target.value)}
										required
									/>
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="momName">
									<Form.Label>Mom Name</Form.Label>
									<Form.Control value={momName} onChange={(e) => setMomName(e.target.value)} />
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="momContact">
									<Form.Label>Mom Contact</Form.Label>
									<Form.Control value={momContact} onChange={(e) => setMomContact(e.target.value)} />
								</Form.Group>
							</Col>
						</Row>
						<Row style={{ paddingBottom: '2em' }}>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="momJob">
									<Form.Label>Mom Job</Form.Label>
									<Form.Control value={momJob} onChange={(e) => setMomJob(e.target.value)} />
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="momContact">
									<Form.Label>Mom Place</Form.Label>
									<Form.Control value={momPlace} onChange={(e) => setMomPlace(e.target.value)} />
								</Form.Group>
							</Col>
						</Row>
						<hr />
						<h5>Schooling Informations</h5>
						<Row>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="schooling">
									<Form.Label>Schooling (FCFA)</Form.Label>
									<Form.Control value={schooling} onChange={(e) => setSchooling(e.target.value)} />
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="remise">
									<Form.Label>Remise (FCFA)</Form.Label>
									<Form.Control value={remise} onChange={(e) => setRemise(e.target.value)} />
								</Form.Group>
							</Col>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="inscription">
									<Form.Label>Inscription (FCFA)</Form.Label>
									<Form.Control
										value={inscription}
										onChange={(e) => setInscription(e.target.value)}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col sm={12} md={4}>
								<Form.Group className="mb-3" controlId="versement">
									<Form.Label>Versement (FCFA)</Form.Label>
									<Form.Control value={versement} onChange={(e) => setVersement(e.target.value)} />
								</Form.Group>
							</Col>
						</Row>
					</Container>
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

export default AddStudentScreen;
