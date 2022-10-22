const express = require('express');
const router = express.Router();

// /users
router.get('/', (req, res) => {
  res.send('/users/');
});

router.get('/name/:name', (req, res) => {
  res.send(`/users/name/${req.params.name}`);
});

module.exports = router;

// 1. Creo el archivo
// 2. En el archivo creado:
//    2.1. require express
//    2.2. invoco a express.Router();
//    2.3 module.export = al nombre de la variable al cual asigne Router
//    2.4. defino todas las rutas que quiero
// 3. En el entry point, archivo "padre/madre"
//    3.1. require el archivo donde defini mi router -> const productRoutes = require('./routes/products');
//    3.2 defino el middleware -> server.use('pathINICIO', productRoutes)
