const mongoose = require("mongoose");
require("dotenv").config;
const connectDB = async () => {
  const conn = await mongoose.connect(
    process.env.mongoUri
  );

  console.log(`Mongo DB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
