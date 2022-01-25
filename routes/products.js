const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyJWT = require('../middlewares/verifyJWT');
const ProductController = require('../controllers/products');
const verifyRoles = require('../middlewares/verifyRoles');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});



router.get('/', ProductController.products_get_all);

router.post('/', verifyJWT, upload.single('productImage'), ProductController.products_create_product);

router.get('/:productId', ProductController.products_get_product);

router.patch('/:productId', verifyJWT, ProductController.products_update_product);

router.delete('/:productId', verifyJWT, ProductController.products_delete_product);


module.exports = router;