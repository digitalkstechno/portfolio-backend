const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { login, getDashboard, adminLogin } = require("../controller/authController");
const authMiddleware = require("../middleware/pinAuth");

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10,
//   message: { success: false, message: "Too many login attempts. Try again after 15 minutes" }
// });

router.post("/login", login);
router.post("/admin/login", adminLogin);
router.get("/dashboard", authMiddleware, getDashboard);

module.exports = router;
