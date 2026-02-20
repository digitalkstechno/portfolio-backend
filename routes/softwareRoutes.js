const express = require("express");
const router = express.Router();
const createUploader = require("../utils/multer");
const { create, getAll, getOne, update, delete: deleteSoftware } = require("../controller/softwareController");

const upload = createUploader("images/Software");

router.post("/", upload.single("image"), create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", upload.single("image"), update);
router.delete("/:id", deleteSoftware);

module.exports = router;
