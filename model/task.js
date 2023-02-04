let mongoose = require("mongoose");
let ObjectId = require('mongodb').ObjectId

let TaskSchema = new mongoose.Schema({
    project_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "project_details",
      unique: false
    },
    task_name: {
      type: String,
    },
    task_desc: {
      type: String,
    },
    priority: {
      type: Number,
      default: 0
    },
    status: {
        type: String,
        enum: ['progress', 'pending', 'done'],
        default: 'pending'
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    updated_at: {
      type: Date,
      default: Date.now(),
    },
  });

  module.exports = mongoose.model("task_details", TaskSchema);
  