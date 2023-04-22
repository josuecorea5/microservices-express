const path = require('path');
const csvFile = path.resolve(__dirname, 'language-codes.csv');

const csv = require('csvtojson');
const { writeFile } = require('fs/promises')


const csvToJson = async () => {
  try {
    const jsonArray = await csv({
      noheader: true,
      headers: ['code', 'name'],
    }
    ).fromFile(csvFile);
    
    const jsonResult = jsonArray.map((item) => {
      return {
        code: item.code,
        language: item.name.split(';').map((item) => item.trim()),
      }
    })

    await writeFile(`${__dirname}/language-codes.json`, JSON.stringify(jsonResult))

  } catch (error) {
    console.log(error)
  }
};

csvToJson();
