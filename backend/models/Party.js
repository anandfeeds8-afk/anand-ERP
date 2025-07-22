const mongoose = require('mongoose');
const PartySchema = new mongoose.Schema({
  name: String,
  location: String
}, { timestamps: true });

module.exports = mongoose.model('Party', PartySchema);
