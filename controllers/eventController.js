const { Event, Booking, User } = require("../models");
const { Op } = require("sequelize");

exports.createEvent = async (req, res) => {
  try {
    // Admin authorization check
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        error: "Not authorized",
        message: "Only admins can create events" 
      });
    }

    // Input validation
    const { name, venue, date_time, available_seats } = req.body;
    if (!name || !venue || !date_time || !available_seats) {
      return res.status(400).json({ 
        success: false,
        error: "Validation error",
        message: "All fields (name, venue, date_time, available_seats) are required"
      });
    }

    const event = await Event.create({
      name,
      venue,
      date_time: new Date(date_time),
      available_seats: parseInt(available_seats),
      vendor: req.body.vendor || null,
      description: req.body.description || null
    });

    res.status(201).json({
      success: true,
      data: event,
      message: "Event created successfully"
    });

  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: error.message 
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: {
        date_time: { [Op.gte]: new Date() }
      },
      order: [['date_time', 'ASC']]
    });

    res.json({
      success: true,
      count: events.length,
      data: events
    });

  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: error.message 
    });
  }
};

exports.bookEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!eventId) {
      return res.status(400).json({ 
        success: false,
        error: "Validation error",
        message: "eventId is required" 
      });
    }

    const event = await Event.findByPk(eventId);
    
    if (!event) {
      return res.status(404).json({ 
        success: false,
        error: "Not found",
        message: "Event not found" 
      });
    }
    
    if (event.available_seats <= 0) {
      return res.status(400).json({ 
        success: false,
        error: "Booking error",
        message: "No seats available" 
      });
    }

    // Check for existing booking
    const existingBooking = await Booking.findOne({
      where: { userId, eventId }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        error: "Booking error",
        message: "You have already booked this event"
      });
    }
    
    const booking = await Booking.create({
      userId,
      eventId,
      status: 'confirmed'
    });
    
    await event.decrement('available_seats');
    
    res.status(201).json({
      success: true,
      data: booking,
      message: "Event booked successfully"
    });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: error.message 
    });
  }
};

exports.getEventBookings = async (req, res) => {
  try {
    // Admin authorization check
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        error: "Not authorized",
        message: "Only admins can view bookings" 
      });
    }

    const bookings = await Booking.findAll({
      where: { eventId: req.params.eventId },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email'],
        as: 'user'
      }],
      order: [['booking_date', 'DESC']]
    });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: error.message 
    });
  }
};