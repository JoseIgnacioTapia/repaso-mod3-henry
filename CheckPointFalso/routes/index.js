const express = require('express');
const router = express.Router();
router.use(express.json());

let tareas = []; // arreglo de strings

// escriban sus rutas acá
// sientanse libres de dividir entre archivos si lo necesitan

router.get('./users', (req, res) => {
  res.status(200).json(tareas); // Devuelve status 200, Content-Type json y tareas
});

router.post('/users', (req, res) => {
  const { person } = req.query;
  if (person) {
    tareas.push(person); // Comprobando si la informacion llego por query
    res.status(201).send({ encargado: person }); // Responde status 201 y con un objeto con la propiedad encargado y valor (nombre de la persona)
  } else {
    const { person } = req.body;
    if (typeof person !== 'string') return res.sendStatus(401); // Verifica si el valor de la propiedad person es un string de lo contrario devuelve error 401
    if (person) {
      tareas.push(person); // Agrega una nueva persona al arreglo de tareas
      res.status(201).json({ encargado: person }); // Responde status 201 y con un objeto con la propiedad encargado y valor (nombre de la persona)
    }
  }
});

router.put('/users', (req, res) => {
  let { person, lastName } = req.body;

  if (person && lastName) {
    tareas.forEach((p, index) => {
      if (p === person) {
        tareas[index] = `${person} ${lastName}`; // cambia el valor del arreglo en la posicion i
        return res.status(201).send({ fullName: `${person} ${lastName}` }); // Respuesta status 200 y propiedad fullName con valor person mas lastName
      }
    });
  } else if (person) {
    const { lastname } = req.query; // El lastName llego por query y cambiamos el array
    tareas.forEach((p, index) => {
      if (p === person) {
        tareas[index] = `${person} ${lastname}`;
        return res.status(201).send({ fullName: `${person} ${lastName}` });
      }
    });
  }
  res.sendStatus(404); // No llegó toda la información necesaria envio status error
});

router.delete('/users', (req, res) => {
  const { person } = req.body;
  let found = false;

  if (person) {
    // Si la informacion viene por body
    tareas.forEach((p, index) => {
      if (p.includes(person)) {
        tareas.splice(index, 1); // Si incluye person en algun item usamos splice para modificar el array
        found = true;
      }
      if (found) res.status(200).send(tareas);
      else res.sendStatus(400); // No encuentra el nombre del encargado para borrar
    });
  } else {
    // la informacion viene por query
    const { person } = req.query;
    tareas.forEach((p, index) => {
      if (p.includes(person)) tareas.splice(index, 1);
    });
    if (found) res.send(tareas);
    else res.sendStatus(400); // No encuentra el nombre del encargado para borrar
  }
  res.sendStatus(200);
});

router.post('/users/task', (req, res) => {
  tareas.forEach((p, index) => {
    tareas[index] = { encargado: p, completada: false, tarea: '' }; // Modifica el array y agrega un objeto agregando informacion a cada item
  });
  res.send(tareas); // Envia por body el arreglo
});

router.get('/users/task', (req, res) => {
  res.send(tareas); // Devolvemos el array completo
});

router.get('/users/:person/task', (req, res) => {
  const { person } = req.params; // Recibimos por parametro la persona
  let array = [];
  tareas.forEach(p => {
    if (p.encargado === person) array.push(p.tarea); // Agregamos las tareas de la persona indicada a un nuevo array
  });

  res.status(200).send(array); // Devolvemos el status(por defecto ya lo hace) y array
});

router.post('/users/:person/task', (req, res) => {
  let { person } = req.params;
  let { task } = req.body;

  // tareas = [{}, {}, {}]
  let foundPerson = tareas.find(p => p.encargado === person); // Comprobamos que exista person en el array
  if (foundPerson) {
    tareas.push({ encargado: person, completada: false, tarea: task }); // Agrega un nuevo objeto al array con los datos suministrados
    res.sendStatus(201);
  } else {
    res.sendStatus(404);
  }
});

router.put('/users/:person/task', (req, res) => {
  let { person } = req.params;
  let foundPerson = tareas.find(p => p.encargado === person); // Comprobamos que exista person en el array
  if (!foundPerson) {
    res.sendStatus(401); // Si la persona no se encuentra en el array envia respuesta 401
  }
});

router.put('/users/:person/task', (req, res) => {
  // Recibe informacion por parametro, query y body segun corresponda
  let { person } = req.params;
  let { index } = req.query;
  let { task } = req.body;

  let foundPerson = tareas.find(p => p.encargado === person);
  if (foundPerson) {
    tareas[index].tarea = task; // Modifica la tarea de la persona encontrada
    // foundPerson.tarea = task;
    res.sendStatus(200); // envia status 200
  } else {
    res.sendStatus(401);
  }
});

router.get('/complete/tasks', (req, res) => {
  let completed = tareas.filter(p => p.completada === true); // Buscamos todas las tareas completadas

  if (completed.length > 0)
    res.send(completed); // Devolvemos las tareas completadas
  else res.sendStatus(404).json('ningua tarea completada'); // En caso de no ecnotrar tareas completadas enviamos status 404 y mensaje type json
});

router.post('/complete/tasks', (req, res) => {
  let { id } = req.body; // Enviamos id por body
  if (tareas[id]) {
    tareas[id].completada = true; // Pasa a valor true la propiedad completada
    res.sendStatus(200); // Si existe en el array el indice enviamos status 200
  } else res.sendStatus(404); // No se encuentra status 404
});

router.delete('/complete/tasks', (req, res) => {
  let { id } = req.query; // Recibe indice por query
  if (tareas[id]) {
    tareas.splice(id, 1); // elimina el valor del indice recibido del array
    res.sendStatus(200); // envia status 200
  } else res.sendStatus(400); // De lo contrario envia status 400
});

module.exports = {
  router,
  tareas,
};
