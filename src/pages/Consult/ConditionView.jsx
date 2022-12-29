/** @format */

import moment from 'moment';

const { useState } = require('react');

function ConditionView({ toggleConditionView, setToggleConditionView, data }) {
	console.log(data);
	const [prescription, setPrescription] = useState({});

	const selectPrescription = (index) => {
		setPrescription(data.prescriptions[index]);
	};
	return (
		toggleConditionView && (
			<div className="w-full h-full flex fixed justify-center items-center top-0 left-0 z-50 bg-black bg-opacity-80 text-primary-50 selection:bg-primary-100 selection:text-primary-500">
				<div className="w-1/2 flex flex-col justify-start items-center rounded-xl py-4 px-2 bg-primary-500 bg-opacity-25 bg-blur z-50">
					<div className="w-4/5 flex items-end gap-2 justify-center mb-8">
						<h1 className="text-2xl font-bold">Patient Record</h1>
						<p>#{data._id}</p>
					</div>

					<div className="w-4/5 flex flex-row items-start justify-between mb-4 gap-12">
						<div className="font-bold text-lg">
							<p>Condition</p>
						</div>
						<div className="text-lg text-right">
							<p>{data.condition}</p>
						</div>
					</div>

					<div className="w-4/5 flex flex-row items-start justify-between mb-4 gap-12">
						<div className="font-bold text-lg">
							<p>Treatments</p>
						</div>
						<div className="text-lg text-right">
							{data.treatments.length > 0 &&
							data.treatments[0].length > 0 ? (
								data.treatments.map((treatment, index) => (
									<p>{data.treatments.join(', ')}</p>
								))
							) : (
								<p>N/A</p>
							)}
						</div>
					</div>

					<div className="w-4/5 flex flex-row items-start justify-between mb-4 gap-12">
						<div className="font-bold text-lg">
							<p>Prescriptions (Click pill to view)</p>
						</div>
						<div className="text-lg text-right">
							{data.prescriptions.length > 0 &&
								data.prescriptions.map(
									(prescription, index) => (
										<span
											className="cursor-pointer text-base py-1 px-2 transition-all ease-in-out duration-300 rounded-full bg-primary-500 text-white hover:font-bold hover:text-white"
											onClick={() =>
												selectPrescription(index)
											}>
											{prescription.name}
										</span>
									)
								)}
						</div>
					</div>

					{prescription.name && (
						<div className="w-4/5 flex flex-row items-start justify-between mb-4 gap-12">
							<div></div>
							<div className="text-lg text-right">
								<p>
									{prescription.name}, {prescription.dosage},{' '}
									{prescription.frequency}x/day
								</p>
								{prescription.duration && (
									<p>
										Duration:{' '}
										{moment(prescription.duration).format(
											'MMMM Do YYYY'
										)}
									</p>
								)}
								<p>Notes: {prescription.notes}</p>
							</div>
						</div>
					)}

					<div className="w-4/5 flex flex-row items-start justify-between mb-4 gap-12">
						<div className="font-bold text-lg">
							<p>Next Consultation</p>
						</div>
						<div className="text-lg text-right">
							<p>
								{data?.nextConsultation
									? moment(data?.nextConsultation).format(
											'MMMM Do YYYY'
									  )
									: 'N/A'}
							</p>
						</div>
					</div>

					<div className="w-4/5 flex flex-row items-start justify-between mb-4 gap-12">
						<div className="font-bold text-lg">
							<p>Remarks</p>
						</div>
						<div className=" text-lg text-right">
							{data.remarks.length > 0 ? (
								<p>{data.remarks}</p>
							) : (
								<p>N/A</p>
							)}
						</div>
					</div>

					<div className="w-4/5 flex flex-row items-start justify-between mb-4 gap-12">
						<div className="font-bold text-lg">
							<p>Consulted By</p>
						</div>
						<div className="text-lg text-right">
							<p>{data.consultedBy.name}</p>
						</div>
					</div>

					<div
						className="text-2xl cursor-pointer font-bold"
						onClick={() => {
							setToggleConditionView(false);
							setPrescription({});
						}}>
						<span>✕</span>
					</div>
				</div>
			</div>
		)
	);
}

export default ConditionView;
