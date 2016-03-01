import SockJS from 'sockjs-client';
import pkg from './package.json';
import {mapping} from './transformers';

exports.register = (server, options, next) => {
  // Set defaults
  options.name = options.name || 'unknown';
  if (!options.url) {
    throw new Error(`Please add an URL to the configuration of your ${pkg.name} plugin`);
  }
  
  let sock = new SockJS(options.url);

  sock.onopen = () => {
    server.log([options.name, 'info'], `Connected to ${options.name}`);
    
    sock.onmessage = (message) => {
      message.data = mapping[options.name](JSON.parse(message.data));

      server.plugins['hapi-events'].manager.emit('message', message.data);
    }
    
    server.expose({name: options.name, datasource: sock});
    return next();
  };
};

exports.register.attributes = {
  multiple: true,
  pkg: pkg
};
