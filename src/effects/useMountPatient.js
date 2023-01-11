/** @format */

import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import QueueService from '../services/QueueService';

const useMountPatient = (socket, callback) => {
	const { state } = useContext(AuthContext);

	useEffect(() => {
		if (!JSON.parse(state.authenticated)) {
			socket.disconnect();
		} else {
			socket.connect();
		}
	}, [state.authenticated, socket]);

	useEffect(() => {
		QueueService.getAllPatients(socket, callback);
		return () => {
			QueueService.Off.getAllPatients(socket);
		};
	}, [socket, callback]);

	useEffect(() => {
		socket.on('error', (err) => {
			alert(err);
		});

		socket.on('connect_error', (err) => {
			alert('Connection error: ' + err);
		});
		socket.on('connect_failed', (err) => {
			alert('Connection failed: ' + err);
		});

		return () => {
			socket.off('error');
			socket.off('connect_error');
			socket.off('connect_failed');
		};
	}, [socket]);
};

export default useMountPatient;
