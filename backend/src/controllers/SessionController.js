const User = require('../models/User')

module.exports = {
  // index, show, store, update, destroy
  async store(req, res) {
    const { email } = req.body
    const filter = { email }
    const dataToUpsert = { email }

    const user = await User.findOneAndUpdate(filter, dataToUpsert, {
      new: true,
      upsert: true,
      useFindAndModify: false
    })

    return res.json(user)
  }
}