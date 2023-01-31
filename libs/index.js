
const lib = {};
const fs = require('fs');

let cd;
fs.readdirSync(__dirname).filter((file) => (file.indexOf('.') !== 0) && (file !== 'index.js')).forEach((file) => {
    cd = file.replace('.js', '');
    lib[cd] = require(`./${file}`);
});

module.exports = lib;
