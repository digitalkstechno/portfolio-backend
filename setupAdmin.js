const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Admin = require("./model/Admin");

dotenv.config();

const setupAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error("Please set ADMIN_EMAIL and ADMIN_PASSWORD in .env file");
      process.exit(1);
    }

    // Delete existing admin
    await Admin.deleteMany({});
    console.log("Deleted existing admins");

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword
    });

    console.log(`Admin created successfully`);
    console.log(`Email: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

setupAdmin();
