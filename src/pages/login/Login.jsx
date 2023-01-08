/** @format */
import React, { useState, useContext } from 'react';
import UserService from '../../services/UserService';
import { AuthContext } from '../../context/AuthContext';
import Logo from '../../assets/logo/compressed/oneid_256x256.png';
import SVG from '../../assets/misc/undraw_working_re_ddwy.svg';
import { useNavigate } from 'react-router-dom';
const Login = () => {
	document.title = 'Login';

	const navigate = useNavigate();
	const { dispatch } = useContext(AuthContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [time, setTime] = useState(new Date().toLocaleTimeString());
	const [activities, setActivities] = useState([]);

	const login = async (e) => {
		e.preventDefault();
		await UserService.loginUser(username, password).then((data) => {
			dispatch({
				type: 'AUTHENTICATED',
				payload: {
					role: data.content.role,
					username: data.content.username,
				},
			});
			navigate('/dashboard');
		});
	};

	const getDayToday = () => {
		const date = new Date();
		const day = date.getDay();
		const dayList = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		];
		return dayList[day];
	};

	React.useEffect(() => {
		const getActivities = async () => {
			UserService.getSchedules().then((data) => {
				const a = data.content.filter((item) => {
					return item.day === getDayToday().toLowerCase();
				})[0];
				setActivities(a.activities);
			});
		};

		getActivities();
	}, []);

	React.useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date().toLocaleTimeString());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="w-full h-screen bg-primary-400 flex justify-start items-center px-16 py-4">
			<div className="relative flex-grow-0 flex-shrink-0 basis-1/3 h-4/5 bg-primary-50 rounded-lg shadow-lg flex flex-col justify-center items-center gap-4 overflow-hidden">
				<div className="rounded-b-full bg-primary-300 absolute top-0 h-1/3"></div>
				<div className="w-full flex flex-col justify-center items-center p-4">
					<img
						src={Logo}
						alt="oneid"
						loading="lazy"
						className="w-28 h-28"
					/>
				</div>

				<div className="flex flex-col text-center px-4">
					<h1 className="text-3xl font-bold text-primary-500">
						OneID Health Card System
					</h1>
					<h2 className="text-xl font-bold text-primary-500">
						Login Account
					</h2>
				</div>

				<form
					onSubmit={login}
					className="w-full flex flex-col justify-evenly items-center px-4 gap-2">
					<input
						type="text"
						placeholder="Username"
						className="w-3/4 h-12 rounded-lg shadow-md px-4 placeholder-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Password"
						className="w-3/4 h-12 rounded-lg shadow-md px-4 placeholder-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button
						type="submit"
						className="w-3/4 h-12 rounded-lg shadow-lg bg-primary-500 text-primary-50 font-bold">
						Login
					</button>
				</form>
			</div>

			<div className="flex-[2] w-full h-full flex flex-col justify-center items-center">
				<div className="w-full h-1/4 flex flex-col justify-center items-center">
					<h1 className="text-4xl font-bold text-primary-50">
						{time}
					</h1>
					<h2 className="text-2xl font-bold text-primary-50">
						{new Date().toLocaleDateString('en-PH', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</h2>
				</div>
				<div className="w-1/2 flex flex-col justify-center items-center p-4 bg-primary-600 rounded-lg shadow-lg text-primary-50 gap-2">
					<img
						className="w-36"
						src={SVG}
						alt="svg_display"
						loading="lazy"
					/>
					<h3 className="text-xl font-bold">
						{activities.length > 0
							? 'Services Today'
							: 'No Services Today'}
					</h3>
					<div className="w-full flex flex-row justify-start items-center gap-2 flex-wrap">
						{activities.length > 0 &&
							activities.map((item, index) => (
								<span className="bg-primary-400 text-primary-900 rounded-lg px-2 py-1 font-semibold">
									{item}
								</span>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};
export default Login;
