/** @format */

import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import './patient.scss';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/staffsidebar/Sidebar';
import ConditionView from './ConditionView';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NextSVG from '../../assets/misc/undraw_moving_forward_re_rs8p.svg';
import {
	MdChevronRight,
	MdCancel,
	MdAddCircle,
	MdCheck,
	MdMedication,
	MdPerson,
	MdMale,
	MdFemale,
	MdLocationOn,
	MdBloodtype,
	MdMasks,
	MdHelpOutline,
	MdOutlineDoneAll,
} from 'react-icons/md';
import { FiTarget } from 'react-icons/fi';
import { GiBodyHeight, GiWeight, GiPeanut } from 'react-icons/gi';

import AddPrescriptionView from './AddPrescriptionView';
import QueueService from '../../services/QueueService';
import { QueueContext } from '../../context/QueueContext';
import moment from 'moment';
import UserService from '../../services/UserService';
import BlankCanvas from '../../components/BlankCanvas';
import useRedirect from '../../effects/useRedirect';

const patientModel = {
	id: '',
	fullName: '',
	age: '',
	address: '',
	sex: '',
	purpose: '',
};

const PatientInfoView = () => {
	document.title = 'Consultation';
	const [toggleConditionView, setToggleConditionView] = useState(false);
	const [selectedViewCondition, setSelectedViewCondition] = useState({});
	const [selectedPrescription, setSelectedPrescription] = useState(0);
	const [prescriptionModal, setPrescriptionModal] = useState(false);
	const [consultation, setConsultation] = useState({
		condition: '',
		treatments: [],
		prescriptions: [],
		nextConsultation: '',
		remarks: '',
	});

	const [prescriptions, setPrescriptions] = useState([]);
	const [nextPatient, setNextPatient] = useState(patientModel);
	const [patient, setPatient] = useState(patientModel);
	// useRedirect();

	const navigate = useNavigate();
	const { state } = useContext(AuthContext);
	const role = state.role;

	useEffect(() => {
		if (role !== 'phys') navigate(-1);
	}, [role, navigate]);

	const { queue, setQueue, socket } = useContext(QueueContext);

	const openPrescriptionModal = () => {
		setPrescriptionModal(true);
	};

	const closePrescriptionModal = () => {
		setPrescriptionModal(false);
	};

	const getPatientConsultations = useCallback(async (id) => {
		const consultations = await UserService.getPatientConsultations(id);
		return consultations.content;
	}, []);

	useMemo(() => {
		const id = getLocalPatient();
		if (id && patient.id === '') {
			const result = queue.find((patient) => patient._id === id);
			if (result) {
				const p = {
					id: result._id,
					fullName: `${result.patient.firstName} ${result.patient.middleName} ${result.patient.lastName} ${result.patient.suffix}`,
					age: moment().diff(result.patient.birthdate, 'years'),
					address: `${result.patient.address.houseNumber} ${result.patient.address.street} ${result.patient.address.barangay} ${result.patient.address.city}`,
					sex: result.patient.sex,
					purpose: result.purpose,
				};
				getPatientConsultations(p.id).then((consultations) => {
					p.consultations = consultations;
					console.log('Found local patient', p);
					setPatient(p);
				});
			}
		}
	}, [queue, setPatient, patient.id, getPatientConsultations]);

	useMemo(() => {
		const waitingPatients = queue.filter(
			(patient) => patient.status === 'Waiting'
		);
		if (waitingPatients.length === 0) return setNextPatient(patientModel);

		const nextPatient = waitingPatients[0];

		const p = {
			id: nextPatient._id,
			fullName: `${nextPatient.patient.firstName} ${nextPatient.patient.middleName} ${nextPatient.patient.lastName} ${nextPatient.patient.suffix}`,
			age: moment().diff(nextPatient.patient.birthdate, 'years'),
			address: `${nextPatient.patient.address.houseNumber} ${nextPatient.patient.address.street} ${nextPatient.patient.address.barangay} ${nextPatient.patient.address.city}`,
			sex: nextPatient.patient.sex,
			purpose: nextPatient.purpose,
		};
		getPatientConsultations(nextPatient._id).then((consultations) => {
			p.consultations = consultations;
			setNextPatient(p);
		});
	}, [queue, setNextPatient, getPatientConsultations]);

	const getNextPatient = async () => {
		removeLocalPatient();
		if (nextPatient.id === '') {
			alert('No more patients in queue');
			// If there is no next patient, finish the current patient and log the result
			if (patient.id) {
				QueueService.finish(socket, patient.id);
			}
			setPatient(patientModel);
			console.log('No more patients in queue', nextPatient, patient);
			return;
		}

		// If there is a current patient, finish it before moving on to the next one
		if (patient.id !== '') {
			QueueService.finish(socket, patient.id);
		}

		// Move to the next patient and get their consultations
		QueueService.moveNext(socket, nextPatient.id, 'Ongoing');
		const newPatient = {
			...nextPatient,
			consultations: await getPatientConsultations(nextPatient.id),
		};
		saveLocalPatient(newPatient.id);
		setPatient(newPatient);
	};

	const removeCurrentPatient = () => {
		QueueService.remove(socket, patient.id);
		setPatient(patientModel);
		removeLocalPatient();
	};

	const finishCurrentPatient = () => {
		const finish = () => {
			QueueService.finish(socket, patient.id);
			setPatient(patientModel);
			removeLocalPatient();
		};

		// if fields are blank, confirm finish
		if (
			consultation.condition === '' &&
			consultation.treatments.length === 0 &&
			consultation.prescriptions.length === 0 &&
			consultation.nextConsultation === '' &&
			consultation.remarks === ''
		) {
			finish();
		} else {
			// if fields are filled, confirm finish
			if (
				window.confirm('Are you sure you want to finish this patient?')
			) {
				finish();
			}
		}
	};

	const selectCondition = (id) => {
		const condition = patient.consultations.find((c) => c._id === id);
		setSelectedViewCondition(condition);
		setToggleConditionView(true);
	};

	const removePrescription = (id) => {
		const newPrescriptions = consultation.prescriptions.filter(
			(p, i) => i !== id
		);
		setConsultation({
			...consultation,
			prescriptions: newPrescriptions,
		});
	};

	const clearConsultation = () => {
		setConsultation({
			condition: '',
			treatments: [],
			prescriptions: [],
			nextConsultation: '',
			remarks: '',
		});
	};

	const consultPatient = () => {
		if (consultation.prescriptions.length === 0)
			return alert('Please add at least one prescription');

		UserService.consultPatient(patient.id, consultation).then((res) => {
			alert('Consultation saved!');
		});
	};
	return (
		<div className="w-full h-screen">
			<Navbar />
			<div className="w-full h-full flex flex-row overflow-hidden">
				<Sidebar />
				<div className="relative w-full h-full flex flex-row pt-20 p-4 gap-4">
					<div className="basis-2/5 flex flex-col gap-4">
						<div className="w-full flex flex-row gap-4 justify-evenly items-center">
							{
								// If there is no patient, show the next patient
								patient.id !== '' && (
									<button
										className="flex-1 flex flex-row justify-center items-center py-2 rounded-lg text-sm text-primary-50 font-bold bg-red-500 gap-2 transition-all ease-in-out duration-300 hover:bg-red-600"
										onClick={() => removeCurrentPatient()}>
										<MdCancel className="text-xl font-bold" />
										Cancel
									</button>
								)
							}
							<button
								className="flex-1 flex flex-row justify-center items-center py-2 rounded-lg text-sm text-primary-50 font-bold bg-primary-500 gap-2 transition-all ease-in-out duration-300 hover:bg-primary-600"
								onClick={() => getNextPatient()}>
								Next{' '}
								<MdChevronRight className="text-xl font-bold" />
							</button>
							{patient.id !== '' && (
								<button
									className="flex-[2] flex flex-row justify-center items-center py-2 rounded-lg text-sm text-primary-500 border-2 border-primary-500 font-bold gap-2 transition-all ease-in-out duration-300 hover:bg-primary-500 hover:text-primary-50"
									onClick={() => finishCurrentPatient()}>
									Finish{' '}
									<MdOutlineDoneAll className="text-xl font-bold" />
								</button>
							)}
						</div>

						{patient.id !== '' && (
							<div className="w-full max-h-128 flex flex-col justify-start items-center bg-white p-4 rounded-lg overflow-y-auto">
								<div className="w-full p-2 flex flex-row justify-between items-center gap-2 mb-4 flex-wrap">
									<h1 className="font-bold text-xl flex flex-row items-center">
										<MdMedication className="text-2xl" />
										Consult this Patient
									</h1>
									<div className="flex flex-row items-center gap-2">
										{
											// show button if fields are not empty
											consultation.condition !== '' ||
											consultation.treatments.length !==
												0 ||
											consultation.prescriptions
												.length !== 0 ||
											consultation.nextConsultation !==
												'' ||
											consultation.remarks !== '' ? (
												<button
													onClick={() =>
														clearConsultation()
													}
													className="flex flex-row justify-center items-center px-2 py-1 rounded-lg text-primary-50 font-bold bg-red-500 gap-2 transition-all ease-in-out duration-300 hover:bg-red-600">
													<MdCancel className="text-2xl font-bold" />
													Clear
												</button>
											) : null
										}
										<button
											className="flex flex-row justify-center items-center px-2 py-1 rounded-lg text-primary-500 font-bold border-2 border-primary-500 gap-2 transition-all ease-in-out duration-300 hover:bg-primary-600 hover:text-primary-50 hover:border-primary-600"
											onClick={consultPatient}>
											<MdCheck className="text-2xl font-bold" />
											Save
										</button>
									</div>
								</div>

								<div className="w-full flex flex-row justify-between items-start gap-4 p-2 flex-wrap">
									<h3 className="w-1/4 font-bold text-xl">
										Condition
									</h3>
									<div className="flex-1 flex flex-col">
										<input
											type="text"
											value={consultation.condition}
											className="flex-1 p-2 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:outline-none"
											placeholder="Required"
											onChange={(e) =>
												setConsultation({
													...consultation,
													condition: e.target.value,
												})
											}
											required
										/>
										<p className="text-primary-300"></p>
									</div>
								</div>

								<div className="w-full flex flex-row justify-between items-start gap-4 p-2 flex-wrap">
									<h3 className="w-1/4 font-bold text-xl">
										Treatments
									</h3>
									<div className="flex-1 flex flex-col">
										<input
											type="text"
											value={consultation.treatments}
											className="flex-1 p-2 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:outline-none"
											placeholder="Optional"
											onChange={(e) =>
												setConsultation({
													...consultation,
													treatments:
														e.target.value.split(
															','
														),
												})
											}
										/>
										<p className="text-primary-300">
											Separate treatments with a comma.
										</p>
									</div>
								</div>

								<div className="w-full flex flex-row justify-evenly items-start gap-4 p-2 flex-wrap">
									<h3 className="basis-1/4 font-bold text-xl">
										Prescriptions
									</h3>
									<div className="flex-1 flex flex-col">
										<div className="flex flex-row flex-wrap justify-start items-center gap-2">
											{consultation?.prescriptions.map(
												(p, i) => (
													<div
														key={i}
														className="flex flex-row justify-start items-center rounded-full text-primary-50 bg-primary-500">
														<p
															className="font-bold bg-primary-900 px-2 rounded-full cursor-pointer"
															onClick={() => {
																setSelectedPrescription(
																	i
																);
																openPrescriptionModal();
															}}>
															{p.name}
														</p>
														<MdCancel
															className="text-xl cursor-pointer"
															onClick={() =>
																removePrescription(
																	i
																)
															}
														/>
													</div>
												)
											)}
											<MdAddCircle
												className="text-2xl cursor-pointer"
												onClick={() => {
													setSelectedPrescription(-1);
													openPrescriptionModal();
												}}
											/>
										</div>

										<p className="text-primary-300 list-disc">
											Click on the + button to add a
											prescription.
										</p>
										<p className="text-primary-300 list-disc">
											Click on each pills to display more
											details.
										</p>
									</div>
								</div>

								<div className="w-full flex flex-row justify-between items-start gap-4 p-2 flex-wrap">
									<h3 className="w-1/4 font-bold text-xl">
										Next Consultation
									</h3>
									<div className="flex-1 flex flex-col">
										<input
											type="date"
											min={moment
												.utc()
												.local()
												.format('YYYY-MM-DD')}
											value={
												consultation.nextConsultation
											}
											onChange={(e) =>
												setConsultation({
													...consultation,
													nextConsultation:
														e.target.value,
												})
											}
											required
											className="flex-1 p-2 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:outline-none"
										/>
										<p className="text-primary-300">
											Leave blank if no next consultation.
										</p>
									</div>
								</div>
								<div className="w-full flex flex-row justify-between items-start gap-4 p-2 flex-wrap">
									<h3 className="w-1/4 font-bold text-xl">
										Remarks
									</h3>
									<div className="flex-1 flex flex-col">
										<textarea
											rows="5"
											placeholder="Optional"
											value={consultation.remarks}
											onChange={(e) =>
												setConsultation({
													...consultation,
													remarks: e.target.value,
												})
											}
											className="flex-1 p-2 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:outline-none"
										/>
										<p className="text-primary-300"></p>
									</div>
								</div>
							</div>
						)}
					</div>

					{patient.id && (
						<div className="basis-3/5 flex flex-col justify-start items-center gap-4 overflow-hidden">
							<PatientDetailsCard data={patient} />
							<PatientConsultations
								data={patient?.consultations}
								selectCondition={selectCondition}
							/>
						</div>
					)}

					{!patient.id && (
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 flex flex-col justify-center items-center">
							<img
								src={NextSVG}
								alt="Next Please"
								className="w-36 h-36"
							/>
							<p className="text-2xl font-bold">
								Click the "Next" Button to get started
							</p>
						</div>
					)}
				</div>
			</div>
			<ConditionView
				toggleConditionView={toggleConditionView}
				setToggleConditionView={setToggleConditionView}
				data={selectedViewCondition}
			/>
			<AddPrescriptionView
				data={
					consultation?.prescriptions.length > 0
						? consultation.prescriptions[selectedPrescription]
						: null
				}
				modal={prescriptionModal}
				closeModal={closePrescriptionModal}
				set={setConsultation}
			/>
		</div>
	);
};

