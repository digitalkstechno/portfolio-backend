const Project = require("../model/Project");
const path = require("path");
const fs = require("fs");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { title, link, description, language, credentials } = req.body;
    
    const projectData = {
      title,
      link,
      description,
      language,
      credentials: credentials || [],
      image: req.file ? `/images/Projects/${req.file.filename}` : null
    };

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All Projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const { title, link, description, language, credentials } = req.body;
    
    if (req.file) {
      // Delete old image
      if (project.image) {
        const oldImagePath = path.join(__dirname, "../public", project.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      project.image = `/images/Projects/${req.file.filename}`;
    }

    project.title = title || project.title;
    project.link = link || project.link;
    project.description = description || project.description;
    project.language = language || project.language;
    if (credentials !== undefined) project.credentials = credentials;

    await project.save();
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Delete image
    if (project.image) {
      const imagePath = path.join(__dirname, "../public", project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
