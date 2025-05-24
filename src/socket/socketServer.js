// src/socket/socketServer.js
let io;

export const initSocketServer = async (server) => {
    const { Server } = await import('socket.io');
    io = new Server(server, {
        cors: {
            origin: '*', // Or specify your frontend domain
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });

        // You can add custom listeners here
        // socket.on('event_name', (data) => { ... });
    });
};

export const sendToAll = (event, data) => {
    if (io) {
        io.emit(event, data);
    }
};
