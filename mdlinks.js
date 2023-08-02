const { mdLinks } = require('./index.js');

const inputPath = process.argv[2];
const optionStats = process.argv.includes("--stats");
const optionValidate = process.argv.includes("--validate");

mdLinks(inputPath, { stats: optionStats , validate: optionValidate})
  .then((result) => console.log(result))
  .catch((error) => console.log(error));