const mongoose = require("mongoose");
require("dotenv").config;
const connectDB = async () => {
  const conn = await mongoose.connect(
    "mongodb+srv://Waleedabid:Waleed123@cluster0.kzkfk.mongodb.net/social?retryWrites=true&w=majority"
  );

  console.log(`Mongo DB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
