const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  property: { type: String, required: true },
  client: { type: String, required: true },
  agent: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  price: { type: String, required: true },
  clauses: [{ type: String, required: true }]
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;