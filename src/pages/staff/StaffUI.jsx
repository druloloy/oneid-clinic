import React, { useContext, useState } from 'react'
import './staff.scss'
import Navbar from '../../components/navbar/Navbar' 
import Sidebar from '../../components/staffsidebar/Sidebar'
import { QueueContext } from '../../context/QueueContext'
import QueueService from '../../services/QueueService'
import UserService from '../../services/UserService'
import moment from 'moment/moment'
import { useMemo } from 'react'
const StaffUI = () => {

  const {queue, _, socket} = useContext(QueueContext);
  const [patient, setPatient] = useState({});
  const [purpose, setPurpose] = useState('Consultation');
  const [id, setId] = useState('');
  const [nextQueueNumber, setNextQueueNumber] = useState(0);

  useMemo(() => {
    const queueLength = queue.length;
    const lastQueue = queue[queueLength - 1];
    const lastQueueNumber = lastQueue ? lastQueue.queueNumber : 0;
    const nextQueueNumber = lastQueueNumber + 1;  
    setNextQueueNumber(nextQueueNumber);
  }, [queue]);

  const decryptId = async(id) => {
    const decryptedId = await UserService.decrypt(id);
    return decryptedId.content;
  }

  const getPatient = async (id) => {
    const decryptedId = await decryptId(id);
    const login = await UserService.getPatientLogin(decryptedId);
    const details = await UserService.getPatientDetails(decryptedId);
    const {firstName, middleName, lastName, suffix, address, birthdate, sex} = details.content;
    const {mobileNumber} = login.content;

    const patient = {
      id: decryptedId,
      fullName: `${firstName} ${middleName} ${lastName} ${suffix}`,
      age: moment().diff(birthdate, 'years'),
      sex,
      address: `${address.houseNumber} ${address.street} ${address.barangay} ${address.city}`,
      contact: mobileNumber,
    }
    setPatient(patient);
  }


  const handleSearch = (e) => {
    e.preventDefault();
    getPatient(id);
  }

  const addToQueue = async () => {
    console.log(purpose);
    QueueService.add(socket, id, purpose);
  }

  return (
    <div className="container">
     <Navbar/>
     <Sidebar/>
      <div className="bodyContainer">
        <div className="scan-wrapper">
          <div className="scanContainer">
           <input type="text" onChange={(e)=>setId(e.target.value)} placeholder='Scan QR Code/ Type ID Number'/>
          </div>
          
          <div className="searchBtn" onClick={handleSearch}>
            <span>SEARCH</span>
          </div>

        </div>

        <div className="patientInformation">
          <div className="patientinfoTitle">
            <h1>Patient Information</h1>
          </div>

          <div className="patientID">
            <span>Patient ID No:</span>
            <input type="text" id='patientID' value={patient.id} placeholder='ID Number Here' disabled/>
          </div>

          <div className="info-wrapper">

            <div className="name">
              <input type="text" name="fullName" id="Fname" placeholder="Full Name" value={patient.fullName}  disabled/>
              <label htmlFor="fullname">Full Name</label>
            </div>

            <div className="birthdate">
              <input type="text" name="birthdate" id="birthdate" placeholder="Age" value={patient.age}  disabled/>
              <label htmlFor="birthdate">Age</label>
            </div>

            <div className="gender">
              <input type="text" name="gender" id="gender" placeholder="Gender" value={patient.sex}  disabled/>
              <label htmlFor="gender">Gender</label>
            </div>

            <div className="address">
              <input type="text" name="address" id="address" placeholder="Address" value={patient.address} disabled/>
              <label htmlFor="address">Address</label>
            </div>

            <div className="purpose">
              {/* <input type="purpose" name="purpose" id="purpose" placeholder="Select Purpose" value={getSelection}disabled/> */}
              <select onChange={e=>setPurpose(e.target.value)} defaultValue={purpose}>
                  <option className='item' value='Consultation'>Consultation</option>
                  <option className='item' value='COVID Vaccine'>COVID Vaccine</option>
                  <option className='item' value='Other Vaccine'>Other Vaccine</option>
                  <option className='item' value='Family Planning'>Family Planning</option>
                  <option className='item' value='NCD Checkup'>NCD Checkup</option>
                  <option className='item' value='Dental Checkup'>Dental Checkup</option>
             
              </select>
              <label htmlFor="purpose">Purpose</label>
            </div>

            <div className="contact">
              <input type="text" name="contact" id="contact" value={patient.contact} placeholder="Contact No."  disabled/>
              <label htmlFor="contact">Contact No.</label>
            </div>

            <div className="queue">
              <span id="queue" >{nextQueueNumber}</span>
              <label htmlFor="queue">Queue No.</label>
            </div>

            <div className="add-btn" onClick={addToQueue}>
            <span>ADD PATIENT</span>
          </div>

          </div>

          
        </div>
      </div>
    </div>
  )
}

export default StaffUI