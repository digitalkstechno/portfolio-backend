const MobileApp = require("../model/MobileApp");
const path = require("path");
const fs = require("fs");

exports.create = async (req, res) => {
  try {
    const { title, androidLink, iosLink, description, language, software } = req.body;
    
    const data = {
      title,
      androidLink,
      iosLink,
      description,
      language,
      software,
      image: req.file ? `/images/MobileApps/${req.file.filename}` : null
    };

    const app = await MobileApp.create(data);
    res.status(201).json({ success: true, data: app });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const apps = await MobileApp.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: apps.length, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const app = await MobileApp.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: "App not found" });
    }
    res.status(200).json({ success: true, data: app });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const app = await MobileApp.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: "App not found" });
    }

    const { title, androidLink, iosLink, description, language, software } = req.body;
    
    if (req.file) {
      if (app.image) {
        const oldImagePath = path.join(__dirname, "../public", app.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      app.image = `/images/MobileApps/${req.file.filename}`;
    }

    app.title = title || app.title;
    app.androidLink = androidLink !== undefined ? androidLink : app.androidLink;
    app.iosLink = iosLink !== undefined ? iosLink : app.iosLink;
    app.description = description || app.description;
    app.language = language || app.language;
    app.software = software || app.software;

    await app.save();
    res.status(200).json({ success: true, data: app });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const app = await MobileApp.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: "App not found" });
    }

    if (app.image) {
      const imagePath = path.join(__dirname, "../public", app.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await MobileApp.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "App deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
