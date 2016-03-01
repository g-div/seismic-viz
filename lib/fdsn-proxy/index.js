import url from 'url';
import querystring from 'querystring';
import Joi from 'joi';

exports.register = (server, options, next) => {
  // Set defaults
  options.path = options.path || '/search';
  if (!options.url) {
    return next(new Error('an url must be passed as option of the fdsn-proxy plugin'));
  }

  server.route({
    method: 'GET',
    path: options.path,
    handler: {
      proxy: {
        mapUri: (request, callback) => {
          request.query.format = 'json';

          const proxyURL = url.format({
            protocol: 'http',
            host: options.url,
            pathname: 'fdsnws/event/1/query',
            query: request.query
          });

          callback(null, querystring.unescape(proxyURL));
        },
      }
    },
    config: {
      tags: ['api'],
      validate: {
        query: {
          starttime: Joi.date().min('1-1-1998').iso().raw(),
          endtime: Joi.date().min(Joi.ref('starttime')).max('now').iso().raw(),
          limit: Joi.number().integer().min(1).max(100).default(10)
        }
      }
    }
  });

  return next();
};

exports.register.attributes = {
  multiple: true,
  pkg: require('./package.json')
};