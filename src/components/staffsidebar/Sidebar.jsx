/** @format */

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUserMd, FaUserNurse } from 'react-icons/fa';
import {
	MdGroups,
	MdDashboard,
	MdMedicalServices,
	MdLock,
} from 'react-icons/md';
import './sidebar.scss';
const Sidebar = () => {
	const { state } = useContext(AuthContext);
	const role = state.role;
	const username = state.username;
	return (
		<div className="flex-shrink-0 basis-36 h-full bg-primary-500 flex flex-col justify-center items-center z-40 overflow-hidden">
			{/* staff name and role */}
			<div className="flex flex-col justify-center items-center gap-2">
				<div className="flex flex-col justify-center items-center gap-2">
					{role === 'phys' ? (
						<FaUserMd className="text-4xl text-white" />
					) : (
						<FaUserNurse className="text-4xl text-white" />
					)}
					<h2 className="bg-primary-50 text-primary-500 text-sm font-bold px-2 rounded-full">
						{role.toLowerCase()}
					</h2>
				</div>

				<h1 className="text-white text-md font-bold">{username}</h1>
			</div>

			{/* sidebar items */}
			<div className="flex flex-col justify-center items-start w-full mt-8 text-white ">
				{items.map((item, index) => (
					<div
						style={{
							pointerEvents:
								role === 'staff' && item.link === '/consult'
									? 'none'
									: 'all',
						}}
						key={index}
						className="w-full flex flex-col justify-center items-start transition-all ease-in-out duration-300 hover:bg-primary-600">
						<Link
							to={item.link}
							className="flex-1 flex flex-row justify-start items-center gap-4 p-4">
							{item.icon}
							<h1 className="text-sm font-bold flex flex-row items-center">
								{item.name}{' '}
								{
									// if role is staff, show lock icon
									role === 'staff' &&
									item.link === '/consult' ? (
										<MdLock className="text-xs ml-2" />
									) : null
								}
							</h1>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

const items = [
	{
		name: 'Dashboard',
		icon: <MdDashboard className="flex-[2] text-xl" />,
		link: '/dashboard',
		active: true,
	},
	{
		name: 'Consult',
		icon: <MdMedicalServices className="flex-[2] text-xl" />,
		link: '/consult',
		active: true,
	},
	{
		name: 'Queue',
		icon: <MdGroups className="flex-[2] text-xl" />,
		link: '/queue',
		active: true,
	},
];

export default Sidebar;
