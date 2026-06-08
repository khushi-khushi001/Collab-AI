const express = require("express");

const router = express.Router();

const {startMeeting,  getMeetings,/*endMeeting, getMeetingById*/} = require("../controllers/meetingController");

router.post("/start", startMeeting);

/*router.post("/end", endMeeting);*/

router.get("/history", getMeetings);

/*router.get("/:id", getMeetingById );*/

module.exports = router;