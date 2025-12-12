const { Imagesproduct } = require("../models");
const cloudinary = require("cloudinary").v2;

const createImageProduct = async (req, res) => {
  try {
    const { productid } = req.body;
    const url = req.file.path;
    console.log(req.file);

    const newImageProduct = await Imagesproduct.create({
      productid,
      url,
    });

    res.status(201).json(newImageProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteImageProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const imageProduct = await Imagesproduct.findOne({
      where: { id },
    });

    if (!imageProduct) {
      return res.status(404).send({ message: "Image not found" });
    }

    // Lấy public_id đúng từ url
    // VD: https://res.cloudinary.com/demo/image/upload/v123456789/myfolder/abcxyz.jpg
    const url = imageProduct.url;
    const uploadIndex = url.indexOf("/upload/");
    let publicId = url.substring(uploadIndex + 8); // 8 là độ dài "/upload/"
    // Bỏ version nếu có (v123456789/)
    publicId = publicId.replace(/^v\d+\//, "");
    // Bỏ phần mở rộng
    publicId = publicId.replace(/\.[^/.]+$/, "");

    // Xóa ảnh trên Cloudinary
    await cloudinary.uploader.destroy(publicId);

    await imageProduct.destroy();

    res.status(200).send({
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createImageProduct, deleteImageProduct };
