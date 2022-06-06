import { useContext, useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from '../Store';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Header = () => {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;

	const signoutHandler = () => {
		ctxDispatch({ type: 'USER_SIGNOUT' });
		localStorage.removeItem('userInfo');
		window.location.href = '/signin';
	};

	return (
		<header>
			<Navbar bg="light" variant="light" expand="lg">
				<Container fluid>
					<LinkContainer to="/">
						<Navbar.Brand>School App</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto  w-100  justify-content-end">
							{userInfo ? (
								<NavDropdown title={userInfo.name} id="basic-nav-dropdown">
									<LinkContainer to="/profile">
										<NavDropdown.Item>User Profile</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to="/manage/years/all">
										<NavDropdown.Item>Manage</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Divider />
									<Link className="dropdown-item" to="#signout" onClick={signoutHandler}>
										Sign Out
									</Link>
								</NavDropdown>
							) : (
								<Link className="nav-link" to="/signin">
									Sign In
								</Link>
							)}
							{userInfo &&
							userInfo.isAdmin && (
								<NavDropdown title="Admin" id="admin-nav-dropdown">
									<LinkContainer to="/admin/dashboard">
										<NavDropdown.Item>Dashboard</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to="/admin/new-user">
										<NavDropdown.Item>Add User</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to="/manage/years/all">
										<NavDropdown.Item>Manage</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to="/admin/users/all">
										<NavDropdown.Item>Users</NavDropdown.Item>
									</LinkContainer>
								</NavDropdown>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
