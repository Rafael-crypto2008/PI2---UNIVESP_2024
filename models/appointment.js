const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  nomeCliente: { type: String, required: true },
  telefone: { type: String, required: true },
  data: { type: String, required: true },
  hora: { type: String, required: true },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
