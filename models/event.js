const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: String,
    required: true,
  },
  executionTime: {
    type: String,
    required: true,
  },
  activeTime: {
    type: String,
    required: true,
  },
  employeesInProcess: {
    type: String,
    required: true,
  },
  scriptsInProcess: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  loading: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);
