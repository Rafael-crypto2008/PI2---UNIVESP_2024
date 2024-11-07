// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');

// Rota para criar um novo agendamento
router.post('/appointments', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para obter todos os agendamentos
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para atualizar um agendamento por ID
router.put('/appointments/:id', async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para deletar um agendamento por ID
router.delete('/appointments/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Agendamento deletado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
