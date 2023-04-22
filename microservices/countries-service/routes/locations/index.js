// Importamos la biblioteca Express
const express = require("express");

// Importamos el archivo data-library.js que contiene la información sobre los países.
const data = require("../../data/data-library");

// Creamos un router de Express
const router = express.Router();

// Creamos una función de registro que imprime mensajes de registro en la consola
const logger = (message) => console.log(`Countries Service: ${message}`);

// Creamos una ruta GET en la raíz del router que devuelve todos los países
router.get("/", (req, res) => {
  // Creamos un objeto de respuesta con información sobre el servicio y los datos de los países
  const response = {
    service: "countries",
    architecture: "microservices",
    length: data.dataLibrary.countries.length,
    data: data.dataLibrary.countries,
  };
  // Registramos un mensaje en la consola
  logger("Get countries data");
  // Enviamos la respuesta al cliente
  return res.send(response);
});

router.get('/:capital', (req, res) => {
  const capital = req.params.capital;
  try {
    let countryName = '';
    let countries = data.dataLibrary.countries;
    for(let country in countries) {
      if(countries[country].capital.toLocaleLowerCase() === capital.trim().toLocaleLowerCase()) {
       countryName = countries[country].name;
       break;
      }
    }
    const response = {
      service: "countries",
      architecture: "microservices",
      data: { country: countryName },
    };
    return res.send(response);
  } catch (error) {
    return res.status(500).send({ message: 'Something was wrong' });
  }
});

router.get('/language/:code', (req, res) => {
  const code = req.params.code;
  try {
    const countries = data.dataLibrary.countries;
    let countriesLanguage = [];
    for(let country in countries) {
      if(countries[country].languages.includes(code.toLocaleLowerCase().trim())) {
        countriesLanguage.push({
          name:  countries[country].name,
          capital: countries[country].capital
        });
      }
    }
    const response = {
      service: "countries",
      architecture: "microservices",
      data: countriesLanguage,
    };
    return res.send(response);
  } catch (error) {
    return res.status(500).send({ message: 'Something was wrong'});
  }
})

// Exportamos el router
module.exports = router;
