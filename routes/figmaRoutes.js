const express = require("express");
const router = express.Router();
const createUploader = require("../utils/multer");
const { create, getAll, getOne, update, delete: del } = require("../controller/figmaController");

const upload = createUploader("images/Figma");

router.post("/", upload.single("image"), create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", upload.single("image"), update);
router.delete("/:id", del);

module.exports = router;
