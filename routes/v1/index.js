module.exports = (app) => {
    // eslint-disable-next-line global-require
    const libs = require('../../libs');
    const routes = {};
    // eslint-disable-next-line global-require
    const fs = require('fs');
    let cd;
    fs.readdirSync(__dirname).filter((file) => (file.indexOf('.') !== 0) && (file !== 'index.js')).forEach((file) => {
        cd = file.replace('.js', '');
        cd = cd.toLocaleLowerCase();
        routes[cd] = require(`./${file}`)(app, libs);
    });
    return routes;
};
