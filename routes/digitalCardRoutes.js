const express = require("express");
const router = express.Router();
const createUploader = require("../utils/multer");
const { create, getAll, getOne, update, delete: deleteCard } = require("../controller/digitalCardController");

const upload = createUploader("images/DigitalCards");

router.post("/", upload.single("image"), create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", upload.single("image"), update);
router.delete("/:id", deleteCard);

module.exports = router;
