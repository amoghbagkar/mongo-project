const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());
require("dotenv").config();

// Models
require("./model/user");
require("./model/project");

//Routes
const userRouter = require("./routes/user");
const projectRouter = require("./routes/project");

app.use("/user", userRouter);
app.use("/project", projectRouter);

/* MONGODB CONNECTION */
mongoose
  .connect("mongodb://localhost:27017/", {
    dbName: "mongo-nodejs",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Our app is running on port number ${PORT}`);
});
