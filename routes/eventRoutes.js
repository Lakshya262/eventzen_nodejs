const express = require("express");
const router = express.Router();
const { 
  createEvent,
  getAllEvents,
  bookEvent,
  getEventBookings 
} = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createEvent);
router.get("/", getAllEvents);
router.post("/book", protect, bookEvent);
router.get("/:eventId/bookings", protect, getEventBookings); 

module.exports = router;