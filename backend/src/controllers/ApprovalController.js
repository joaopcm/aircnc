const Booking = require('../models/Booking')

module.exports = {
  async store(req, res) {
    const { bookingId } = req.params

    const booking = await Booking.findById(bookingId).populate('spot')
    if (!booking) return res.status(400).json({ error: 'Booking does not exist' })

    booking.approved = true

    await booking.save()

    const bookingUserSocket = req.connectedUsers[booking.user]

    if (bookingUserSocket) {
      req.io.to(bookingUserSocket).emit('booking_response', booking)
    }

    return res.json(booking)
  }
}