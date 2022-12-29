/** @format */

const states = {
	AUTHENTICATED: {
		authenticated: true,
		role: '',
		username: '',
	},
	LOGGED_OFF: {
		authenticated: false,
		role: '',
		username: '',
	},
};

const AuthReducer = (state, action) => {
	switch (action.type) {
		case 'AUTHENTICATED':
			localStorage.setItem('role', action.payload.role);
			localStorage.setItem('username', action.payload.username);
			localStorage.setItem('auth', true);

			states.AUTHENTICATED.role = action.payload.role;
			states.AUTHENTICATED.username = action.payload.username;
			return states.AUTHENTICATED;
		case 'LOGGED_OFF':
			localStorage.removeItem('role');
			localStorage.removeItem('username');
			localStorage.setItem('auth', false);

			states.LOGGED_OFF.role = '';
			states.LOGGED_OFF.username = '';
			return states.LOGGED_OFF;
		default:
			return state;
	}
};

export default AuthReducer;
