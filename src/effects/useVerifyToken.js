/** @format */

import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserService from '../services/UserService';
const useVerifyToken = () => {
	const { _state, dispatch } = useContext(AuthContext);
	useEffect(() => {
		UserService.me()
			.then((response) => {
				dispatch({
					type: 'AUTHENTICATED',
					payload: {
						role: response.content.role,
						username: response.content.username,
					},
				});
			})
			.catch((error) => {
				dispatch({ type: 'LOGGED_OFF' });
				if (window.location.pathname !== '/') {
					window.location.href = '/';
				}
			});
	}, [dispatch]);
};

export default useVerifyToken;
