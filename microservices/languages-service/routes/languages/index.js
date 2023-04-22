const express = require('express');
const data = require('../../language-codes.json');
const router = express.Router();

router.get('/', (req, res) => {
  const { code, language } = req.query;
  if(!code && !language) {
    return res.send({
      service: 'languages',
      architecture: 'microservices',
      length: data.length,
      data: data,
    })
  }
  try {    
    const filterByCodeOrLanguage = data.find((item) => {
      return (
        code && item.code === code.toLocaleLowerCase().trim() ||
        language && item.language.includes(language.trim())
      )
    });

    if(filterByCodeOrLanguage) {
      const response = {
        service: 'languages',
        architecture: 'microservices',
        data: filterByCodeOrLanguage,
      };
      return res.send(response);
    }
    
    return res.send({data: []});

  } catch (error) {
    return res.status(404).send({ message: 'Something was wrong' });
  }
});

module.exports = router;