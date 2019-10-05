const Spot = require('../models/Spot')
const User = require('../models/User')
const Booking = require('../models/Booking')

module.exports = {
  async store(req, res) {
    const { userid } = req.headers
    const { spotId } = req.params
    const { date } = req.body

    const userFromDb = await User.findById(userid)
    if (!userFromDb) return res.status(400).json({ error: 'User does not exist' })

    const spotFromDb = await Spot.findById(spotId)
    if (!spotFromDb) return res.status(400).json({ erro: 'Spot does not exist' })

    const booking = await Booking.create({
      user: userid,
      spot: spotId,
      date
    })

    await booking.populate('spot').populate('user').execPopulate()

    const ownerSocket = req.connectedUsers[booking.spot.user]

    if (ownerSocket) {
      req.io.to(ownerSocket).emit('booking_request', booking)
    }

    return res.json(booking)
  }
}