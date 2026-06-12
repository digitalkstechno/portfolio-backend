const DigitalCard = require("../model/DigitalCard");
const { uploadToExternalService, updateFileOnExternalService, deleteFileFromExternalService } = require("../utils/externalUpload");

exports.create = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    
    const imageUrl = req.file ? await uploadToExternalService(req.file, "DigitalCards") : null;

    const data = {
      title,
      description,
      link,
      image: imageUrl
    };

    const card = await DigitalCard.create(data);
    res.status(201).json({ success: true, data: card });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const cards = await DigitalCard.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const card = await DigitalCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }
    res.status(200).json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const card = await DigitalCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }

    const { title, description, link } = req.body;
    
    if (req.file) {
      card.image = await updateFileOnExternalService(card.image, req.file);
    }

    card.title = title || card.title;
    card.description = description || card.description;
    card.link = link || card.link;

    await card.save();
    res.status(200).json({ success: true, data: card });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const card = await DigitalCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }

    if (card.image) {
      await deleteFileFromExternalService(card.image);
    }

    await DigitalCard.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
