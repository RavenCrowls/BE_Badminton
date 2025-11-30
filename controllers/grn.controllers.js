const { Grns } = require('../models');
const { Op } = require('sequelize');

const createGRN = async (req, res) => {
  try {
    const { date, totalprice, userid } = req.body;
    const newGRN = await Grns.create({ date, totalprice, userid });
    res.status(201).send(newGRN);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllGRNs = async (_req, res) => {
  try {
    const grns = await Grns.findAll();
    res.status(200).send(grns);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getGRNById = async (req, res) => {
  const { id } = req.params;
  try {
    const detailGRNs = await Grns.findOne({ where: { id } });
    res.status(200).send(detailGRNs);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateGRN = async (req, res) => {
  const { id } = req.params;
  const { date, totalprice, userid } = req.body;
  try {
    const detailGRNs = await Grns.findOne({ where: { id } });
    if (!detailGRNs) return res.status(404).send('Not found');
    detailGRNs.date = date;
    detailGRNs.totalprice = totalprice;
    detailGRNs.userid = userid;
    await detailGRNs.save();
    res.status(200).send(detailGRNs);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteGRN = async (req, res) => {
  const { id } = req.params;
  try {
    const detailGRNs = await Grns.findOne({ where: { id } });
    if (!detailGRNs) return res.status(404).send('Not found');
    await detailGRNs.destroy();
    res.status(200).send('Deleted successfully');
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTotalGRNAmount = async (req, res) => {
  const { from, to } = req.query;
  try {
    const total = await Grns.sum('totalprice', {
      where: {
        createdAt: {
          [Op.gte]: new Date(from),
          [Op.lte]: new Date(to)
        }
      }
    });
    res.status(200).json({ totalGRNAmount: total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createGRN,
  getAllGRNs,
  getGRNById,
  updateGRN,
  deleteGRN,
  getTotalGRNAmount
};
