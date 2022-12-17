import React, { useEffect, useState } from 'react'
import './queue.scss'
import Navbar from '../../components/navbar/Navbar'
import Sidebar from '../../components/staffsidebar/Sidebar'
import { useContext } from 'react'
import { QueueContext } from '../../context/QueueContext'
import { useMemo } from 'react'
const Queue = () => {
  
  const {queue} = useContext(QueueContext)
  const [ongoingNumber, setOngoingNumber] = useState(0);
  const [waitingNumbers, setWaitingNumbers] = useState([]);

  useMemo(() => {
    if(queue.length > 0){
      const ongoingPatients = queue.filter((patient) => patient.status === 'Ongoing');
      setOngoingNumber(ongoingPatients[0]?.queueNumber);
    }
  }, [queue])

  useMemo(() => {

      const waitingPatients = queue.filter((patient) => patient.status === 'Waiting');
      setWaitingNumbers(waitingPatients.map((patient) => patient.queueNumber));
    
  }, [queue])

  return (
    <div className="container">
     <Navbar/>
     <Sidebar/>
     
        <div className="queueContainer">
          <div className="title">
            <span>PATIENT COUNTER</span>
          </div>
          <div className="queue-body">
            
            <div className="left">
              <div className="left-title">
                <div className="scroll">
                  <span>NOW SERVING...</span>
                </div>
              </div>
              <div className="now-serving">
                <span id='current-number'>{ongoingNumber || "None"}</span>
              </div>
              <div className="left-title">
                <span>NOW SERVING...</span>
              </div>
            </div>

            <div className="right">
              <div className="right-title">
                <span>Next Patient...</span>
              </div>
              {/*count starts here*/}
              {
                waitingNumbers.length > 0 ? waitingNumbers.map((number) => (
                  <div key={number} className="wrapper">
                    <div className="counter">
                      {
                        <span>{number}</span>
                      }
                    </div>
                  </div>
                ))
                :
                <></>
              }

            </div>
          </div>
        </div>
     </div>
  )
}

export default Queue