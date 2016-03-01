'use strict';
require('dotenv').load();
const Lab = require('lab');
const Code = require('code');
const Glue = require('glue');

const lab = exports.lab = Lab.script();

let manifest = require('../src/api.json');

let hapi = {};

lab.experiment('API', () => {

	lab.before((done) => {

		let options = {
			relativeTo: __dirname
		};

        manifest = parseEnv(manifest);
        console.log(manifest);
		Glue.compose(manifest, options, (err, server) => {
			if (err) {
				throw err;
			}
			server.start(() => {
				hapi = server;
				done();
			});
		});
	});

	lab.beforeEach((done) => {
		done();
	});

	lab.test('exposes an event-stream containing data', (done) => {
		hapi.inject('/earthquakes', (response) => {
			console.log(response);
			Code.expect(1 + 1).to.equal(2);
			done();
		});
	});
});

// from rejoice/lib/index.js
function parseEnv(manifest) {

    if (!manifest ||
        typeof manifest !== 'object') {

        return;
    }

    Object.keys(manifest).forEach(function (key) {

        var value = manifest[key];
        if (typeof value === 'string' &&
            value.indexOf('$env.') === 0) {
            console.log(process.env[value.slice(5)])
            manifest[key] = process.env[value.slice(5)];
        }
        else {
            parseEnv(value);
        }
    });

    return manifest
};