require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//Importing Routes
const authRoutes = require("./routes/Auth");
const userRoutes = require("./routes/User");

//Decalring APP as an express app
const app = express();
const PORT = process.env.PORT || 8000;

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Mongoose Connection
//TODO: Add MongoDB database's connection link
const DATABASE = process.env.DATABASE;
mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED!");
  })
  .catch((error) => {
    console.log("Problem with connecting to Database:", error);
  });

//Using routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

//listening to PORT
app.listen(PORT, () => {
  console.log("Server is running at port:", PORT);
});
