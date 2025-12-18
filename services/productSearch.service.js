const { Op } = require('sequelize');
const { Products, Pro_translation, Categories, ImagesProducts } = require('../models');

async function findProductsByPriceRange(minPrice, maxPrice, options = {}) {
  try {
    const { categoryId, languageCode, limit = 10 } = options;

    const where = {
      price: {
        [Op.between]: [minPrice, maxPrice]
      }
    };

    if (categoryId) {
      where.categoriesid = categoryId;
    }

    const include = [
      {
        model: Categories,
        attributes: ['name']
      },
      {
        model: ImagesProducts,
        attributes: ['url']
      }
    ];

    if (languageCode) {
      include.push({
        model: Pro_translation,
        attributes: ['name', 'languagecode', 'description'],
        where: { languagecode: languageCode },
        required: false
      });
    } else {
      include.push({
        model: Pro_translation,
        attributes: ['name', 'languagecode', 'description'],
        required: false
      });
    }

    const products = await Products.findAll({
      where,
      include,
      limit,
      order: [['price', 'ASC']]
    });

    return products.map((p) => {
      const translation = p.Pro_translations?.[0];
      return {
        id: p.id,
        name: translation?.name || p.name,
        description: translation?.description || p.description,
        price: p.price,
        brand: p.brand,
        quantity: p.quantity,
        category: p.Category?.name || null,
        imageUrl: p.Imagesproducts?.[0]?.url || null,
        languageCode: translation?.languagecode || null
      };
    });
  } catch (error) {
    console.error('Error in findProductsByPriceRange:', error);
    throw error;
  }
}

async function getProductStockByNameOrId({ productName, productId, languageCode }) {
  try {
    const where = {};
    const include = [
      {
        model: Categories,
        attributes: ['name']
      }
    ];

    if (productId) {
      where.id = productId;
    } else if (productName) {
      if (languageCode) {
        const transWhere = { languagecode: languageCode };
        if (productName) {
          transWhere.name = { [Op.like]: `%${productName}%` };
        }
        include.push({
          model: Pro_translation,
          attributes: ['name', 'languagecode', 'description'],
          where: transWhere,
          required: true
        });
      } else {
        where.name = { [Op.like]: `%${productName}%` };
        include.push({
          model: Pro_translation,
          attributes: ['name', 'languagecode', 'description'],
          required: false
        });
      }
    } else {
      return null;
    }

    const product = await Products.findOne({
      where,
      include
    });

    if (!product) {
      return null;
    }

    const translation = languageCode
      ? product.Pro_translations?.find((t) => t.languagecode === languageCode)
      : product.Pro_translations?.[0];

    return {
      id: product.id,
      name: translation?.name || product.name,
      brand: product.brand,
      price: product.price,
      quantity: product.quantity,
      category: product.Category?.name || null,
      stockStatus: product.quantity === 0 ? 'hết hàng' : product.quantity < 5 ? 'sắp hết hàng' : 'còn hàng'
    };
  } catch (error) {
    console.error('Error in getProductStockByNameOrId:', error);
    throw error;
  }
}

async function listRacketsForStyle(style, options = {}) {
  try {
    const { languageCode, limit = 10 } = options;

    const racketCategory = await Categories.findOne({
      where: {
        name: {
          [Op.or]: [{ [Op.like]: '%vợt%' }, { [Op.like]: '%racket%' }]
        }
      }
    });

    if (!racketCategory) {
      console.warn('Không tìm thấy category vợt');
      return [];
    }

    const where = {
      categoriesid: racketCategory.id
    };

    const styleKeywords = {
      'tấn công': ['astrox', 'smash', 'attack', 'power', '99', '100'],
      'phản tạt': ['nanoflare', 'speed', 'fast', 'light', '700', '800'],
      'toàn diện': ['arcsaber', 'balanced', 'all-round', 'versatile', '11', '7']
    };

    const keywords = styleKeywords[style.toLowerCase()] || [];

    const nameConditions = keywords.map((kw) => ({
      [Op.or]: [{ name: { [Op.like]: `%${kw}%` } }, { '$Pro_translations.name$': { [Op.like]: `%${kw}%` } }]
    }));

    if (nameConditions.length > 0) {
      where[Op.or] = nameConditions;
    }

    const include = [
      {
        model: Categories,
        attributes: ['name']
      },
      {
        model: ImagesProducts,
        attributes: ['url']
      }
    ];

    if (languageCode) {
      include.push({
        model: Pro_translation,
        attributes: ['name', 'languagecode', 'description'],
        where: { languagecode: languageCode },
        required: false
      });
    } else {
      include.push({
        model: Pro_translation,
        attributes: ['name', 'languagecode', 'description'],
        required: false
      });
    }

    const products = await Products.findAll({
      where,
      include,
      limit,
      order: [['price', 'DESC']]
    });

    return products.map((p) => {
      const translation = languageCode ? p.Pro_translations?.find((t) => t.languagecode === languageCode) : p.Pro_translations?.[0];

      return {
        id: p.id,
        name: translation?.name || p.name,
        description: translation?.description || p.description,
        price: p.price,
        brand: p.brand,
        quantity: p.quantity,
        category: p.Category?.name || null,
        imageUrl: p.Imagesproducts?.[0]?.url || null,
        style: style
      };
    });
  } catch (error) {
    console.error('Error in listRacketsForStyle:', error);
    throw error;
  }
}

module.exports = {
  findProductsByPriceRange,
  getProductStockByNameOrId,
  listRacketsForStyle
};
