/** @format */

//import './app.scss'

import Login from './pages/login/Login';
import PatientInfoView from './pages/Consult';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Queue from './pages/queue';
import { QueueContextProvider } from './context/QueueContext';
import useVerifyToken from './effects/useVerifyToken';

function App() {
	useVerifyToken();
	return (
		<div className="w-full h-screen bg-primary-50">
			{/* routers with authentication and queueprovider */}
			<BrowserRouter>
				<Routes>
					<Route index path="/" element={<Login />} />
				</Routes>
				<QueueContextProvider>
					<Routes>
						<Route path="/">
							<Route path="/dashboard" element={<Dashboard />} />
							<Route
								path="/consult"
								element={<PatientInfoView />}
							/>
							<Route path="/queue" element={<Queue />} />
						</Route>
					</Routes>
				</QueueContextProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
