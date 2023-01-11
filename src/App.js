/** @format */

//import './app.scss'

import Login from './pages/login/Login';
import PatientInfoView from './pages/Consult';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
					<Route path="/">
						<Route element={<PublicRoute />}>
							<Route index element={<Login />} exact />
						</Route>

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
					</Route>
					<Route path="*" element={<Page404 />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
