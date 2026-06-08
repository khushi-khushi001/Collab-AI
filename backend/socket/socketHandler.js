
const rooms = {};

const socketHandler = (io) => {

    io.on("connection", (socket) => {
       // console.log("client-connected:", socket.id);
        
    

    // join room
    socket.on("join-room", ({roomId, user}) => {
       // console.log("joined room");
        socket.join(roomId);

        if(!rooms[roomId]) {
            rooms[roomId] = {
                hostId: socket.id,
                users: [],
            };
        }

        const room = rooms[roomId];

        // duplicate user remove
        room.users = room.users.filter((item) =>
          item.socketId !== socket.id
        );

        room.users.push({
            socketId: socket.id,
            user,
            muted: false,
            handRaised: false,
        });

        io.to(roomId).emit("room-users", room.users);

        io.to(roomId).emit("system-message", {

            type: "join",
            message: `${user.name} joined the meeting`
        });
        
    });


    // offer
    socket.on("offer", ({roomId, offer}) => {
       
        socket.to(roomId).emit("offer", {offer});
    });

    // answer
    socket.on("answer", ({roomId, answer}) => {
        
        const room = io.sockets.adapter.rooms.get(roomId);
        socket.to(roomId).emit("answer", {answer});
    });

    // send message
    socket.on("send-message", ({roomId, message}) => {
        io.to(roomId).emit("recieve-message", message);
    });

    // raise hand
    socket.on("raise-hand", ({roomId, raised}) => {

        //console.log("hand event", raised);
        const room = rooms[roomId];
        if(!room) return;
        

        room.users = room.users.map((item) => {
            if(item.socketId === socket.id){
                return {...item, handRaised: raised};
            }
            return item;
        });

        //console.log("raised hand users:", updatedUsers);

        io.to(roomId).emit("room-users", room.users);
    });

    // ice candidate
    socket.on("ice-candidate", ({roomId, candidate}) => {
       // console.log("ice-candidate")
        socket.to(roomId).emit("ice-candidate",
        {candidate});
    });

    // mic status
    socket.on("mic-status", ({roomId, muted}) => {
       // console.log("mic status", muted);

       const room = rooms[roomId];
        if(!room) return;

        room.users = room.users.map((item) => 
        item.socketId === socket.id ? {...item, muted} : item);
        

       // console.log(rooms[roomId]);

        io.to(roomId).emit("room-users", room.users);
    });
    

    // Disconnect
    socket.on("disconnect", () => {
       
        for(const roomId in rooms) {

            const room = rooms[roomId];

            //leave
            const leavingUser = room.users.find(
                (u) => u.socketId === socket.id
            );

            // user remove
            room.users = room.users.filter((u) => 
              u.socketId !== socket.id
            );

            if(leavingUser) {
                io.to(roomId).emit("system-message", {
                    type: "leave",
                    message: `${leavingUser.user.name} left the meeting`
                });
            }

            // updated room
            io.to(roomId).emit("room-users", room.users);

            // empty room remove
            if(room.users.length === 0  )
             {
                delete rooms[roomId];
            }
        }
    });

    });
};

module.exports = socketHandler;