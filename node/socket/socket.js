const socket = {};

socket.bot = async (socket, io) => {
    const room = 'test_room';

    socket.on('t_join', async (data) => {

        console.log(data);

        socket.join(room, async () => {
            io.to(room).emit('joinRoom', {'data' : 'test'});
        });
    });

    socket.on('t_send', async (data) => {
        console.log(data);

        io.to(room).emit('receiveMsg', {'msg' : encodeURI(data.msg)});
    });

    return socket;
};


module.exports = socket;
