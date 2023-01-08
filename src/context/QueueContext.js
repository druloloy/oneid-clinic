/** @format */

import { createContext, useState } from 'react';
import io from 'socket.io-client';
import useMountPatient from '../effects/useMountPatient';
import config from '../configs/socket.config';
const { baseUrl, options } = config;

const socket = io(baseUrl, options);

export const QueueContext = createContext();

export const QueueContextProvider = ({ children }) => {
	const [queue, setQueue] = useState([]);

	useMountPatient(socket, (data) => {
		setQueue(data);
	});

	return (
		<QueueContext.Provider value={{ queue, setQueue, socket }}>
			{children}
		</QueueContext.Provider>
	);
};
