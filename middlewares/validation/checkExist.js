const checkExist = (Model) => {
  return async (req, res, next) => {
    const { id } = req.params;
    const products = await Model.findOne({
      where: { id },
    });
    if (products) {
      next();
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  };
};

module.exports = {
  checkExist,
};
