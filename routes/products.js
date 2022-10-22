const express = require('express');

const router = express.Router();

// /products/
router.get('/', (req, res) => {
  res.send('Hola estoy en /products');
});

// /products/:id
router.get('/:id', (req, res) => {
  res.send(req.params.id);
});

// post /products/:name
router.post('/:name', (req, res) => {
  res.send(req.params.id);
});

module.exports = router;
