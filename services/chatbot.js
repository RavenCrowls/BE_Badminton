const { Products, Orders } = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
require("dotenv").config();

const searchProductsInDB = async (keyword, message) => {
  // Nếu message chứa "khoảng" và có số
  const khoangMatch = message.match(/khoảng\s*(\d+)/i);
  if (khoangMatch) {
    const price = parseInt(khoangMatch[1]);
    return await Products.findAll({
      where: {
        price: {
          [Op.between]: [price - 200000, price + 200000],
        },
      },
      limit: 10,
    });
  }
  return await Products.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
        { price: { [Op.like]: `%${keyword}%` } }, // nếu người dùng nhập số, có thể là giá
      ],
    },
    limit: 10,
  });
};

const isProductSearch = (message) => {
  const searchKeywords = [
    "tìm",
    "search",
    "sản phẩm",
    "product",
    "mua",
    "buy",
    "giá",
    "có",
    "vnd",
    "khoảng",
  ];
  return searchKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword)
  );
};

const extractSearchTerm = (message) => {
  const keywords = [
    "tìm",
    "search",
    "sản phẩm",
    "product",
    "mua",
    "buy",
    "giá",
    "có",
    "vnd",
    "khoảng",
  ];
  let searchTerm = message.toLowerCase();
  keywords.forEach((keyword) => {
    searchTerm = searchTerm.replace(keyword, "").trim(); // bỏ keyword để lấy phần còn lại
  });
  return searchTerm;
};

const handlechat = async (req, res) => {
  const { message, userid } = req.body; // nhận input từ FE

  // Các từ khóa kiểm tra đơn hàng
  const orderKeywords = [
    "kiểm tra đơn hàng",
    "đơn hàng của tôi",
    "tình trạng đơn hàng",
  ];

  // Kiểm tra message có chứa từ khóa không (không phân biệt hoa thường)
  if (
    orderKeywords.some((keyword) => message.toLowerCase().includes(keyword))
  ) {
    // Tìm đơn hàng gần nhất của user
    const order = await Orders.findOne({
      where: { userid },
      order: [["createdAt", "DESC"]],
    });

    if (!order) {
      return res.json({ message: "Bạn chưa có đơn hàng nào." });
    }

    // Ưu tiên ngày: deliveredAt > shippedAt > approvedAt
    let date = order.deliveredAt || order.shippedAt || order.approvedAt;
    let statusMsg = "Đơn hàng của bạn đã được ";

    if (order.deliveredAt) statusMsg += "giao hàng";
    else if (order.shippedAt) statusMsg += "vận chuyển";
    else if (order.approvedAt) statusMsg += "phê duyệt";
    else statusMsg += "tạo thành công";

    if (date) {
      statusMsg += ` vào ngày ${new Date(date).toLocaleDateString("vi-VN")}`;
    }

    return res.json({
      message: statusMsg,
      type: "orders",
      data: order, // trả về thông tin đơn hàng nếu muốn
    });
  }

  try {
    if (isProductSearch(message)) {
      const keyword = extractSearchTerm(message);
      const products = await searchProductsInDB(keyword, message); // Gọi DB bằng Sequelize

      if (products.length > 0) {
        return res.json({ type: "products", data: products }); // Gửi về cho FE để render product cards
      }

      // if (products.length === 0) {
      //   return res.json({
      //     type: "text",
      //     data: `Không tìm thấy sản phẩm nào với yêu cầu của bạn`,
      //   });
      // }
    }

    // Nếu không tìm được sản phẩm → gọi Gemini
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.CHATBOT_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text:
                  message +
                  ". Độ dài câu trả lời vừa phải với chatbot người dùng",
              },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const reply =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Không có phản hồi.";
    return res.json({ type: "text", data: reply }); // Gửi về cho FE đoạn văn bản
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ type: "error", data: "Lỗi khi xử lý yêu cầu." });
  }
};

module.exports = {
  handlechat,
};