const PatientDetailsCard = ({ data }) => {
	return (
		<div className="w-full flex flex-col justify-center items-center p-2 bg-primary-500 rounded-lg">
			{/* Name */}
			{Object.getOwnPropertyNames(data).length > 0 ? (
				<PatientDetailsContent data={data} />
			) : (
				<div className="w-1/3 h-full text-primary-50">
					<BlankCanvas message="No Patient Details" />
				</div>
			)}
		</div>
	);
};

const PatientDetailsContent = ({ data }) => {
	const gender = {
		male: <MdMale className="text-3xl" />,
		female: <MdFemale className="text-3xl" />,
	};
	return (
		<>
			<div className="w-full flex flex-row justify-between items-center gap-4 p-2 text-primary-50">
				<div className="flex-[2] flex flex-row justify-start items-center gap-2">
					<MdPerson className="text-4xl" />
					<h1 className="w-full font-bold text-2xl">
						{data?.fullName ? data.fullName : '?'}
					</h1>
				</div>
				<div className="flex-1 flex flex-row justify-end items-center gap-2 text-primary-50">
					<h2 className="text-2xl font-bold">
						{data?.age ? data.age : '?'}
					</h2>
					{data?.sex ? (
						gender[data.sex]
					) : (
						<MdHelpOutline className="text-3xl" />
					)}
				</div>
			</div>
			<div className="w-full flex flex-row justify-start items-center gap-4 p-2 flex-wrap text-primary-50">
				<div className="flex-shrink flex-grow basis-1/4 h-16 flex flex-row justify-start items-center gap-2 p-2 bg-primary-400 rounded-sm">
					<FiTarget className="text-4xl" />

					<div className="flex flex-col justify-start items-start">
						<p className="text-xs">Purpose</p>
						<h2 className="text-base font-bold">
							{data?.purpose ? data.purpose : '?'}
						</h2>
					</div>
				</div>
				<div className="flex-shrink flex-grow basis-1/4 h-16 flex flex-row justify-start items-center gap-2 p-2 bg-primary-400 rounded-sm">
					<GiBodyHeight className="text-4xl" />

					<div className="flex flex-col justify-start items-start">
						<p className="text-xs">Height</p>
						<h2 className="text-base font-bold">
							{data?.height ? data.height : '?'}
						</h2>
					</div>
				</div>
				<div className="flex-shrink flex-grow basis-1/4 h-16 flex flex-row justify-start items-center gap-2 p-2 bg-primary-400 rounded-sm">
					<GiWeight className="text-4xl" />

					<div className="flex flex-col justify-start items-start">
						<p className="text-xs">Weight</p>
						<h2 className="text-base font-bold">
							{data?.weight ? data.weight : '?'}
						</h2>
					</div>
				</div>
				<div className="flex-shrink flex-grow basis-1/4 h-16 flex flex-row justify-start items-center gap-2 p-2 bg-primary-400 rounded-sm">
					<MdBloodtype className="text-4xl" />

					<div className="flex flex-col justify-start items-start">
						<p className="text-xs">Blood Group</p>
						<h2 className="text-base font-bold">
							{data?.bloodGroup ? data.bloodGroup : '?'}
						</h2>
					</div>
				</div>
				<div className="flex-shrink flex-grow basis-1/4 h-16 flex flex-row justify-start items-center gap-2 p-2 bg-primary-400 rounded-sm">
					<h2 className="text-xl font-bold">mmHg</h2>

					<div className="flex flex-col justify-start items-start">
						<p className="text-xs">Blood Pressure</p>
						<h2 className="text-base font-bold">
							{data?.bloodPressure ? data.bloodPressure : '?'}
						</h2>
					</div>
				</div>
				<div className="w-full h-16 flex flex-row justify-start items-center gap-2 p-2 bg-primary-400 rounded-sm">
					<MdLocationOn className="text-4xl" />

					<div className="flex flex-col justify-start items-start">
						<p className="text-xs">Address</p>
						<h2 className="text-base font-bold">
							{data?.address ? data.address : '?'}
						</h2>
					</div>
				</div>
				<div className="w-full h-16 flex flex-row justify-start items-center gap-2 p-2 bg-primary-400 rounded-sm">
					<GiPeanut className="text-4xl" />
					<div className="flex flex-col justify-start items-start">
						<p className="text-xs">Allergies</p>
						<h2 className="text-base font-bold">
							{data?.allergies ? data.allergies : '?'}
						</h2>
					</div>
				</div>
			</div>
		</>
	);
};

