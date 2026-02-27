const express = require("express");
const router = express.Router();

const projectRoutes = require("./projectRoutes");
const authRoutes = require("./authRoutes");
const mobileAppRoutes = require("./mobileAppRoutes");
const digitalCardRoutes = require("./digitalCardRoutes");
const marketingClientRoutes = require("./marketingClientRoutes");
const softwareRoutes = require("./softwareRoutes");
const figmaRoutes = require("./figmaRoutes");

router.use("/projects", projectRoutes);
router.use("/auth", authRoutes);
router.use("/mobile-apps", mobileAppRoutes);
router.use("/digital-cards", digitalCardRoutes);
router.use("/marketing-clients", marketingClientRoutes);
router.use("/software", softwareRoutes);
router.use("/figma-designs", figmaRoutes);

module.exports = router;
