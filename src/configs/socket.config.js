/** @format */

const config = {
	baseUrl:
		process.env.NODE_ENV === 'development'
			? process.env.REACT_APP_DEV_URL + 'live_staff'
			: process.env.REACT_APP_PROD_URL + 'live_staff',
	options: {
		transports: ['websocket'],
		reconnectionAttempts: 3,
		withCredentials: true,
	},
};

export default config;