const PatientConsultations = ({ data, selectCondition }) => {
	return (
		<div className="w-full max-h-40 flex flex-col bg-primary-500 rounded-xl overflow-hidden overflow-x-auto p-4 gap-1">
			<h1 className="text-md font-bold text-primary-50">
				Previous Consultations
			</h1>
			<div className="flex flex-row justify-start items-center gap-2">
				{data?.length > 0 ? (
					data.map((item, index) => (
						<div
							key={index}
							className="flex-shrink-0 flex-grow-0 w-36 h-24 flex flex-col justify-between items-center p-2 text-primary-50 bg-primary-400 rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:bg-primary-300"
							onClick={() => selectCondition(item._id)}>
							<MdMasks className="text-4xl" />
							<h1 className="text-2xl font-bold">
								{item.condition}
							</h1>
							<p className="text-xs text-center">
								{moment(item.createdAt).format('MMM DD, YYYY')}
							</p>
						</div>
					))
				) : (
					<div className="w-1/3 h-full flex flex-col justify-center items-center mx-auto text-primary-50">
						<BlankCanvas message="No Previous Consultations" />
					</div>
				)}
			</div>
		</div>
	);
};

const saveLocalPatient = (id) => {
	localStorage.setItem('curr_patient_id', id);
};

const getLocalPatient = () => {
	const patient = localStorage.getItem('curr_patient_id');
	return patient;
};

const removeLocalPatient = () => {
	localStorage.removeItem('curr_patient_id');
};

export default PatientInfoView;
