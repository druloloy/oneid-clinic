/** @format */

import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const useRedirect = () => {
	const { state } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!state.authenticated && window.location.pathname !== '/') {
			return navigate('/');
		}
		if (state.authenticated && window.location.pathname === '/') {
			return (window.location.href = '/dashboard');
		}
	}, [state.authenticaed, navigate, state]);
};

export default useRedirect;
