const MarketingClient = require("../model/MarketingClient");
const path = require("path");
const fs = require("fs");

exports.create = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    
    const data = {
      title,
      description,
      link,
      image: req.file ? `/images/MarketingClients/${req.file.filename}` : null
    };

    const client = await MarketingClient.create(data);
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const clients = await MarketingClient.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const client = await MarketingClient.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const client = await MarketingClient.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    const { title, description, link } = req.body;
    
    if (req.file) {
      if (client.image) {
        const oldImagePath = path.join(__dirname, "../public", client.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      client.image = `/images/MarketingClients/${req.file.filename}`;
    }

    client.title = title || client.title;
    client.description = description || client.description;
    client.link = link || client.link;

    await client.save();
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const client = await MarketingClient.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    if (client.image) {
      const imagePath = path.join(__dirname, "../public", client.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await MarketingClient.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
