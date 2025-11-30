const { Orders, Users, Payment } = require('../models');
const { Op } = require('sequelize');

const createOrder = async (req, res) => {
  try {
    const { userid, totalprice, phonenumber, address, promotionid, status } = req.body;
    const newOrder = await Orders.create({
      userid,
      totalprice,
      phonenumber,
      address,
      promotionid,
      status
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (_req, res) => {
  try {
    const orders = await Orders.findAll({
      include: [{ model: Users, attributes: ['name', 'phonenumber'] }, { model: Payment }]
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const detailOrder = await Orders.findOne({
      where: { id },
      include: [{ model: Users, attributes: ['name', 'phonenumber'] }, { model: Payment }]
    });
    res.status(200).send(detailOrder);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOrderByUserId = async (req, res) => {
  const { userid } = req.params;
  try {
    const orders = await Orders.findAll({
      where: { userid },
      include: [{ model: Users, attributes: ['name', 'phonenumber'] }, { model: Payment }]
    });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { userid, totalprice, phonenumber, address, promotionid, status, process, shipping, delivered } = req.body;
  try {
    const detailOrder = await Orders.findOne({ where: { id } });
    if (!detailOrder) return res.status(404).send('Not found');
    detailOrder.userid = userid;
    detailOrder.totalprice = totalprice;
    detailOrder.phonenumber = phonenumber;
    detailOrder.address = address;
    detailOrder.promotionid = promotionid;
    detailOrder.status = status;
    detailOrder.process = process;
    detailOrder.shipping = shipping;
    detailOrder.delivered = delivered;
    await detailOrder.save();
    res.status(200).send(detailOrder);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const detailOrder = await Orders.findOne({ where: { id } });
    if (!detailOrder) return res.status(404).send('Not found');
    await detailOrder.destroy();
    res.status(200).send('Deleted successfully');
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTotalOrderAmount = async (req, res) => {
  const { from, to } = req.query;
  try {
    const total = await Orders.sum('totalprice', {
      where: {
        createdAt: {
          [Op.gte]: new Date(from),
          [Op.lte]: new Date(to)
        },
        status: 1
      }
    });
    res.status(200).json({ totalOrderAmount: total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByUserId,
  getTotalOrderAmount
};
