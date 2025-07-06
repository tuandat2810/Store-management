const Product = require('../models/product.m.js');
const ProductUnit = require('../models/productunit.m.js');

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

module.exports.createUnit = async (req, res) => {
    try {
        const { value } = req.body;

        if (!value) return res.status(400).json({ message: 'Đơn vị tính không được để trống' });

        const exists = await ProductUnit.findOne({ value });
        if (exists) {
            return res.status(409).json({ message: 'Loại đơn vị đã tồn tại.' });
        }

        const newUnit = new ProductUnit({
            value
        });

        await newUnit.save();
        res.json({ message: 'Thêm đơn vị thành công.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports.updateUnit = async (req, res) => {
    try {
        const { value } = req.params;
        const { newValue } = req.body;
        console.log(value, newValue);

        if (!value || !newValue) {
            return res.status(400).json({ message: 'Đơn vị tính không được để trống' });
        }
        
        if (value === newValue) {
            return res.status(400).json({ message: 'Loại đơn vị tính mới phải khác loại đơn vị tính cũ.' });
        }
        const checkExistsUnit = await ProductUnit.findOne({ value: newValue });
        if (checkExistsUnit && checkExistsUnit.value !== value) {
            return res.status(409).json({ message: 'Loại đơn vị tính mới đã tồn tại. Vui lòng nhập đơn vị khác' });
        }

        const updated = await ProductUnit.findOneAndUpdate(
            { value },
            { value: newValue },
            { new: true }
        );


        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy loại đơn vị tính.' });
        }

        res.json({ message: 'Cập nhật loại đơn vị tính thành công.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

module.exports.deleteUnit = async (req, res) => {
    try {
        const value  = decodeURIComponent(req.params.value);

        const deleted = await ProductUnit.findOneAndDelete({ value });
        if (!deleted) {
            return res.status(404).json({ message: 'Không tìm thấy loại đơn vị tính để xóa.' });
        }

        res.json({ message: 'Xóa loại đơn vị tính thành công.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};
