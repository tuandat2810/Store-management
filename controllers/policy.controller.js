
const Product = require('../models/product.m.js');
const AgencyType = require('../models/agencytype.m.js');
const District = require('../models/district.m.js');
const ProductUnit = require('../models/productunit.m.js');

const { sortDistricts } = require('../helpers/sort.js');

module.exports.view = async (req, res) => {
  try {
    const districts = await District.find().lean();
    const sortedDistricts = sortDistricts(districts);
      

    const agencyTypes = await AgencyType.find().lean();

    const products = await Product.find().lean();

    const productUnits = await ProductUnit.find().lean();

    const data = { districts: sortedDistricts, agencyTypes, products, productUnits };

    res.render('thay_doi_quy_dinh', {
      layout: 'main',
      title: 'Thay đổi quy định',
      ...data
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};
