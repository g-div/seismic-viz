import {PassThrough} from 'stream';
import Joi from 'joi';

exports.register = (server, options, next) => {
  // Set defaults
  options.table = options.table || 'test';
  options.queryLastHours = options.queryLastHours || 6;
  options.timezone = options.timezone || '+01:00';
  options.path = options.path || '/earthquakes';
  if (!options.model) {
    return next(new Error('model must be passed as option of the routes plugin'));
  }

  const {rethinkdb: r, connection: conn} = server.plugins['hapi-rethinkdb'];

  server.route({
    method: 'GET',
    path: options.path,
    config: {
      tags: ['api']
    },
    handler: (request, reply) => {
      // open the stream
      const stream = new PassThrough({ objectMode: true });
      reply.event(stream, null, {event: options.table});

      // query DB for the last hour events
      r.table(options.table)
          .orderBy({index: 'time'})
          .filter(r.row('properties')('time').gt(r.now().inTimezone(options.timezone).sub(options.queryLastHours*60*60)))
          .changes({includeInitial: true})('new_val')
          .pluck(options.model)
          .run(conn).then(cursor => {
            cursor.on('data', message => stream.write(message)); // write data to the stream
          }).error(err => server.log(['error', 'db', 'runtime'], `Unable to query RethinkDB, check that the table ${options.table} exist: \n ${err}`));
    }
  });

  server.route({
    method: 'GET',
    path: '/query',
    config: {
      tags: ['api']
    },
    handler: (request, reply) => {
      // query DB
      r.table(options.table)
          .orderBy({index: 'time'})
          .between(r.ISO8601(request.query.time).sub(options.queryLastHours*60*60), request.query.time, {index: 'time'})
          .pluck(options.model)
          .run(conn).then(cursor => {
            return cursor.toArray();
          }).then(result => {
            reply(JSON.stringify(result));
          }).error(err => server.log(['error', 'db', 'runtime'], `Unable to query RethinkDB, check that the table ${options.table} exist: \n ${err}`));
    },
    config: {
      tags: ['api'],
      validate: {
        query: {
          time: Joi.date().min('1-1-1998').max('now').iso().raw()
        }
      }
    }
  });

  return next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};