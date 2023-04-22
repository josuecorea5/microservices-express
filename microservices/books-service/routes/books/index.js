const express = require("express"); // importa Express
const router = express.Router(); // crea un nuevo enrutador de Express
const data = require("../../data/data-library"); // importa los datos de data-library
const axios = require('axios');


const logger = (message) => console.log(`Author Services: ${message}`);

// define un controlador para la ruta raíz ("/")
router.get("/", (req, res) => {
  const response = {
    // crea una respuesta con información sobre los libros
    service: "books",
    architecture: "microservices",
    length: data.dataLibrary.books.length,
    data: data.dataLibrary.books,
  };
  logger("Get book data"); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
});

router.get("/years", (req, res) => {
  const { startYear, endYear, publicationYear, greatherThanYear, lessThanYear } = req.query;

  try {    
    const booksByDate = data.dataLibrary.books.filter((book) => {
      if(startYear && endYear) {
        return book.year >= startYear && book.year <= endYear;
      }
      return book;
    }).filter((book) => {
      if(publicationYear) {
        return book.year === Number(publicationYear);
      }
      return book;
    }).filter((book) => {
      if(greatherThanYear && book.year < greatherThanYear || lessThanYear && book.year > lessThanYear) {
        return false
      }
      return book;
    }).map((book) => {
      return {
        id: book.id,
        title: book.title,
        imageLink: book.imageLink,
        year: book.year,
    }});
  
    const response = {
      service: "books",
      architecture: "microservices",
      length: booksByDate.length,
      data: booksByDate,
    };
    return res.send(response);
  } catch (error) {
    return res.status(500).send({ message: 'Something was wrong' });
  }

})

router.get("/languages", async (req, res) => {
  const { language, code } = req.query;
  const uniqueBooks = [];
  try {
    const getLanguageCode = await axios.get(`http://languages:7000/api/v2/languages?code=${code}&language=${language}`);

    const languageCode = getLanguageCode.data.data.code;
    
    const getCountryByCode = await axios.get(`http://countries:5000/api/v2/countries/language/${languageCode}`);

    const books = getCountryByCode.data.data.reduce((acc, country) => {
      const booksByCountry = data.dataLibrary.books.filter((book) => {
        return book.distributedCountries.includes(country.name);
      });
      return [...acc, ...booksByCountry];
    }, []).map((book) => {
      return {
        id: book.id,
        title: book.title,
      }
    });
    
    books.forEach((book) => {
      if(!uniqueBooks.some((item) => item.id === book.id)) {
        uniqueBooks.push(book);
      }
    });

    const response = {
      service: "books",
      architecture: "microservices",
      length: uniqueBooks.length,
      data: uniqueBooks,
    };

    return res.send(response);
  } catch (error) {
    return res.status(500).send({ message: 'Something was wrong' });
  }
});

router.get('/author', async (req, res) => {
  const { name, id} = req.query;
  try {
    const getAuthor = await axios.get(`http://authors:3000/api/v2/authors?name=${name}&id=${id}`);

    console.log(getAuthor.data)

    const books = data.dataLibrary.books.filter((book) => {
      return book.authorid === getAuthor.data.data.id;
    }).map((book) => {
      return {
        id: book.id,
        title: book.title,
      }
    })
    const response = {
      service: "books",
      architecture: "microservices",
      length: books.length,
      data: books,
    };
    return res.send(response);
  } catch (error) {
    return res.status(500).send({ message: 'Something was wrong' });
  }
});

router.get("/distribution/:capital", async(req, res) => {
  const capital = req.params.capital;
  try {
    const getCountryByCapital = await axios.get(`http://countries:5000/api/v2/countries/${capital}`);

    const booksByCountry = data.dataLibrary.books.filter((book) => {
      return book.distributedCountries.includes(getCountryByCapital.data.data.country);
    }).map((book) => {
      return {
        id: book.id,
        title: book.title,
      }
    });

    const response = {
      service: "books",
      architecture: "microservices",
      length: booksByCountry.length,
      data: {
        country: getCountryByCapital.data.data.country,
        books: booksByCountry,
      },
    };
    return res.send(response);
  } catch (error) {
    return res.status(500).send({ message: 'Something was wrong'});
  }
});

// define un controlador para la ruta "/title/:title"
router.get("/title/:title", (req, res) => {
  // busca los libros que contengan el título buscado
  const titles = data.dataLibrary.books.filter((title) => {
    return title.title.includes(req.params.title);
  });
  // crea una respuesta con información sobre los libros que coinciden con el título buscado
  const response = {
    service: "books",
    architecture: "microservices",
    length: titles.length,
    data: titles,
  };
  return res.send(response); // devuelve la respuesta al cliente
});




module.exports = router; // exporta el enrutador de Express para su uso en otras partes de la aplicación

/*
Este código es un ejemplo de cómo crear una API de servicios utilizando Express y un enrutador. El enrutador define dos rutas: una para obtener todos los libros y otra para obtener libros por título. También utiliza una función simple de registro para registrar mensajes en los registros.
*/
