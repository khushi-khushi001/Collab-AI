const Meeting = require("../models/Meeting");
const meeting = require("../models/Meeting");

const startMeeting = async (req, res) => {

    try {
        
        const {roomId, participants, transcript, summary, createdBy} = req.body;

        const existingMeeting = await Meeting.findOne({roomId});

        if(existingMeeting){
            return res.status(200).json(existingMeeting);
        }

        const meeting = await Meeting.create({
            roomId, 
            participants,
            transcript,
            summary,
            createdBy,
        });

        res.json({sucess: true, meeting});

    } catch (error) {
        
        console.log(error);
        res.status(500).json({message: "Meeting failed",});
    }
};

/*const endMeeting = async (req, res) => {

    try {
        
        const {roomId, participants} = req.body;

        const meeting = await Meeting.findOne({roomId });

        if(!meeting) {
            return res.status(404).json({message: "Meeting not found"});
        }

        const endTime = new Date();

        const duration = Math.floor((endTime - meeting.startTime) / 1000);

        meeting.endTime = endTime;
        meeting.duration = duration;

        meeting.participants = participants.map((item) => item.user?.name);

        await meeting.save();
        res.status(200).json(meeting);
    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
};*/

const getMeetings = async (req, res) => {

    try {
        
        const meetings = await Meeting.find().sort({createdAt: -1});

        res.status(200).json(meetings);

    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
}

/*const getMeetingById = async (req, res) => {

    try {
        
        const meeting = await Meeting.findById(req.params.id);

        if(!meeting) {
            return res.status(404).json({message: "Meeting not found"});
        }

        res.status(200).json(meeting);

    } catch (error) {
        
        res.status(500).json({message: error.message});
    }
}*/
module.exports = {startMeeting, getMeetings};