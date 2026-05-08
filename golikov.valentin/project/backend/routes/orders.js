const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('./auth');

const router = express.Router();

const ORDERS_PATH = path.join(__dirname, '../data/orders.json');

const readOrders = () => {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_PATH, 'utf-8'));
  } catch {
    return [];
  }
};

const writeOrders = (orders) => {
  fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2), 'utf-8');
};

const getLoginFromRequest = (req) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '').trim();
  return token ? verifyToken(token) : null;
};

function isValidOrder(body) {
  if (!body) return false;
  const { items, phone, email, paymentMethod, delivery } = body;
  if (!Array.isArray(items) || items.length === 0) return false;
  if (!phone || typeof phone !== 'string' || phone.trim() === '') return false;
  if (!email || typeof email !== 'string' || email.trim() === '') return false;
  if (!paymentMethod || typeof paymentMethod !== 'string' || paymentMethod.trim() === '') return false;
  if (!delivery || typeof delivery !== 'string' || delivery.trim() === '') return false;
  return true;
}

// POST /api/orders — create order
router.post('/', (req, res) => {
  try {
    const body = req.body;

    if (!isValidOrder(body)) {
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }

    const login = getLoginFromRequest(req);
    const orderId = Date.now().toString();

    const order = {
      orderId,
      login: login || 'guest',
      createdAt: new Date().toISOString(),
      items: body.items,
      total: body.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      delivery: body.delivery,
      address: body.address || null,
      phone: body.phone,
      email: body.email,
      paymentMethod: body.paymentMethod,
      needsWrapping: body.needsWrapping || false,
    };

    const orders = readOrders();
    orders.push(order);
    writeOrders(orders);

    return res.json({ success: true, orderId });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/orders — get orders for current user
router.get('/', (req, res) => {
  try {
    const login = getLoginFromRequest(req);

    if (!login) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const orders = readOrders();
    const userOrders = orders
      .filter((o) => o.login === login)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ success: true, orders: userOrders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
