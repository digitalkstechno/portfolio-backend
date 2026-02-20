const express = require("express");
const router = express.Router();
const createUploader = require("../utils/multer");
const {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject
} = require("../controller/projectController");

const upload = createUploader("images/Projects");

router.post("/", upload.single("image"), createProject);
router.get("/", getAllProjects);
router.get("/:id", getProject);
router.put("/:id", upload.single("image"), updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
