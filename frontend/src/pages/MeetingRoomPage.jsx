import { useContext, useEffect, useRef, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../layouts/dashboardLayout";
import socket from "../services/socket";
import { AuthContext } from "../context/AuthContext";
import ParticipantCard from "../components/meeting/ParticipantCard";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import BackHandIcon from '@mui/icons-material/BackHand'
import PanToolIcon from '@mui/icons-material/PanTool'
import ChatIcon from '@mui/icons-material/Chat'
import StopIcon from "@mui/icons-material/Stop";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"


function MeetingRoomPage() {

    const navigate = useNavigate();

    const {roomId,} = useParams();

    const {user} = useContext(AuthContext);

    const userData = localStorage.getItem("user");
    const currUser = userData ? JSON.parse(userData) : null;

    const [participants, setParticipants] = useState([]);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const [messages, setMessages] = useState([]);
    const [chatText, setChatText] = useState("");
    const [showChat, setShowChat] = useState(false);

    const [isSharing, setIsSharing] = useState(false);

    const [isHandRaised, setIsHandRaised] = useState(false);

    const [meetingTime, setMeetingTime] = useState(0);
    const [meetingStartTime, setMeetingStartTime] = useState(null);

    const [isRecording, setIsRecording] = useState(false);
    const [notifications, setNotifications] = useState("");

    const [summary, setSummary] = useState("");
    const [transcript, setTranscript] = useState("");

    const [meetingId, setMeetingId] = useState(null);


    // video ref
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);

    const isCallerRef = useRef(false);
    const pendingCandidatesRef = useRef([]);

    const offerSentRef = useRef(false);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);

    const meetingStartedRef = useRef(false);

    const copyRoomId = async () => {
        await navigator.clipboard.writeText(roomId);

        alert("Meeting code copied");
    };
     

    const toggleMute = () => {
        const stream = localStreamRef.current;
        if(!stream) return;

        const audioTrack = stream.getAudioTracks()[0];

        if(!audioTrack) return;

        audioTrack.enabled = !audioTrack.enabled;

        const muted = !audioTrack.enabled;

        setIsMuted(muted);

        socket.emit("mic-status", {roomId, muted});
    };

    const toggleVideo = () => {
        const stream = localStreamRef.current;

        if(!stream) return;

        const videoTrack = stream.getVideoTracks()[0];

        if(!videoTrack) return;

        videoTrack.enabled = !videoTrack.enabled;

        setIsVideoOff(!videoTrack.enabled);
    };

    const toggleShareScreen = async () => {
        try {
            if(!isSharing){

                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video:true
                });

                

                const screenTrack = screenStream.getVideoTracks()[0];

                if(!screenTrack) return;

                const sender = peerConnectionRef.current ?.getSenders().find(
                    (s) => 
                        s.track?.kind === "video"
                );

                if(sender) {
                    sender.replaceTrack(screenTrack);
                }

                // local preview
                localVideoRef.current.srcObject = screenStream;

                setIsSharing(true);

                // stop share manually
                screenTrack.onended = async () => {
                    const camTrack = localStreamRef.current
                    .getVideoTracks()[0];

                    if(sender && camTrack){
                        await sender.replaceTrack(camTrack);
                    }

                    if(localVideoRef.current){
                        localVideoRef.current.srcObject = localStreamRef.current;
                    }

                    setIsSharing(false);
                };
            }
        } catch (error) {
            console.log("screen-share", error);
        }
    }

    const toggleRaiseHand = () => {

        const value = !isHandRaised;

        setIsHandRaised(value);

        socket.emit("raise-hand", {
            roomId, raised: value,
        });

    };

    const createPeer = () => {

        const peer = new RTCPeerConnection({
            iceServers: [
               {urls: "stun:stun.l.google.com:19302"},
            ],
        });

        peer.onconnectionstatechange = () => {
            console.log("connection:", peer.connectionState);
        };

        peer.oniceconnectionstatechange = () => {
            console.log("ice:", peer.iceConnectionState);
        };

        peerConnectionRef.current = peer;

        const stream = localStreamRef.current;

        stream ?.getTracks().forEach((track) => {
            console.log("adding track:", track.kind);
            peer.addTrack(track, stream);
        });

        // ice send
        peer.onicecandidate = (event) => {
            if(event.candidate) {
                socket.emit("ice-candidate", {roomId, candidate: event.candidate});
            }
        };

        // remote stream
        peer.ontrack = (event) => {
 
            let remoteStream = event.streams[0];

            console.log("stream active:", remoteStream?.active);
            console.log("video track:", remoteStream.getVideoTracks().length);
            console.log("video element:", remoteVideoRef.current);

            if(remoteVideoRef.current && remoteStream) {
                remoteVideoRef.current.srcObject = remoteStream;

                setTimeout(() => {
                    remoteVideoRef.current.play()
                    .then(() => console.log("video playing"))
                    .catch(err => console.log(err));
                }, 5000);
            }
        };

       
  
       return peer;
    }


    const leaveMeeting = async () => {

        if(localStreamRef.current){
            localStreamRef.current.getTracks()
            .forEach((track) => 
                track.stop()
            );
        }

        // peer close
       if(peerConnectionRef.current){
          peerConnectionRef.current.close();
       }

        offerSentRef.current = false;

        socket.disconnect();
        navigate("/dashboard");
    }

    // send message
    const sendMessage = () => {
        if(!chatText.trim()) return;

        const message = {
            sender: user?.name,
            text: chatText,
            time: new Date().toLocaleTimeString(),
        };

        socket.emit("send-message", {roomId, message});
        setChatText("");
    }

    const startMeeting = async (finalSummary, cleanTranscript, createdBy) => {

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/meetings/start`, {
                roomId, 
                participants: participants.map((p) => ({
                    name: p.user?.name,
                    email: p.user?.email
                })) ,
                transcript: cleanTranscript,
                summary: finalSummary,
                createdBy,
            });

            console.log("participants:", participants);

        } catch (error) {
            console.log("save meeting error:", error);
        }
    }

    const generateSummary = async () => {

        const cleanTranscript = messages.filter(m => m.sender !== "system")
        .map(m => `${m.sender}: ${m.text}`).join("\n");

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/summary`,{
                text: cleanTranscript
            });

            const summary = res.data.summary;

            if(!summary) return;

            setSummary(summary);

            await startMeeting(summary, cleanTranscript, user?.name);
        } catch ( error) {
            console.log("AI error:", error);
        }
    }

    // start recording
    const startRecording = () => {
        const stream = localStreamRef.current;
        if(!stream) return;

        const recorder = new MediaRecorder(stream);
        recorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) =>
        chunksRef.current.push(e.data);

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, {type: "video/webm"});

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "meeting-recording.webm";
            a.click();
        }

        recorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if(recorderRef.current) {
            recorderRef.current?.stop();
            setIsRecording(false);
        }
    }

    useEffect(() => {

        const timer = setInterval(() => {
           setMeetingTime((prev) => prev + 1);

        }, 1000);

        return () => clearInterval(timer);

    }, []);


    

    useEffect(() => {

        

     const startMeeting = async () => {

        if(meetingStartedRef.current) return;

        meetingStartedRef.current = true;
            try {
                // camera + mic access
                const stream = await navigator.mediaDevices.getUserMedia(
                   { 
                     video: true,
                     audio: true
                   }

                );

                localStreamRef.current = stream;


                // local video show
                if(localVideoRef.current){

                 localVideoRef.current.srcObject = stream;

                }
                

              
                // join socket room
                if(!user?.name) return;

                socket.emit("join-room", {roomId, 
                    user:{
                     name: user?.name,
                     email: user?.email,
                    },
                });

               

            } catch (error) {
                console.log(error);
            }
        };

        if(!user) return;

        startMeeting();

        

        // ======= socket events ======
       

        socket.on("offer", async ({offer}) => {

            console.log("offer recieved");
            let peer = peerConnectionRef.current;
           

            if(!peer) {
                peer = createPeer();
            }
            

            await peer.setRemoteDescription(
                new RTCSessionDescription(offer)
            );

            
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            

            socket.emit("answer", {roomId, answer});
        });

        socket.on("answer", async ({answer}) => {

            let peer = peerConnectionRef.current;

            if(!peer) return;

           await peer.setRemoteDescription(
            new RTCSessionDescription(answer)
           );             
        });

        socket.on("recieve-message", (message) => {
           
            setMessages((prev) => [
                ...prev, message
            ]);

            setTranscript((prev) => prev + "\n" + message.text);
        });


        socket.on("ice-candidate", async ({candidate}) => {

            const peer = peerConnectionRef.current;

            if(!peer) return;

            await peer.addIceCandidate(
                new RTCIceCandidate(candidate)
            );     
            
        });

       
        socket.on("room-users", async(users) => {
            console.log("users:", users);
            console.log("my socket:", socket.id);
            setParticipants(users);

           if(users.length === 2 && 
            users[0].socketId === socket.id
             && !offerSentRef.current) {

                offerSentRef.current = true;

                try {
                    let peer = peerConnectionRef.current;

                    if(!peer){
                        peer = createPeer();
                    }

                    const offer = await peer.createOffer();

                    await peer.setLocalDescription(offer);

                    socket.emit("offer", {roomId, offer}); 
                } catch (error) {
                    console.log("offer error:", error);
                }
            }
        });

        // system message
        socket.on("system-message", (data) => {

            setNotifications(data.message);

            setTimeout(() => {
                setNotifications("");
            }, 3000);
        });

        // meeting started
       //socket.on("meeting-started", (data) => {
        //    setMeetingTimeStart(data.startTime);
       // })

        // ======== cleanup =======
        return () => {
            socket.off("room-users");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
            socket.off("recieve-message");
            socket.off("raise-hand");
            socket.off("system-message");
           // socket.off("meeting-started");
           

            return () => {
                offerSentRef.current = false;

                if(localStreamRef.current){
                    localStreamRef.current.getTracks()
                    .forEach(track => track.stop());
                }

                if(peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            }
            

           
        };

      
    }, [user, roomId]);


    const formatTime = (seconds) => {
        const hrs = String(Math.floor(seconds/ 3600)).padStart(2, "0");
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");

        return `${hrs}:${mins}:${secs}`;
    }

    return ( 

        <DashboardLayout>

            {notifications && (
                    <div
                    style={{
                        
                        position: "fixed",
                        top: "30px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#2563eb",
                        color: "white",
                        padding: "12px 18px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                        fontWeight: "500",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        zIndex: 9999,
                        minWidth: "220px",
                        textAlign: "center",
                        
                    }}>
                        {notifications}
                    </div>
                )}

            <h2 style={{marginBottom:"16px"}}>Meeting Room</h2>

            <p style={{marginBottom:"20px"}}>Room ID: {roomId}</p>

            <p style={{fontSize: "18px", 
                fontWeight: "600",
                color: "#2563eb",
                marginBottom: "20px"
            }}>
                ⏱ Meeting Time: {formatTime(meetingTime)}
            </p>

            

            <button onClick={copyRoomId}
            className="copy-btn"
            style={{width:"220px",
                            height: "50px",
                            marginTop:"10px",
                            marginBottom:"24px",
                            background:"#2563eb",
                            fontSize: "17px",
                            fontWeight: "600",
                            color:"white",
                            borderRadius:"8px", border:"none",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
                        }}>
                Copy Meeting Code
            </button>
 

           <div className="video-wrapper">

                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="video-box"
                />

                {/* controls */}
                <div className="meeting-controls">

                    <button
                        onClick={toggleVideo}
                        className="control-btn"
                    >
                        {isVideoOff
                        ? <VideocamOffIcon />
                        : <VideocamIcon />}
                    </button>

                    <button
                        onClick={leaveMeeting}
                        className="control-btn leave-btn"
                    >
                        <CallEndIcon />
                    </button>

                    <button
                        onClick={toggleMute}
                        className="control-btn"
                    >
                        {isMuted
                        ? <MicOffIcon />
                        : <MicIcon />}
                    </button>

                    <button className="control-btn"
                    onClick={toggleShareScreen}>
                        {isSharing ? 
                        <StopScreenShareIcon/>:
                        <ScreenShareIcon/>}
                        
                    </button>

                    <button
                        className="control-btn"
                        onClick={() =>
                            setShowChat(
                            !showChat
                            )
                        }
                    >
                        <ChatIcon />
                    </button>

                    <button onClick={toggleRaiseHand}
                    className="control-btn"
                    style={{color:isHandRaised ? "#f4c430": "white"}}>
                       
                        <BackHandIcon /> 
                        
                    </button>

                    <button onClick={isRecording ? stopRecording :
                        startRecording}
                        className="control-btn"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 12px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            border: "none",
                            background: isRecording ? "red" : "white",
                            color: isRecording ? "white" : "red",
                            fontWeight: "bold"
                        }} >

                        {isRecording ? (
                            <>
                            <StopIcon />
                            
                            </>
                        ) : (
                            <>
                            <FiberManualRecordIcon />
                            
                            </>
                        )}
                    </button>

                    <button onClick={generateSummary} className="control-btn">
                        AI-S
                    </button>

                </div>

                {/* chat panel */}
                {showChat && (

                    <div className="chat-panel">

                        <h3 >Chat</h3>

                        <div className="chat-messages ">

                            {messages.map(
                            (msg, index) => (

                            <p key={index} className={`chat-message ${
                                msg.sender === "system" ? "system-message": ""
                            }`}>
                                
                                {msg.sender !== "system" && (
                                     <span className="chat-sender">
                                     {msg.sender}
                                </span>
                                )}
                               

                                <span className="chat-text">
                                    {msg.sender !== "system" && ":"}
                                     : &nbsp;{msg.text}
                                </span>
                            
                            </p>

                            ))}

                        </div>

                        <div className="chat-input-row">

                            <input
                            value={chatText}
                            onChange={(e) =>
                                setChatText(
                                    e.target.value
                                )
                            }
                            placeholder="Type message"
                            />

                            <button
                            onClick={sendMessage}
                            >
                            Send
                            </button>

                        </div>

                    </div>

                )}

            </div>

            <h3>Remote Video</h3>
             
            <video
                ref={remoteVideoRef}
                autoPlay
                muted
                playsInline
                className= "remote-video"
                style={{
                    width:"400px",
                    height:"300px",
                    background:"black",
                    border:"2px solid red",
                    borderRadius:"20px",
                    marginTop:"20px"
                }}
            />


                {summary && (
                    <div className="summary-box">
                        <h3>Meeting Summary</h3>

                        <pre>{summary}</pre>
                    </div>
                )}
                
           
            <h3 style={{marginTop:"24px", marginBottom:"16px"}}>
                Participants
            </h3>
            

            <div className="dashboard-grid">
               {participants.map((item) => {

                //console.log("participant item:", item);

               return <ParticipantCard
                key={`${item.socketId}-${item.user?.email}`}
                user={item.user} 
                muted={item.muted}
                isHandRaised={item.handRaised }/>
             })}
            </div>
        </DashboardLayout>
     );
}

export default MeetingRoomPage;