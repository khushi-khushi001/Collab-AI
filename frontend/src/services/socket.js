import {io} from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
    transports: ["websockets", "polling"],
});

/*socket.on("connect", () => {
    ("socket connected:", socket.id);
});*/

export default socket;