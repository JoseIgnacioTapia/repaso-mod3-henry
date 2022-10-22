'use strict';

const express = require('express');
const app = express();
const routes = require('./routes/index');
// acuerdense de agregar su router o cualquier middleware que necesiten aca

/*
  1. DEberian traer las rutas de la carpeta routes
  2. Fijense bien en la forma que se exporta el modulo routes/index.js, para poder traerlo y utilizarlo correctamente
*/

app.use('/', routes.router);

// el condicional es solo para evitar algun problema de tipo EADDRINUSE con mocha watch + supertest + npm test.
if (!module.parent) app.listen(3000);

module.exports = app; // esto es solo para testear mas facil
