const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const {Server} = require("socket.io");


app.use(cors({origin:
    [
        "http://localhost:5173",
        "https://collab-ai-vc0h.onrender.com",
        "https://collab-ai-app.onrender.com"
    ], 
    credentials: true}));
app.use(express.json());

const connectDB = require("./config/db.js");
connectDB();

const authRoutes = require("./routes/authRoutes.js");
const aiRoutes = require("./routes/aiRoutes.js");
const meetingRoutes = require("./routes/meetingRoutes.js");

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/meetings", meetingRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 
        [
            "http://localhost:5173",
            "https://collab-ai-vc0h.onrender.com"
        ]    
    }
});

const socketHandler = require("./socket/socketHandler.js");
socketHandler(io);


app.get("/", (req, res) => {
    res.send("backend running...");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});