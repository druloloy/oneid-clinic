/** @format */

import React, { useContext, useEffect, useState } from 'react';
// import './staff.scss';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/staffsidebar/Sidebar';
import { QueueContext } from '../../context/QueueContext';
import QueueService from '../../services/QueueService';
import UserService from '../../services/UserService';
import moment from 'moment/moment';
import { useMemo } from 'react';
import { MdOutlineClear, MdOutlineSearch } from 'react-icons/md';
import BlankCanvas from '../../components/BlankCanvas';

import useRedirect from '../../effects/useRedirect';

const StaffUI = () => {
	const { queue, _, socket } = useContext(QueueContext);
	const [patient, setPatient] = useState({});
	const [purpose, setPurpose] = useState('Consultation');
	const [id, setId] = useState('');
	const [patientInfo, setPatientInfo] = useState(patientInfoTemplate);
	const [cardItems, setCardItems] = useState(cardItemsTemplate);
	useRedirect();

	const decryptId = async (id) => {
		const decryptedId = await UserService.decrypt(id);
		return decryptedId.content;
	};

	const getPatient = async (id) => {
		const decryptedId = await decryptId(id);
		const login = await UserService.getPatientLogin(decryptedId);
		const details = await UserService.getPatientDetails(decryptedId);
		const {
			firstName,
			middleName,
			lastName,
			suffix,
			address,
			birthdate,
			sex,
		} = details.content;
		const { mobileNumber } = login.content;

		const patient = {
			id: decryptedId,
			fullName: `${firstName} ${middleName} ${lastName} ${suffix}`,
			age: moment().diff(birthdate, 'years'),
			sex,
			address: `${address.houseNumber} ${address.street} ${address.barangay} ${address.city}`,
			contact: mobileNumber,
		};
		setPatient(patient);
	};

	useEffect(() => {
		if (patient.id) {
			setPatientInfo((p) =>
				p.map((item) => {
					return {
						...item,
						content: patient[item.key],
					};
				})
			);
		}
	}, [patient, setPatientInfo]);

	useMemo(() => {
		const ongoingNumber =
			queue.filter((q) => q.status === 'Ongoing')[0] || 'N/A';
		const queueSize = queue.length;
		setCardItems((c) => {
			c[0].content = queueSize;
			c[1].content =
				ongoingNumber !== 'N/A' ? ongoingNumber.queueNumber : 'N/A';
			c[2].content =
				queueSize > 0 ? queue[queue.length - 1].queueNumber + 1 : 1;
			return c;
		});
	}, [queue]);

	const handleSearch = (e) => {
		e.preventDefault();
		getPatient(id);
	};

	const addToQueue = () => {
		QueueService.add(socket, id, purpose).then(() => {
			clear();
			alert('Patient added to queue');
		});
	};

	const clear = () => {
		setId('');
		setPatient({});
	};

	return (
		<div className="w-full h-screen flex flex-col">
			<Navbar />
			<div className="w-full h-full flex flex-row overflow-hidden">
				<Sidebar />
				<div className="w-full h-full flex flex-row pt-20 p-4 gap-4">
					<div className="flex-[2] h-full bg-primary-50 flex flex-col justify">
						{/* header, consists queue total, ongoing queue number, queue number for new patient*/}
						<div className="w-full h-auto flex flex-row justify-evenly items-center gap-4">
							{cardItems.map((item, index) => (
								<CardView key={index} data={item} />
							))}
						</div>

						{/* patient search */}
						<div className="w-full h-auto flex flex-col justify-center items-center mt-4">
							<form
								className="w-full h-auto flex flex-row justify-start items-center gap-4"
								onSubmit={handleSearch}>
								<input
									type="text"
									value={id}
									placeholder="Search Patient"
									className="flex-1 h-12 rounded-xl border-2 border-primary-500 focus:outline-none focus:border-primary-500 px-4"
									onChange={(e) => setId(e.target.value)}
								/>
								<button
									className="w-36 h-12 flex flex-row justify-center items-center gap-2 rounded-xl drop-shadow-md bg-primary-500 font-bold text-primary-50"
									onClick={handleSearch}>
									<MdOutlineSearch className="text-2xl" />
									Search
								</button>
								<button
									className="w-36 h-12 flex flex-row justify-center items-center gap-2 rounded-xl drop-shadow-md bg-red-500 font-bold text-primary-50"
									onClick={clear}>
									<MdOutlineClear className="text-2xl" />
									Clear
								</button>
							</form>
						</div>
					</div>
					<div className="flex-1 h-full flex flex-col bg-white p-8 rounded-xl text-primary-900">
						{!patient.id ? (
							<div className="w-full h-full flex justify-center items-center">
								<BlankCanvas message="No records to show." />
							</div>
						) : (
							<>
								<div className="w-full">
									<h1 className="text-center text-2xl font-bold">
										Patient Information
									</h1>
									{patientInfo.map((item, index) => (
										<div
											key={index}
											className="w-full h-auto flex flex-row justify-between items-start gap-4 mt-4">
											<p className="font-bold">
												{item.title}
											</p>
											<p className="text-right">
												{item.content}
											</p>
										</div>
									))}
								</div>
								<div className="w-full mt-8">
									<h1 className="text-center text-2xl font-bold">
										Purpose
									</h1>
									<div className="w-full h-auto flex flex-row justify-between items-center gap-4 mt-4">
										<select
											className="w-full h-12 rounded-xl border-2 border-primary-500 focus:outline-none focus:border-primary-500 px-4"
											onChange={(e) =>
												setPurpose(e.target.value)
											}
											defaultValue={purpose}>
											<option
												className="item"
												value="Consultation">
												Consultation
											</option>
											<option
												className="item"
												value="COVID Vaccine">
												COVID Vaccine
											</option>
											<option
												className="item"
												value="Other Vaccine">
												Other Vaccine
											</option>
											<option
												className="item"
												value="Family Planning">
												Family Planning
											</option>
											<option
												className="item"
												value="NCD Checkup">
												NCD Checkup
											</option>
											<option
												className="item"
												value="Dental Checkup">
												Dental Checkup
											</option>
										</select>
									</div>
								</div>
								{/* buttons */}
								<div className="w-full h-auto flex flex-row justify-end items-center gap-4 mt-8">
									<button
										className="w-1/2 h-12 rounded-xl bg-primary-500 text-primary-50 font-bold"
										onClick={() => addToQueue()}>
										Add to Queue
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const CardView = ({ data }) => {
	return (
		<div className="flex-1 h-24 flex flex-col justify-center items-center bg-primary-500 text-primary-50 rounded-xl">
			<p>{data.description}</p>
			<h1 className="text-4xl">{data.content}</h1>
		</div>
	);
};

const cardItemsTemplate = [
	{
		description: 'Queue Total',
		content: 'N/A',
	},
	{
		description: 'Ongoing Queue Number',
		content: 'N/A',
	},
	{
		description: 'Empty Queue Number',
		content: 1,
	},
];

const patientInfoTemplate = [
	{
		key: 'fullName',
		title: 'Full Name',
		content: '',
	},
	{
		key: 'age',
		title: 'Age',
		content: '',
	},
	{
		key: 'sex',
		title: 'Sex',
		content: '',
	},
	{
		key: 'address',
		title: 'Address',
		content: '',
	},
	{
		key: 'contact',
		title: 'Contact Number',
		content: '',
	},
];
export default StaffUI;
