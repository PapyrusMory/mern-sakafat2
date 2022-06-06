import React from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './component/Header';
import SigninScreen from './screen/signin/SigninScreen';
import HomeScreen from './screen/home/HomeScreen';
import AdminRoute from './component/AdminRoute';
import ProtectedRoute from './component/ProtectedRoute';
import AddUserScreen from './screen/user/AddUserScreen';
import UserListScreen from './screen/user/UserListScreen';
import UpdateUserScreen from './screen/user/UpdateUserScreen';
import AddYearScreen from './screen/year/AddYearScreen';
import YearListScreen from './screen/year/YearListScreen';
import YearScreen from './screen/year/YearScreen';
import UpdateYearScreen from './screen/year/UpdateYearScreen';
import ProfileScreen from './screen/user/ProfileScreen';
import AddClassScreen from './screen/class/AddClassScreen';
import ClasseListScreen from './screen/class/ClasseListScreen';
import ClasseListByYearScreen from './screen/class/ClasseListByYearScreen';
import ClasseScreen from './screen/class/ClasseScreen';
import AddStudentScreen from './screen/student/AddStudentScreen';
import StudentListScreen from './screen/student/StudentListScreen';
import StudentScreen from './screen/student/StudentScreen';

function App() {
	return (
		<BrowserRouter>
			<Header />
			<main>
				<Container className="mt-0" expand="lg">
					<Routes>
						<Route path="/" element={<HomeScreen />} />
						<Route path="/signin" element={<SigninScreen />} />
						<Route path="/profile" element={<ProfileScreen />} />
						<Route
							path="/admin/new-user"
							element={
								<AdminRoute>
									<AddUserScreen />
								</AdminRoute>
							}
						/>
						<Route
							path="/admin/users/all"
							element={
								<AdminRoute>
									<UserListScreen />
								</AdminRoute>
							}
						/>
						<Route
							path="/admin/users/:id"
							element={
								<AdminRoute>
									<UpdateUserScreen />
								</AdminRoute>
							}
						/>
						<Route
							path="/manage/new"
							element={
								<ProtectedRoute>
									<AddYearScreen />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/manage/classes/new"
							element={
								<ProtectedRoute>
									<AddClassScreen />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/manage/students/new"
							element={
								<ProtectedRoute>
									<AddStudentScreen />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/manage/years/all"
							element={
								<ProtectedRoute>
									<YearListScreen />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/manage/classes/all"
							element={
								<ProtectedRoute>
									<ClasseListScreen />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/manage/students/all"
							element={
								<ProtectedRoute>
									<StudentListScreen />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/manage/classes/:id/classes"
							element={
								<ProtectedRoute>
									<ClasseListByYearScreen />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/manage/year/:id"
							element={
								<ProtectedRoute>
									<YearScreen />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/manage/classe/:id"
							element={
								<ProtectedRoute>
									<ClasseScreen />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/manage/student/:id"
							element={
								<ProtectedRoute>
									<StudentScreen />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/manage/year/:id/update"
							element={
								<ProtectedRoute>
									<UpdateYearScreen />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</Container>
			</main>
		</BrowserRouter>
	);
}

export default App;
