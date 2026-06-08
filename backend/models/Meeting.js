
const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },

    participants: [
        {
            name: String,
            email: String,
        }
    ],

   transcript: String,

   summary: String,

   createdBy: String,

}, {timestamps: true});

module.exports = mongoose.model("Meeting", meetingSchema);