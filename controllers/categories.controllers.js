const { Categories } = require('../models');

const createCategories = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategories = await Categories.create({ name, description });
    res.status(201).send(newCategories);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categorieslist = await Categories.findAll();
    res.status(200).send(categorieslist);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateCategories = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const detailCategories = await Categories.findOne({
      where: { id }
    });
    detailCategories.name = name;
    detailCategories.description = description;
    await detailCategories.save();
    res.status(200).send(detailCategories);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDetailCategories = async (req, res) => {
  const { id } = req.params;
  try {
    const detailCategories = await Categories.findOne({
      where: { id }
    });
    res.status(200).send(detailCategories);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteCategories = async (req, res) => {
  const { id } = req.params;
  try {
    await Categories.destroy({
      where: { id }
    });
    res.status(200).send('Deleted successfully');
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createCategories,
  getAllCategories,
  getDetailCategories,
  updateCategories,
  deleteCategories
};
