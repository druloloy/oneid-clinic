/** @format */

import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
function PublicRoute() {
	const { state } = useContext(AuthContext);
	return !JSON.parse(state.authenticated) ? (
		<Outlet />
	) : (
		<Navigate to="/dashboard" />
	);
}

export default PublicRoute;
