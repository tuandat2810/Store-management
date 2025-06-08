const Product = require('../models/product.m.js');

module.exports.createProduct = async (req, res) => {
    try {
        const { productCode, productName, description, image, unitPrice, unit, category } = req.body;

        if (!productCode || !productName || !unitPrice) {
            return res.status(400).json({ message: 'Thiếu thông tin sản phẩm' });
        }

        const exists = await Product.findOne({ productCode });
        if (exists) {
            return res.status(409).json({ message: 'Mã sản phẩm đã tồn tại.' });
        }

        const newProduct = new Product({
            productCode,
            productName,
            description,
            image,
            unitPrice,
            unit,
            category
        });

        await newProduct.save();
        res.json({ message: 'Thêm sản phẩm thành công.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};


module.exports.updateProduct = async (req, res) => {
    try {
        const { productCode, productName, unit, unitPrice, category, description, image } = req.body;

        if (!productCode) {
        return res.status(400).json({ message: 'Thiếu mã sản phẩm.' });
        }

        const updated = await Product.findOneAndUpdate(
            { productCode },
            { productName, unit, unitPrice, category, description, image },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
        }

        res.json({ message: 'Cập nhật sản phẩm thành công.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Product.findOneAndDelete({ productCode: id });
        if (!deleted) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa.' });
        }

        res.json({ message: 'Xoá sản phẩm thành công.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

