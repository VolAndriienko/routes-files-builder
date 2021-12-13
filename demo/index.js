const builder = require('../dist/index');
const settings = require('./settings.json');

console.log(settings.routingFilePath)
builder.start(settings);