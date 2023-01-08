/** @format */

import React, { useContext } from 'react';
import './navbar.scss';
import { MdOutlineLogout } from 'react-icons/md';
import { AuthContext } from '../../context/AuthContext';
import UserService from '../../services/UserService';
import Logo from '../../assets/logo/compressed/oneid_256x256.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
	const { state, dispatch } = useContext(AuthContext);
	const navigate = useNavigate();

	const toHome = () => {
		navigate('/dashboard');
	};

	const logout = () => {
		UserService.logoutUser().then((data) => {
			dispatch({
				type: 'LOGGED_OFF',
			});
			navigate('/');
		});
	};

	return (
		<div className="w-full h-16 fixed top-0 flex flex-row justify-center items-center bg-opacity-50 bg-blur bg-primary-500 z-50">
			<div
				className="flex-1 flex flex-row justify-start items-center gap-2 p-8"
				onClick={toHome}>
				<img className="w-12" src={Logo} alt="logo" />
				<h1 className="text-2xl text-white font-bold cursor-pointer">
					OneID Health System
				</h1>
			</div>
			<div
				className="flex flex-row justify-center items-center font-bold cursor-pointer transition-all ease-in-out duration-300 text-white p-8 hover:text-primary-500"
				onClick={logout}>
				<MdOutlineLogout className="text-3xl" />
				<h1 className="text-xl">Log out</h1>
			</div>
		</div>
	);
};

export default Navbar;
