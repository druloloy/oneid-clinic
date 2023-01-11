/** @format */

import React, { useEffect, useState } from 'react';
import './queue.scss';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/staffsidebar/Sidebar';
import { useContext } from 'react';
import { QueueContext } from '../../context/QueueContext';
import { useMemo } from 'react';
import EmptyQueue from '../../assets/misc/undraw_wait_in_line_o2aq.svg';
import moment from 'moment';
import { MdMale, MdFemale } from 'react-icons/md';
import useRedirect from '../../effects/useRedirect';

const Queue = () => {
	document.title = 'Patients Queue | OneID';
	const { queue } = useContext(QueueContext);
	const [ongoing, setOngoing] = useState(0);
	const [waiting, setWaiting] = useState([]);
	// useRedirect();

	useMemo(() => {
		if (queue.length > 0) {
			const ongoingPatients = queue.filter(
				(patient) => patient.status === 'Ongoing'
			);
			setOngoing(ongoingPatients);
		}
	}, [queue]);

	useMemo(() => {
		const waitingPatients = queue.filter(
			(patient) => patient.status === 'Waiting'
		);
		setWaiting(waitingPatients);
	}, [queue]);

	return (
		<div className="w-full h-screen">
			<Navbar />
			<div className="w-full h-full flex flex-row overflow-hidden">
				<Sidebar />
				<div className="w-full h-full flex flex-col justify-center items-center pt-20 p-4 gap-4 overflow-auto">
					{/* table for ongoing queue */}
					<Table title="Ongoing" titleBg="primary">
						{ongoing.length > 0 ? (
							<>
								<TableHeader />
								<TableBody>
									{ongoing.map((patient) => (
										<TableData
											key={patient.queueNumber}
											data={patient}
										/>
									))}
								</TableBody>
							</>
						) : (
							<EmptyData message="No Ongoing Patients" />
						)}
					</Table>
					{/* table for waiting queue */}
					<Table title="Waiting" titleBg="secondary">
						{waiting.length > 0 ? (
							<>
								<TableHeader />
								<TableBody>
									{waiting.map((patient) => (
										<TableData
											key={patient.queueNumber}
											data={patient}
										/>
									))}
								</TableBody>
							</>
						) : (
							<EmptyData message="No Waiting Patients" />
						)}
					</Table>
				</div>
			</div>
		</div>
	);
};
const Table = ({ children, title, titleBg }) => {
	const bg = {
		primary: '#ee4681',
		secondary: '#faa7c8',
		tertiary: '#fce7f0',
	};
	const color = {
		primary: '#fdf2f6',
		secondary: '#841733',
		tertiary: '#841733',
	};
	const bgStyle = {
		backgroundColor: bg[titleBg] || bg['primary'],
		color: color[titleBg] || color['primary'],
	};

	return (
		<div className="w-4/6 h-auto flex flex-col justify-start items-center border-2 rounded-lg border-primary-500 overflow-hidden">
			<div style={bgStyle} className="w-full  text-center p-2">
				<h1 className="text-2xl font-bold">{title}</h1>
			</div>
			<div className="flex-1 w-full h-auto flex flex-col p-2 justify-start items-center">
				{children}
			</div>
		</div>
	);
};
const TableHeader = () => (
	<div className="w-full flex flex-row justify-around items-center text-center">
		<div className="flex-1">
			<h1 className="text-base font-bold">Queue Number</h1>
		</div>
		<div className="flex-1">
			<h1 className="text-base font-bold">Purpose</h1>
		</div>
		<div className="flex-1">
			<h1 className="text-base font-bold">Patient Name</h1>
		</div>
		<div className="flex-1">
			<h1 className="text-base font-bold">Age</h1>
		</div>
		<div className="flex-1">
			<h1 className="text-base font-bold">Gender</h1>
		</div>
		<div className="flex-1">
			<h1 className="text-base font-bold">Time Arrived</h1>
		</div>
		<div className="flex-1">
			<h1 className="text-base font-bold">Time Serviced</h1>
		</div>
	</div>
);

const TableBody = ({ children }) => (
	<div className="w-full max-h-60 flex flex-col justify-center items-center overflow-auto">
		{children}
	</div>
);

const TableData = ({ data }) => {
	const fullName =
		`${data.patient.firstName} ${data.patient.lastName} ${data.patient.suffix}`.trim();

	return (
		<div className="w-full flex flex-row justify-around items-center text-center my-2">
			<div className="flex-1 text-center">
				<h1 className="text-2xl font-bold">{data.queueNumber}</h1>
			</div>
			<div className="flex-1">
				<h1 className="text-base">{data.purpose}</h1>
			</div>
			<div className="flex-1">
				<h1 className="text-base">{fullName}</h1>
			</div>
			<div className="flex-1">
				<h1 className="text-base">
					{moment().diff(data.patient.birthdate, 'years')}
				</h1>
			</div>
			<div className="flex-1">
				<h1 className="text-base">
					<GenderIcon sex={data.patient.sex} />
				</h1>
			</div>
			<div className="flex-1">
				<h1 className="text-base">
					{moment(data.timeStarted).format('LT')}
				</h1>
			</div>
			<div className="flex-1">
				<h1 className="text-base">
					{data.timeServiced
						? moment(data.timeServiced).format('LT')
						: '---'}
				</h1>
			</div>
		</div>
	);
};

const GenderIcon = ({ sex }) => {
	const icon = {
		male: <MdMale className="text-2xl text-primary-800 mx-auto" />,
		female: <MdFemale className="text-2xl text-primary-400 mx-auto" />,
	};
	return icon[sex];
};

const EmptyData = ({ message }) => {
	return (
		<div className="w-full flex flex-col justify-center items-center gap-2">
			<img src={EmptyQueue} alt="empty queue" className="w-1/6" />
			<h1 className="text-base font-bold">{message}</h1>
		</div>
	);
};

export default Queue;
