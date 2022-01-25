const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRoles = require('../middlewares/verifyRoles');
const OrdersController = require('../controllers/orders');
const ROLE = require('../constants/Role_Enum'); 


router.get('/', verifyJWT, verifyRoles(ROLE.ADMIN), OrdersController.orders_get_all);

router.post('/', verifyJWT, OrdersController.orders_create_order);

router.get('/:orderId', verifyJWT, OrdersController.orders_get_order);

router.patch('/:orderId', verifyJWT, OrdersController.orders_update_order);

router.delete('/:orderId', verifyJWT, OrdersController.orders_delete_order);


module.exports = router;