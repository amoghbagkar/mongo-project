let mongoose = require("mongoose");

let ProjectSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user_details",
    unique: false,
  },
  project_name: {
    type: String,
  },
  project_desc: {
    type: String,
  },
  status: {
    type: String,
    enum: ["progress", "pending", "done"],
    default: "pending",
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

module.exports = mongoose.model("project_details", ProjectSchema);
