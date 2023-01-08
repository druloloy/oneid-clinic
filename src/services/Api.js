/** @format */

import axios from 'axios';
const apiVersion = 'api/v1/';
export const baseURL =
	process.env.NODE_ENV === 'development'
		? process.env.REACT_APP_DEV_URL + apiVersion
		: process.env.REACT_APP_PROD_URL + apiVersion;
const defaultPath = 'staff/';

// const whitelistPaths = [
//     '/',
// ];

const instance = axios.create({
	baseURL: baseURL + defaultPath,
	headers: {
		'Content-Type': 'application/json',
		'Cache-Control': 'no-cache',
		'Access-Control-Allow-*': '*',
	},
	withCredentials: true,
	validateStatus: function (status) {
		return status >= 200 && status < 400; // default
	},
});

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (
			error.response.status === 403 &&
			!error.response.data.authenticated
		) {
			localStorage.setItem('auth', false);
		}
		return Promise.reject(error);
	}
);

export default instance;
