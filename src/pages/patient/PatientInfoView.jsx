import React,{useCallback, useContext, useEffect, useMemo, useState} from 'react'
import './patient.scss'

import Navbar from '../../components/navbar/Navbar'
import Sidebar from '../../components/staffsidebar/Sidebar'
import ConditionView from './ConditionView'
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ConsultModal from './ConsultModal'
import QueueService from '../../services/QueueService'
import { QueueContext } from '../../context/QueueContext'
import moment from 'moment'
import UserService from '../../services/UserService'

const patientModel = {
    id: '',
    fullName: '',
    age: '',
    address: '',
    sex: '',
    purpose: ''
}

const PatientInfoView = () => {
    const [toggleConditionView, setToggleConditionView] = useState(false);
    const [selectedViewCondition, setSelectedViewCondition] = useState({});
    const [modalBody, setModal] = useState(false);
    const [consultation, setConsultation] = useState({
        condition: "",
        treatments: [],
        prescriptions: [],
        nextConsultation: "",
        remarks: ""
    });

    const [prescriptions, setPrescriptions] = useState([]);
    const [nextPatient, setNextPatient] = useState(patientModel);
    const [patient, setPatient] = useState(patientModel);

    const navigate = useNavigate();
    const {state} = useContext(AuthContext);
    const role = state.role;
    
    useEffect(() => {
        if(role !== 'phys') navigate(-1);
    }, [role, navigate])


    const {queue, setQueue, socket} = useContext(QueueContext);

    const toggleModal =() => {
        setModal(!modalBody)
    }

    const getPatientConsultations = useCallback(async (id) => {
        const consultations = await UserService.getPatientConsultations(id);
        return consultations.content;
    }, []);

    useMemo(() => {
        const id = getLocalPatient();
        if(id && patient.id === '') {
            const result = queue.find((patient) => patient._id === id);
            if(result) {
                const p = {
                    id: result._id,
                    fullName: `${result.patient.firstName} ${result.patient.middleName} ${result.patient.lastName} ${result.patient.suffix}`,
                    age: moment().diff(result.patient.birthdate, 'years'),
                    address: `${result.patient.address.houseNumber} ${result.patient.address.street} ${result.patient.address.barangay} ${result.patient.address.city}`,
                    sex: result.patient.sex,
                    purpose: result.purpose
                }
                getPatientConsultations(p.id).then((consultations) => {
                    p.consultations = consultations;
                    console.log('Found local patient', p);
                    setPatient(p);
                });
            }
        }
    }, [queue, setPatient, patient.id, getPatientConsultations]);

    useMemo(() => {        
        const waitingPatients = queue.filter((patient) => patient.status === 'Waiting');
        if(waitingPatients.length === 0) return setNextPatient(patientModel);

        const nextPatient = waitingPatients[0];
        

        const p = {
            id: nextPatient._id,
            fullName: `${nextPatient.patient.firstName} ${nextPatient.patient.middleName} ${nextPatient.patient.lastName} ${nextPatient.patient.suffix}`,
            age: moment().diff(nextPatient.patient.birthdate, 'years'),
            address: `${nextPatient.patient.address.houseNumber} ${nextPatient.patient.address.street} ${nextPatient.patient.address.barangay} ${nextPatient.patient.address.city}`,
            sex: nextPatient.patient.sex,
            purpose: nextPatient.purpose
        };
        getPatientConsultations(nextPatient._id).then((consultations) => {
            p.consultations = consultations;
            setNextPatient(p);
        });
    }, [queue, setNextPatient, getPatientConsultations]);


    const getNextPatient = async () => {
        removeLocalPatient();
        if (nextPatient.id === '') {
            // If there is no next patient, finish the current patient and log the result
            QueueService.finish(socket, patient.id);
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
            consultations: await getPatientConsultations(nextPatient.id)
        }
        saveLocalPatient(newPatient.id);
        setPatient(newPatient);
    }

    const finishCurrentPatient = () => {
        UserService.consultPatient(patient.id, consultation)
            .then((res) => {
                QueueService.finish(socket, patient.id);
                setPatient(patientModel);
                removeLocalPatient();
            });
    }

    const selectCondition = (id) => {
        const condition = patient.consultations.find((c) => c._id === id);
        setSelectedViewCondition(condition);
        setToggleConditionView(true);
    }

  return (
    <React.Fragment>

    {modalBody && (
        <ConsultModal consultation={consultation} setConsultation={setConsultation} toggleModal={toggleModal} prescriptions={prescriptions} setPrescriptions={setPrescriptions}/>
    )}
    
    <div className="container">
        <Navbar/>
        <Sidebar/>
        <div className="body-container">
            
            <div className="patientTitle">
                <span>Patient Information</span>
            </div>

            <div className="infoWrapper">
                <div className="patientID">
                    <span>Patient ID No:</span>
                    <input type="int" id='patientID' placeholder='ID Number' value={patient.id} disabled/>
                </div>
                <div className="patientInfo">

                    <div className="name">
                        <input type="text"  id="Fname" placeholder="Full Name" value={patient.fullName} disabled/>
                    <label>Full Name</label>
                    </div>

                    <div className="birthdate">
                        <input type="text"  id="Age" placeholder="Age" value={patient.age} disabled/>
                    <label>Age</label>
                    </div>

                    <div className="gender">
                        <input type="text"  id="gender" placeholder="Gender" value={patient.sex} disabled/>
                    <label>Gender</label>
                    </div>

                    <div className="address">
                        <input type="text"  id="address" placeholder="Address" value={patient.address} disabled/>
                    <label>Address</label>
                    </div>

                    <div className="purpose">
                        <input type="text"  id="purpose" placeholder="Purpose" value={patient.purpose} disabled/>
                    <label>Purpose</label>
                    </div>

                </div>
                <div className="table-container">
                    <h1>Patient Health Record</h1>
                <div className="patientRecord">
                    <table>
                        <thead>
                            <tr >
                                <th className='left'>TRANSACTION ID</th>
                                <th>CONDITION</th>
                                <th>DATE</th>
                                <th className='right'>OPTION</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                patient.id !== '' && patient.consultations.length > 0 ? (
                                    patient.consultations.map((consultation, index) => (
                                        <tr key={index}>
                                            <td className='data'>{consultation._id}</td>
                                            <td className='data'>{consultation.condition}</td>
                                            <td className='data'>{moment(consultation.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                            <td className='option' id='action'>
                                                <div className='view-btn' onClick={()=>{
                                                    selectCondition(consultation._id);
                                                }}>VIEW</div>
                                            </td>
                                        </tr>
                                    ))
                                ) : <></>
                            }     
                        </tbody>
                    </table>
                </div>
                <div className="addrecord-btn" onClick={toggleModal}>
                        <span>ADD RECORD</span>
                </div>
                
                </div>
            </div>
            <div className="lower-btn">
                <div className='next-btn' onClick={getNextPatient}>
                    <span>NEXT PATIENT <KeyboardDoubleArrowRightRoundedIcon className='icon'/></span>
                </div>
                <div className='prev-btn' onClick={finishCurrentPatient}>
                    <span>FINISH <KeyboardDoubleArrowRightRoundedIcon className='icon'/></span>
                </div>
            </div>
        </div>
     </div>

    <ConditionView 
        toggleConditionView={toggleConditionView} 
        setToggleConditionView={setToggleConditionView} 
        data={selectedViewCondition}/>

     </React.Fragment>
  )
}

const saveLocalPatient = (id) => {
    localStorage.setItem('curr_patient_id', id);
}

const getLocalPatient = () => {
    const patient = localStorage.getItem('curr_patient_id');
    return patient;
}

const removeLocalPatient = () => {
    localStorage.removeItem('curr_patient_id');
}

export default PatientInfoView