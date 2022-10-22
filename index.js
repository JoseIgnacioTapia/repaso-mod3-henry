// CONFIGURACION
const express = require('express');
const server = express();
const morgan = require('morgan');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const weatherRoutes = require('./routes/weather');

// DATABASE
let id = 4;
let names = [
  { id: 1, name: 'Martina' },
  { id: 2, name: 'Franco' },
  { id: 3, name: 'Diego' },
];

// MIDDLEWARES
server.use(express.json());
server.use(morgan('tiny'));

function logger(req, res, next) {
  console.log(req.url);
  next();
}
// 1. Particulares 2. Generales
server.use('/search', logger);

server.use('/products', productRoutes);
server.use('/users', userRoutes);
server.use('/weather', weatherRoutes);

// -->> request -->> middleware logger -->> middleware de express -->> response
// --> request('/holaaaa') --> express.json() --> (req, res) {} --> res.status(404).send('No existe ninguna ruta indicada')

// ROUTES

// server.METHOD(path, middleware, (req, res, next) => {})
server.get('/', logger, (req, res, next) => {
  // Content-type: text/html
  // res.send('Bienvenidos a nuestro server');

  // EJECUTA LO QUE QUIERA EJECUTAR ACA!!!
  console.log('pre next');
  next();
});

server.get('/', (req, res) => {
  res.type('json');
  res.send('Bienvenidos a nuestro server luego del next');
});

server.get('/json', (req, res) => {
  // Content-Type: application/json
  // res.json({ message: 'I am JSON' });

  // Content-Type: application/json
  // res.json(null);

  // Content-Type: application/json
  res.json(undefined);
});

server.get('/send', (req, res) => {
  // Content-Type: application/json
  // res.send({ message: 'I am SEND' });

  // No tengo Content-Type definido
  // res.send(null);

  // No tengo Content-Type definido
  res.send(undefined);
});

// Recibo info por parametros ejemplo id
server.get('/search/:id', (req, res) => {
  // req.params --> {id}
  // let id = req.params.id
  let { id } = req.params; // String!!!

  let elObjeto = names.find(n => n.id === parseInt(id));
  // Si quiero que express me defina el content-type >> .send
  // Si quiero enviar siempre application/json >> .json
  res.send(elObjeto.name);
});

server.get('/search/:id/:name', (req, res) => {
  // let id = req.params.id;
  // let name = req.params.name;
  let { id, name } = req.params;
  res.send({ id, name });
});

server.post('/addName/:name', (req, res) => {
  // No se olviden de tener express.json() como middleware para que
  // el body se pued convertir en json a objeto!!!
  const { location, age } = req.body;
  const { name } = req.params;

  names.push({ id: id++, name, location, age });

  // res.send(names);
  res.json(names);
});

server.get('/query', (req, res) => {
  let { name, location, age } = req.query;
  if (!name || !location || !age) {
    // res.sendStatus(400);
    return res
      .status(400)
      .send({ message: 'No se envio la informacion necesaria' });
  }
  let find = names.find(p => p.name == name);
  res.send(find);
});

// MANDAR INFORMACION POR URL !!
// params -> lo tengo que aclarar en el path de la definición -> :nombreParametro
//          puedo mandar tantos params como quiero , tienen que estar separados por /
//          => req.params = {param1:, param:2, param2:}
//          si en la ruta enviaron /hola/chau/foo => req.params = {param1: hola, param2: chau, param3: foo}

// query -> no lo tengo que aclarar en el path de la definición! -> /laruta
// si lo tengo que aclarar en el request ? /laruta?name=martina&location=caba&age=25
//        -> req.query = {name: "martina", location:"caba", age:25}

// ---------------------------------------------------------------------
// body --> No se deberia recibir informacion en un body por GET
//          La informacion viaja en un json debemos configurar el middleware de express.json() -> server.use(express.json)
//          puedo hacer destructuring del body req.body

server.get('*', (req, res) => {
  res.status(404).send('No existe ninguna ruta indicada');
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
