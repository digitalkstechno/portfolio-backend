const MarketingClient = require("../model/MarketingClient");
const { uploadToExternalService, updateFileOnExternalService, deleteFileFromExternalService } = require("../utils/externalUpload");

exports.create = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    
    const imageUrl = req.file ? await uploadToExternalService(req.file, "MarketingClients") : null;

    const data = {
      title,
      description,
      link,
      image: imageUrl
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
      client.image = await updateFileOnExternalService(client.image, req.file);
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
      await deleteFileFromExternalService(client.image);
    }

    await MarketingClient.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
