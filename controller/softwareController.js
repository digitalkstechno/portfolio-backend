const Software = require("../model/Software");
const { uploadToExternalService, updateFileOnExternalService, deleteFileFromExternalService } = require("../utils/externalUpload");

exports.create = async (req, res) => {
  try {
    const { title, description, link, credentials } = req.body;
    
    const imageUrl = req.file ? await uploadToExternalService(req.file, "Software") : null;

    const data = {
      title,
      description,
      link,
      credentials: credentials || [],
      image: imageUrl
    };

    const software = await Software.create(data);
    res.status(201).json({ success: true, data: software });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const softwares = await Software.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: softwares.length,
      data: softwares,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    const software = await Software.findById(req.params.id);
    if (!software) {
      return res.status(404).json({ success: false, message: "Software not found" });
    }
    res.status(200).json({ success: true, data: software });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const software = await Software.findById(req.params.id);
    if (!software) {
      return res.status(404).json({ success: false, message: "Software not found" });
    }

    const {  title, description, link, credentials } = req.body;
    
    if (req.file) {
      software.image = await updateFileOnExternalService(software.image, req.file);
    }

    software.title = title || software.title;
    software.description = description || software.description;
    software.link = link || software.link;
    if (credentials !== undefined) software.credentials = credentials;

    await software.save();
    res.status(200).json({ success: true, data: software });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const software = await Software.findById(req.params.id);
    if (!software) {
      return res.status(404).json({ success: false, message: "Software not found" });
    }

    if (software.image) {
      await deleteFileFromExternalService(software.image);
    }

    await Software.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Software deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
