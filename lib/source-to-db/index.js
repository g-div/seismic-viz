exports.register = (server, options, next) => {
  // Set defaults
  options.table = options.table || 'test';

  const {rethinkdb: r, connection: conn} = server.plugins['hapi-rethinkdb'];

    server.plugins['hapi-events'].manager.on('message', (message) => {

  	message.geometry = r.geojson(message.geometry);
  	message.properties.time = r.ISO8601(message.properties.time).inTimezone('+00:00');
  	message.properties.lastupdate = r.ISO8601(message.properties.lastupdate).inTimezone('+00:00');

    r.table(options.table).insert(message).run(conn);
  });
  
  return next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};