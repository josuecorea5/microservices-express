// Importamos el paquete express
const express = require("express");
const axios = require("axios");

// Creamos un objeto Router
const router = express.Router();

// Importamos el módulo data-Library que contiene los datos de los autores
const data = require("../../data/data-library");

// Creamos una función logger que muestra un mensaje en consola
const logger = (message) => console.log(`Authors Service: ${message}`);

// Creamos la ruta para obtener todos los autores
router.get("/", (req, res) => {
  const { name, id } = req.query;

  if(!name && !id) {
    // Creamos un objeto de respuesta con los datos de los autores
    const response = {
      service: "authors",
      architecture: "microservices",
      data: data.dataLibrary.authors,
    };
  
    // Enviamos la respuesta
    return res.send(response);
  }
  const authorResponse = data.dataLibrary.authors.find((author) => {
    return (
      name && author.author.includes(name.trim()) ||
      id && author.id === Number(id)
    )
  });
  const response = {
    service: "authors",
    architecture: "microservices",
    data: authorResponse,
  }
  return res.send(response);
});

router.get("/languages", async (req, res) => {

  const { language, code } = req.query;
  try {
    const getLanguageCode = await axios.get(`http://languages:7000/api/v2/languages?code=${code}&language=${language}`);

    const languageCode = getLanguageCode.data.data.code;
    
    const getCountryByCode = await axios.get(`http://countries:5000/api/v2/countries/language/${languageCode}`);

    console.log(getCountryByCode.data.data)

    const authors = getCountryByCode.data.data.reduce((acc, country) => {
      const authorsByCountry = data.dataLibrary.authors.filter((author) => {
        return author.country === country.name;
      });
      return [...acc, ...authorsByCountry];
    }, []);

    const response = {
      service: "authors",
      architecture: "microservices",
      data: authors,
    };

    return res.send(response);
  } catch (error) {
    return res.status(500).send({ message: "Something was wrong" });
  }
});

router.get("/author/country/:capital", async (req, res) => {
  const capital = req.params.capital;
  try {
    const getCountryByCapital = await axios.get(`http://countries:5000/api/v2/countries/${capital}`);

    const authorsByCountry = data.dataLibrary.authors.filter((author) => {
      return author.country.trim() === getCountryByCapital.data.data.country;
    }).map((author) => {
      return {
        id: author.id,
        name: author.author,
      }
    });

    const response = {
      service: "authors",
      architecture: "microservices",
      data: {
        country: getCountryByCapital.data.data.country,
        authors: authorsByCountry
      }
    };
    
    return res.send(response);
  } catch (error) {
    return res.status(500).send({ message: "Something was wrong" });
  }
});

// Creamos la ruta para obtener un autor por su id
router.get("/:id", (req, res) => {
  // Filtramos los autores cuyo id coincide con el que se envía en la petición
  const author = data.dataLibrary.authors.filter((author) => {
    return req.params.id == author.id;
  });

  // Creamos un objeto de respuesta con los datos del autor
  const response = {
    service: "authors",
    architecture: "microservices",
    data: author,
  };

  // Enviamos la respuesta
  return res.send(response);
});

// Creamos la ruta para obtener autores por su nombre
router.get("/author/:name", (req, res) => {
  // Filtramos los autores cuyo nombre coincide con el que se envía en la petición
  const author = data.dataLibrary.authors.filter((author) => {
    return author.author.includes(req.params.name);
  });

  // Creamos un objeto de respuesta con los datos de los autores
  const response = {
    service: "authors",
    architecture: "microservices",
    data: author,
  };

  // Enviamos la respuesta
  return res.send(response);
});





const getBooks = async () => {
  const books = await axios("http://books:4000/api/v2/books/");
  return books.data.data;
}

// Exportamos el objeto Router
module.exports = router;

/*
Este código utiliza el framework Express para crear un servicio web que devuelve información sobre autores. A continuación se detallan las acciones que se realizan línea por línea:

En la línea 2, se importa el paquete Express.
En la línea 5, se crea un objeto Router usando el método Router() de Express.
En la línea 8, se importa el módulo data-library que contiene los datos de los autores.
En la línea 11, se define una función logger que recibe un mensaje y lo muestra en la consola usando el método console.log().
En la línea 14, se define la ruta para obtener todos los autores. Cuando se hace una petición GET a la ruta raíz del servicio (/), se ejecuta la función que recibe el objeto Request (req) y el objeto Response (res). Dentro de la función, se crea un objeto response que contiene los datos de los autores y se muestra un mensaje en la consola usando la función logger. Finalmente, se envía la respuesta usando el método res.send().
En la línea 48, se define la ruta para obtener un autor por su id. Cuando se hace una petición GET a la ruta /:id del servicio, se ejecuta la función que recibe el objeto
*/
