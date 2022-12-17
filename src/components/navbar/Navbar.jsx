/** @format */

import React, { useContext } from 'react';
import './navbar.scss';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import { AuthContext } from '../../context/AuthContext';
import UserService from '../../services/UserService';
const Navbar = () => {
	const { state, dispatch } = useContext(AuthContext);
	const logout = () => {
		UserService.logoutUser().then((data) => {
			dispatch({
				type: 'LOGGED_OFF',
			});
		});
	};
	return (
		<div className="navbar">
			<div className="left">
				<div className="logo">
					<img src="./images/compressed/oneid_128x128.png" alt="" />
				</div>
				<div className="logoName">
					<span>Central Bicutan</span>
					<span>OneID Health Card</span>zz
				</div>
			</div>

			<div className="right" onClick={logout}>
				<ExitToAppRoundedIcon className="icon" />
				<span>Sign Out</span>
			</div>
		</div>
	);
};

export default Navbar;
