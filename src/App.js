//import './app.scss'

import Login from './pages/login/Login'
import PatientInfoView from './pages/patient/PatientInfoView';
import StaffUI from './pages/staff/StaffUI';
import {BrowserRouter,Route,Routes} from 'react-router-dom' 
import Queue from './pages/queue/Queue';
import { AuthContext } from './context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { QueueContextProvider } from './context/QueueContext';
import useVerifyToken from './effects/useVerifyToken';

function App() {
  const {state, _dispatch} = useContext(AuthContext);


  useVerifyToken();

  return (
    <QueueContextProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={!state.authenticated ? <Login/> : <StaffUI />} />
          <Route path="/">
            <Route path="/Staff" element={!state.authenticated ? <Login/> : <StaffUI />} />
            <Route path="/Doctor" element={!state.authenticated ? <Login/> : <PatientInfoView />} />
            <Route path="/queue" element={!state.authenticated ? <Login/> : <Queue/>} />

          </Route>
        </Routes>
      </BrowserRouter>
    </QueueContextProvider>
  );
}

export default App;
