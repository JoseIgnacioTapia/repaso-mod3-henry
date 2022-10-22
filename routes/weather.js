const express = require('express');
const router = express.Router();
const axios = require('axios');

const apiKey = '1d81399f0003976acb064965d92c2014';

// weather/Buenos Aires
router.get('/:name', async (req, res) => {
  let { name } = req.params;

  // axios
  //   .get(
  //     `http://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}`
  //   )
  //   .then(response =>
  //     res.send({
  //       id: response.data.id,
  //       name: response.data.name,
  //       temp: response.data.main.temp,
  //     })
  //   );

  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}`
    );
    console.log(response);
    console.log(response.data);
    const data = {
      id: response.data.id,
      name: response.data.name,
      temp: response.data.main.temp,
    };
    res.send(data);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
