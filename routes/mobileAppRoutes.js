const express = require("express");
const router = express.Router();
const createUploader = require("../utils/multer");
const { create, getAll, getOne, update, delete: deleteApp } = require("../controller/mobileAppController");

const upload = createUploader("images/MobileApps");

router.post("/", upload.single("image"), create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", upload.single("image"), update);
router.delete("/:id", deleteApp);

module.exports = router;
