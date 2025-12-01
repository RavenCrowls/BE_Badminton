const { Roles } = require('../models');

const createRoles = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newRoles = await Roles.create({
      name,
      description
    });
    res.status(201).send(newRoles);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roleslist = await Roles.findAll();
    res.status(200).send(roleslist);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDetailRoles = async (req, res) => {
  const { id } = req.params;
  try {
    const detailRoles = await Roles.findOne({
      where: { id }
    });
    res.status(200).send(detailRoles);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateRoles = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const detailRoles = await Roles.findOne({
      where: { id }
    });
    detailRoles.name = name;
    detailRoles.description = description;
    await detailRoles.save();
    res.status(200).send(detailRoles);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteRoles = async (req, res) => {
  const { id } = req.params;
  try {
    await Roles.destroy({
      where: { id }
    });
    res.status(200).send('Deleted successfully');
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createRoles,
  getAllRoles,
  getDetailRoles,
  updateRoles,
  deleteRoles
};
