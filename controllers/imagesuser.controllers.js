const { Imagesuser } = require("../models");
const cloudinary = require("cloudinary").v2;

const createImageUser = async (req, res) => {
  try {
    const { userid } = req.body;
    const url = req.file.path;
    console.log(req.file);

    const newImageUser = await Imagesuser.create({
      userid,
      url,
    });

    res.status(201).json(newImageUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changeImageUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const url = req.file.path;

    const imageUser = await Imagesuser.findOne({
      where: { userid: userid },
    });

    if (!imageUser) {
      return res.status(404).send({ message: "Image not found" });
    }

    // Lấy public_id đúng từ url
    const uploadIndex = imageUser.url.indexOf("/upload/");
    let publicId = imageUser.url.substring(uploadIndex + 8);
    publicId = publicId.replace(/^v\d+\//, "");
    publicId = publicId.replace(/\.[^/.]+$/, "");

    // Xóa ảnh cũ trên Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Cập nhật URL mới
    imageUser.url = url;
    await imageUser.save();

    res.status(200).json(imageUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createImageUser,
  changeImageUser,
};
