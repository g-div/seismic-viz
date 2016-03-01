import Kilt from 'kilt';

exports.register = (server, options, next) => {
  // Set defaults
  options.name = options.name || 'manager';

  const kilt = new Kilt();

  server.expose(options.name, kilt);
  return next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};