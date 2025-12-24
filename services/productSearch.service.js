const { Op } = require('sequelize');
const { Products, Pro_translation, Categories, ImagesProducts } = require('../models');

async function findProductsByPriceRange(minPrice, maxPrice, options = {}) {
  try {
    const { categoryId, languageCode, limit = 10 } = options;

    if (!minPrice && !maxPrice) {
      console.warn('[Service] Price range is not defined');
      return [];
    }

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
        as: 'cate',
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
        as: 'translations',
        attributes: ['name', 'languagecode', 'description'],
        where: { languagecode: languageCode },
        required: false
      });
    } else {
      include.push({
        model: Pro_translation,
        as: 'translations',
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

    if (!products || products.length === 0) {
      console.warn('[Service] No products found in price range');
      return [];
    }

    return products
      .map((p) => {
        try {
          const translation = p.translations?.[0];
          return {
            id: p.id,
            name: translation?.name || p.name,
            description: translation?.description || p.description,
            price: p.price,
            brand: p.brand,
            quantity: p.quantity,
            category: p.cate?.name || null,
            imageUrl: p.Imagesproducts?.[0]?.url || null,
            languageCode: translation?.languagecode || null
          };
        } catch (mapError) {
          console.error('[Service] Error mapping product:', mapError.message);
          return null;
        }
      })
      .filter((p) => p !== null);
  } catch (error) {
    console.error('Error in findProductsByPriceRange:', error.message);
    throw new Error(`Failed to find products by price range: ${error.message}`);
  }
}

async function getProductStockByNameOrId({ productName, productId, languageCode }) {
  try {
    if (!productName && !productId) {
      console.warn('[Service] Product name or ID is not provided');
      return null;
    }

    const where = {};
    const include = [
      {
        model: Categories,
        as: 'cate',
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
          as: 'translations',
          attributes: ['name', 'languagecode', 'description'],
          where: transWhere,
          required: true
        });
      } else {
        where.name = { [Op.like]: `%${productName}%` };
        include.push({
          model: Pro_translation,
          as: 'translations',
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
      console.warn('[Service] Product not found:', productName || productId);
      return null;
    }

    try {
      const translation = languageCode ? product.translations?.find((t) => t.languagecode === languageCode) : product.translations?.[0];

      return {
        id: product.id,
        name: translation?.name || product.name,
        brand: product.brand,
        price: product.price,
        quantity: product.quantity,
        category: product.cate?.name || null,
        stockStatus: product.quantity === 0 ? 'hết hàng' : product.quantity < 5 ? 'sắp hết hàng' : 'còn hàng'
      };
    } catch (mapError) {
      console.error('[Service] Error mapping product stock info:', mapError.message);
      return null;
    }
  } catch (error) {
    console.error('Error in getProductStockByNameOrId:', error.message);
    throw new Error(`Failed to get product stock: ${error.message}`);
  }
}

async function listRacketsForStyle(style, options = {}) {
  try {
    if (!style) {
      console.warn('[Service] Style is not provided');
      return [];
    }

    const { languageCode, limit = 10 } = options;

    const racketCategory = await Categories.findOne({
      where: {
        name: {
          [Op.or]: [{ [Op.like]: '%vợt%' }, { [Op.like]: '%racket%' }]
        }
      }
    });

    if (!racketCategory) {
      console.warn('[Service] Racket category not found');
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

    if (keywords.length > 0) {
      const nameConditions = keywords.map((kw) => ({
        [Op.or]: [{ name: { [Op.like]: `%${kw}%` } }, { '$Pro_translations.name$': { [Op.like]: `%${kw}%` } }]
      }));

      if (nameConditions.length > 0) {
        where[Op.or] = nameConditions;
      }
    }

    const include = [
      {
        model: Categories,
        as: 'cate',
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
        as: 'translations',
        attributes: ['name', 'languagecode', 'description'],
        where: { languagecode: languageCode },
        required: false
      });
    } else {
      include.push({
        model: Pro_translation,
        as: 'translations',
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

    if (!products || products.length === 0) {
      console.warn('[Service] No rackets found for style:', style);
      return [];
    }

    return products
      .map((p) => {
        try {
          const translation = languageCode ? p.translations?.find((t) => t.languagecode === languageCode) : p.translations?.[0];

          return {
            id: p.id,
            name: translation?.name || p.name,
            description: translation?.description || p.description,
            price: p.price,
            brand: p.brand,
            quantity: p.quantity,
            category: p.cate?.name || null,
            imageUrl: p.Imagesproducts?.[0]?.url || null,
            style: style
          };
        } catch (mapError) {
          console.error('[Service] Error mapping racket:', mapError.message);
          return null;
        }
      })
      .filter((p) => p !== null);
  } catch (error) {
    console.error('Error in listRacketsForStyle:', error.message);
    throw new Error(`Failed to list rackets for style: ${error.message}`);
  }
}

module.exports = {
  findProductsByPriceRange,
  getProductStockByNameOrId,
  listRacketsForStyle
};
