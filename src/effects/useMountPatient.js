import { useEffect } from 'react';
import QueueService from '../services/QueueService';
const useMountPatient = (socket, callback) => {
    useEffect(() => {
        QueueService.getAllPatients(socket, callback); 
        return () => {
            QueueService.Off.getAllPatients(socket);
        }
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
        }
    }, [socket]);
}

export default useMountPatient;