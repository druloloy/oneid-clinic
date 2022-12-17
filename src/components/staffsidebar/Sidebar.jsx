import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import './sidebar.scss'
const Sidebar = () => {
  const {state} = useContext(AuthContext);
  const role = state.role;
  return (
    <div className="sidebarContainer">
      
      <div className="sidebar-wrapper">
        {/*profile*/}
        <div className="profile-container">
          <div className="users-name" id='staffName'>
            John Doe
          </div>
          <div className="staff-position" id='staffPosition'>
            Clinic Doctor
          </div>
        </div>
        
        {/*buttons*/}
        <div className="sidebar-button-container">
          <div className="sidebar-btn">
            <ul>
              <Link to='/doctor' style={{textDecoration:'none', opacity: role==='phys'?1 : 0.3, pointerEvents: role === 'phys' ? 'all' : 'none'}}>
                <li>
                  <span>Patient</span>
                </li>
              </Link>
              <Link to='/staff' style={{textDecoration:'none'}}>
                <li>
                  <span>Add Patient</span>
                </li>
              </Link>
              <Link to='/queue' style={{textDecoration:'none'}}>
                <li>
                  <span>View Queue</span>
                </li>
              </Link>

            </ul>
          </div>
          
        </div>
      </div>


    </div>  
  )
}

export default Sidebar