const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./model/User");

dotenv.config();

const setupUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existingUser = await User.findOne();
    if (existingUser) {
      console.log("User already exists");
      process.exit(0);
    }

    const pin = process.env.ADMIN_PIN || "7860";
    const hashedPin = await bcrypt.hash(pin, 10);

    await User.create({
      pin: hashedPin,
      attempts: 0,
      lockUntil: null
    });

    console.log(`User created successfully with PIN: ${pin}`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

setupUser();
