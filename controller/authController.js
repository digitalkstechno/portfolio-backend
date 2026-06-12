const User = require("../model/User");
const Admin = require("../model/Admin");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ success: false, message: "PIN must be exactly 4 digits" });
    }

    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = pin === process.env.ADMIN_PIN || await user.comparePin(pin);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid PIN" 
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      success: true, 
      token,
      message: "Login successful" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Welcome to dashboard",
    user: { id: req.userId }
  });
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = await Admin.findOne();
    }

    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin account not initialized in DB" });
    }

    const token = jwt.sign(
      { adminId: admin._id, email: email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({ 
      success: true, 
      token,
      admin: { id: admin._id, email: email },
      message: "Admin login successful" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
