/** @format */

const getAllPatients = (socket, callback) => {
	socket.on('queue::all', callback);
};

const moveNext = (socket, id, status) => {
	socket.emit('queue::toggle', id, status);
};

const finish = (socket, id) => {
	socket.emit('queue::toggle', id, 'Finished');
};

const remove = (socket, id) => {
	socket.emit('queue::remove', id);
};

const add = (socket, id, purpose) => {
	return new Promise((resolve, reject) => {
		socket.emit('queue::add', id, purpose, () => {
			resolve();
		});
	});
};

const Off = {
	getAllPatients: (socket) => {
		socket.off('queue::all');
	},
};

const QueueService = {
	getAllPatients,
	moveNext,
	finish,
	remove,
	add,
	Off,
};

export default QueueService;
