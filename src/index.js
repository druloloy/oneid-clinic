/** @format */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { QueueContextProvider } from './context/QueueContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<AuthContextProvider>
		<QueueContextProvider>
			<App />
		</QueueContextProvider>
	</AuthContextProvider>
);
