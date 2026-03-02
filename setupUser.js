const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./model/User");

dotenv.config();

const setupUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    console.log("Deleted existing users");

    const pin = process.env.ADMIN_PIN || "1996";
    const hashedPin = await bcrypt.hash(pin, 10);

    await User.create({
      pin: hashedPin,
      attempts: 0,
      lockUntil: null
    });

    console.log(`User created successfully with new PIN`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

setupUser();
