/** @format */

//import './app.scss'

import Login from './pages/login/Login';
import PatientInfoView from './pages/Consult';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Queue from './pages/queue';
import { QueueContextProvider } from './context/QueueContext';
import useVerifyToken from './effects/useVerifyToken';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import Page404 from './pages/404/Page404';
function App() {
	useVerifyToken();
	return (
		<div className="w-full h-screen bg-primary-50">
			{/* routers with authentication and queueprovider */}
			<BrowserRouter>
				<Routes>
					<Route element={<PublicRoute />}>
						<Route path="/" element={<Login />} exact />
					</Route>
				</Routes>
				<QueueContextProvider>
					<Routes>
						<Route element={<PrivateRoute />}>
							<Route
								path="/dashboard"
								element={<Dashboard />}
								exact
							/>
							<Route
								path="/consult"
								element={<PatientInfoView exact />}
							/>
							<Route path="/queue" element={<Queue />} exact />
						</Route>
					</Routes>
				</QueueContextProvider>
				<Routes>
					<Route path="*" element={<Page404 />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
