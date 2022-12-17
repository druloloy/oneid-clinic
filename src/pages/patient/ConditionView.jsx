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
			<div className="condition-view-container">
				<div className="condition-view">
					<div className="condition-view-header">
						<h1>Patient Record</h1>
						<p>#{data._id}</p>
					</div>

					<div className="condition-view-body">
						<div className="condition-view-body-left">
							<p>Condition</p>
						</div>
						<div className="condition-view-body-right">
							<p>{data.condition}</p>
						</div>
					</div>

					<div className="condition-view-body">
						<div className="condition-view-body-left">
							<p>Treatments</p>
						</div>
						<div className="condition-view-body-right">
							{data.treatments.length > 0 ? (
								data.treatments.map((treatment, index) => (
									<p>{data.treatments.join(', ')}</p>
								))
							) : (
								<p>N/A</p>
							)}
						</div>
					</div>

					<div className="condition-view-body">
						<div className="condition-view-body-left">
							<p>Prescriptions (Click pill to view)</p>
						</div>
						<div className="condition-view-body-right">
							{data.prescriptions.length > 0 &&
								data.prescriptions.map(
									(prescription, index) => (
										<span
											className="pill"
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
						<div className="condition-view-body">
							<div className="condition-view-body-left"></div>
							<div className="condition-view-body-right">
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

					<div className="condition-view-body">
						<div className="condition-view-body-left">
							<p>Next Consultation</p>
						</div>
						<div className="condition-view-body-right">
							<p>
								{moment(data.nextConsultation).format(
									'MMMM Do YYYY'
								)}
							</p>
						</div>
					</div>

					<div className="condition-view-body">
						<div className="condition-view-body-left">
							<p>Remarks</p>
						</div>
						<div className="condition-view-body-right">
							{data.remarks.length > 0 ? (
								<p>{data.remarks}</p>
							) : (
								<p>N/A</p>
							)}
						</div>
					</div>

					<div className="condition-view-body">
						<div className="condition-view-body-left">
							<p>Consulted By</p>
						</div>
						<div className="condition-view-body-right">
							<p>{data.consultedBy.name}</p>
						</div>
					</div>

					<div
						className="condition-view-close"
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
