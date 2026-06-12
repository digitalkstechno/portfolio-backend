const Figma = require("../model/Figma");
const { uploadToExternalService, updateFileOnExternalService, deleteFileFromExternalService } = require("../utils/externalUpload");

exports.create = async (req, res) => {
  try {
    const { link, title, type } = req.body;
    if (!link) {
      return res.status(400).json({ success: false, message: "Link is required" });
    }
    
    const imageUrl = req.file ? await uploadToExternalService(req.file, "Figma") : null;

    const data = {
      title: title || null,
      link,
      image: imageUrl,
      type: ["application", "web", "saas-dashboard"].includes(type) ? type : undefined,
    };
    const entity = await Figma.create(data);
    res.status(201).json({ success: true, data: entity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type && ["application", "web", "saas-dashboard"].includes(req.query.type)) {
      filter.type = req.query.type;
    }
    const items = await Figma.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const item = await Figma.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Figma item not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Figma.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Figma item not found" });
    }
    const { link, title, type } = req.body;
    if (req.file) {
      item.image = await updateFileOnExternalService(item.image, req.file);
    }
    if (link) item.link = link;
    if (title !== undefined) item.title = title || null;
    if (type && ["application", "web", "saas-dashboard"].includes(type)) {
      item.type = type;
    }
    await item.save();
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await Figma.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Figma item not found" });
    }
    if (item.image) {
      await deleteFileFromExternalService(item.image);
    }
    await Figma.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Figma item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
