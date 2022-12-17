import './patient.scss';
import React, {useEffect, useState} from 'react';

export default function ConsultModal({prescriptions, setPrescriptions, toggleModal,consultation, setConsultation}) {

    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [singlePrescription, setSinglePrescription] = useState({
        medicine: '',
        dosage: '',
        frequency: 0,
        duration: '',
        note: ''
    });
    const [remarks, setRemarks] = useState('');
    const [nextConsultation, setNextConsultation] = useState('');


    useEffect(() => {
        setDiagnosis(consultation.condition);
        setTreatment(consultation.treatments.join(', '));
        setPrescriptions(consultation.prescriptions.map(prescription => {
            return {
                medicine: prescription.name,
                dosage: prescription.dosage,
                frequency: prescription.frequency,
                duration: prescription.duration,
                note: prescription.notes
            }
        }));
        setRemarks(consultation.remarks);
        setNextConsultation(consultation.nextConsultation);
    }, [consultation, setPrescriptions]);

    const loadPrescription = (index) => {
        setSinglePrescription(prescriptions[index]);
    }

    const removePrescription = (index) => {
        setPrescriptions(prescriptions.filter((prescription, i) => i !== index));
    }

    const addPrescription = () => {
        if(singlePrescription.medicine === '' || singlePrescription.dosage === '' || singlePrescription.frequency === 0 || singlePrescription.duration === '') {
            alert('Please fill up all the required fields in the prescription form.');
            return;
        };
        setPrescriptions([...prescriptions, singlePrescription]);
        setSinglePrescription({
            medicine: '',
            dosage: '',
            frequency: 0,
            duration: '',
            note: ''
        });
    }

    const save = () => {

        if(diagnosis === '' || prescriptions.length === 0) {
            console.log(prescriptions.length)
            alert('Please fill up all the required fields.');
            return;
        }

        setConsultation({
            condition: diagnosis,
            treatments:  treatment.split(',').map(treatment => treatment.trim()),
            prescriptions: prescriptions.map(prescription => {
                return {
                    name: prescription.medicine,
                    dosage: prescription.dosage,
                    frequency: prescription.frequency,
                    duration: prescription.duration,
                    notes: prescription.note
                }
            }),
            nextConsultation,
            remarks
        });
        toggleModal();
    }
        

    return (
        <div className="modal-body">
            <div className="modal-content">              
                <div className="title">Add Patient Record</div>
                <div className="wrapper">

                    <div className="record">
                        <label>Diagnosis: </label>
                        <input type="text" id='diagnosis'placeholder='Diagnosis' value={diagnosis} onChange={(e)=>setDiagnosis(e.target.value)}/>
                    </div>

                    <div className="record">
                        <label>Treatment: </label>
                        <input type="text" id='treatment'placeholder='Treatment (separate with comma)' value={treatment} onChange={(e)=>setTreatment(e.target.value)}/>
                    </div>

                    <div className="prescription">
                        <label>Prescription</label>
                        <div className="presc-container">
                            <div className="presc">
                            {
                                prescriptions.length > 0 ? prescriptions.map((prescription, index) => (
                                    <div className="prescription-pill">
                                        <div className="presc-name" onClick={()=>loadPrescription(index)} key={index}>
                                            <p>{prescription.medicine}</p>
                                        </div>
                                        <div className="presc-remove" onClick={()=>removePrescription(index)}>
                                            <span>✕</span>
                                        </div>
                                    </div>
                                )) : <></>
                            }
                            </div>
                            <PrescriptionContainer 
                                data={singlePrescription} 
                                setData={setSinglePrescription}
                                add={addPrescription} />
                        </div>
                    </div>
                    <div className="record">
                        <label>Remarks: </label>
                        <textarea name="remark" id="" cols="30" rows="10" value={remarks} onChange={(e)=>setRemarks(e.target.value)}></textarea>
                    </div>
                    <div className="record">
                        <label>Next Consultation: </label>
                        <input type={'date'} name="nextConsultation" id="" value={nextConsultation} onChange={(e)=>setNextConsultation(e.target.value)}/>
                    </div>
                </div>

                <div className="bottom">
                    <div className="cancel" onClick={toggleModal}>
                        <span>CANCEL</span>
                    </div>
                    <div className="save" onClick={save}>
                        <span>SAVE</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PrescriptionContainer = ({add, setData, data}) => {

    return (
            <div className="medication-container">
                                
            <div className="record">
                <label>Medicine:* </label>
                <input type="text" id='medicine'placeholder='Medicine*' onChange={
                    (e) => setData({...data, medicine: e.target.value})} 
                    value={data.medicine}/>
            </div>

            <div className="record">
                <label>Dosage:* </label>
                <input type="text" id='dosage'placeholder='Dosage*' onChange={
                    (e) => setData({...data, dosage: e.target.value})}
                    value={data.dosage}/>
            </div>

            <div className="record">
                <label>Frequency:* </label>
                <input type="number" id='frequency'placeholder='Frequency*' onChange={
                    (e) => setData({...data, frequency: e.target.value})}
                    value={data.frequency}/>
            </div>

            <div className="record">
                <label>Duration:* </label>
                <input type="date" id='duration'placeholder='Duration*' onChange={
                    (e) => setData({...data, duration: e.target.value})}
                    value={data.duration}/>
            </div>
            {/* for another prescription */}

            <div className="record" id='note'>
                <label>Note: </label>
                <textarea name="note" id="" cols="30" rows="10"></textarea>
            </div>
            <div onClick={add} className="addMed-btn">
                <span>ADD MEDICATION</span>
            </div>
            
        </div>
    )
}