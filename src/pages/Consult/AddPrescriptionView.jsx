/** @format */

import moment from 'moment';
import { useEffect, useState } from 'react';
import { MdAddCircle, MdClose } from 'react-icons/md';

const isObjectEmpty = (obj) => {
	if (!obj) return true;
	return Object.keys(obj).length === 0;
};

const AddPrescriptionView = ({ data, set, modal, closeModal }) => {
	const [name, setName] = useState('');
	const [dosage, setDosage] = useState('0mg');
	const [frequency, setFrequency] = useState('0');
	const [duration, setDuration] = useState('0');
	const [notes, setNotes] = useState('');

	useEffect(() => {
		if (!isObjectEmpty(data)) {
			setName(data.name);
			setDosage(data.dosage);
			setFrequency(data.frequency);
			setDuration(data.duration);
			setNotes(data.notes);
		}
	}, [data]);

	console.log(data, isObjectEmpty(data));

	const handleDosageChange = (e) => {
		const suffix = 'mg';
		let value = e.target.value.replace(suffix, '').replace(/\s/, '');

		/// check if value is a number
		if (isNaN(value)) {
			return;
		}
		setDosage(value + suffix);
	};
	const clear = () => {
		setName('');
		setDosage('0mg');
		setFrequency('0');
		setDuration('0');
		setNotes('');
	};
	const addPrescription = (e) => {
		e.preventDefault();
		const id = (data && data.id) || moment().unix();
		const consultation = {
			id,
			name,
			dosage,
			frequency,
			duration,
			notes,
		};
		if (data && data.id) {
			set((prev) => {
				const index = prev.prescriptions.findIndex(
					(item) => item.id === data.id
				);
				prev.prescriptions[index] = consultation;
				return prev;
			});
		} else {
			set((prev) => {
				return {
					...prev,
					prescriptions: [...prev.prescriptions, consultation],
				};
			});
		}

		clear();
		closeModal();
	};

	return (
		modal && (
			<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex flex-row justify-center items-center">
				<form
					onSubmit={addPrescription}
					className="w-1/2 h-4/5 bg-white rounded-lg p-4 flex flex-col justify-start items-center overflow-y-auto">
					<div className="w-full flex flex-row justify-between items-center p-2">
						<h3 className="font-bold text-xl">Add Prescription</h3>
						<MdClose
							className="text-2xl font-bold cursor-pointer"
							onClick={closeModal}
						/>
					</div>
					<div className="w-full flex flex-row justify-between items-start gap-4 p-2">
						<h3 className="w-1/4 font-bold text-xl">Name</h3>
						<div className="flex-1 flex flex-col">
							<input
								type="text"
								placeholder="Required"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="flex-1 p-2 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:outline-none"
								required
							/>
							<p className="text-primary-300">
								Enter the name of the prescription.
							</p>
						</div>
					</div>
					<div className="w-full flex flex-row justify-between items-start gap-4 p-2">
						<h3 className="w-1/4 font-bold text-xl">Dosage</h3>
						<div className="flex-1 flex flex-col">
							<input
								type="text"
								value={dosage}
								onChange={handleDosageChange}
								className="flex-1 p-2 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:outline-none"
								required
							/>
							<p className="text-primary-300">
								Enter the dosage of the prescription in mg.
								Required.
							</p>
						</div>
					</div>
					<div className="w-full flex flex-row justify-between items-start gap-4 p-2">
						<h3 className="w-1/4 font-bold text-xl">Frequency</h3>
						<div className="flex-1 flex flex-col">
							<input
								type="number"
								min="0"
								max="6"
								value={frequency}
								onChange={(e) => setFrequency(e.target.value)}
								className="flex-1 p-2 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:outline-none"
								required
							/>
							<p className="text-primary-300">
								Enter the frequency of the prescription daily.
								Required.
							</p>
						</div>
					</div>
					<div className="w-full flex flex-row justify-between items-start gap-4 p-2">
						<h3 className="w-1/4 font-bold text-xl">Duration</h3>
						<div className="flex-1 flex flex-col">
							<input
								type="date"
								min={moment.utc().local().format('YYYY-MM-DD')}
								value={duration}
								onChange={(e) => setDuration(e.target.value)}
								className="flex-1 p-2 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:outline-none"
								required
							/>
							<p className="text-primary-300">
								Enter the duration of the prescription.
								Required.
							</p>
						</div>
					</div>
					<div className="w-full flex flex-row justify-between items-start gap-4 p-2">
						<h3 className="w-1/4 font-bold text-xl">Notes</h3>
						<div className="flex-1 flex flex-col">
							<textarea
								rows="5"
								placeholder="Optional"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="flex-1 p-2 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:outline-none"
							/>
							<p className="text-primary-300"></p>
						</div>
					</div>
					<div className="w-full flex flex-row justify-end items-center gap-4 p-2">
						<button
							className="bg-primary-500 font-bold text-white rounded-lg p-2 flex flex-row items-center justify-center gap-2"
							type="submit">
							<MdAddCircle className="text-2xl" />
							Add Prescription
						</button>
					</div>
				</form>
			</div>
		)
	);
};

export default AddPrescriptionView;
