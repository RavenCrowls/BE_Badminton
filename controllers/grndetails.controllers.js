const { GrnDetails, Products, Grns } = require('../models');

const createGRNDetails = async (req, res) => {
  try {
    const { grnid, productid, price, quantity } = req.body;
    const newGRNDetails = await GrnDetails.create({ grnid, productid, price, quantity });

    const product = await Products.findOne({ where: { id: productid } });
    if (product) {
      product.quantity += quantity;
      await product.save();
    }

    const grn = await Grns.findByPk(grnid);
    if (grn) {
      grn.totalprice += price * quantity;
      await grn.save();
    }

    res.status(201).json(newGRNDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getlistGRNDetails = async (req, res) => {
  const { grnid } = req.params;
  try {
    const grnDetails = await GrnDetails.findAll({
      where: { grnid },
      include: [{ model: Products, attributes: ['id', 'name', 'price', 'description', 'brand'] }]
    });
    res.status(200).send(grnDetails);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getGRNDetailsById = async (req, res) => {
  const { id, grnid } = req.params;
  try {
    const detailGRNDetails = await GrnDetails.findOne({
      where: { id, grnid },
      include: [{ model: Products, attributes: ['id', 'name', 'price', 'description', 'brand'] }]
    });
    res.status(200).send(detailGRNDetails);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateGRNDetails = async (req, res) => {
  const { id, grnid } = req.params;
  const { productid, price, quantity } = req.body;
  try {
    const detailGRNDetails = await GrnDetails.findOne({ where: { id, grnid } });
    if (!detailGRNDetails) return res.status(404).send('Not found');
    detailGRNDetails.productid = productid;
    detailGRNDetails.price = price;
    detailGRNDetails.quantity = quantity;
    await detailGRNDetails.save();
    res.status(200).send(detailGRNDetails);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteGRNDetails = async (req, res) => {
  const { id, grnid } = req.params;
  try {
    const detailGRNDetails = await GrnDetails.findOne({ where: { id, grnid } });
    if (!detailGRNDetails) return res.status(404).send('Not found');

    const product = await Products.findByPk(detailGRNDetails.productid);
    if (product) {
      product.quantity -= detailGRNDetails.quantity;
      await product.save();
    }

    const grn = await Grns.findByPk(grnid);
    if (grn) {
      grn.totalprice -= detailGRNDetails.price * detailGRNDetails.quantity;
      await grn.save();
    }

    await detailGRNDetails.destroy();
    res.status(200).send('Deleted successfully');
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createGRNDetails,
  getlistGRNDetails,
  getGRNDetailsById,
  updateGRNDetails,
  deleteGRNDetails
};
