const express  = require('express');
const router   = express.Router();
const session  = require('express-session');
const kc       = require('keycloak-connect');
const config   = require('../config/config');

const memoryStore = new session.MemoryStore();

let kcConfig = {
	clientId: 'parking-app',
	bearerOnly: true,
	serverUrl: 'localhost:8080/auth',
	realm: 'FlexParking',
	realmPublicKey: 'MIIBIjANBg…'
};

const keycloak = new kc(
	{ store: memoryStore }, 
	kcConfig
);

/*
// Middleware per autenticazione di base
const basicAuth = require('express-basic-auth');
const { username, password } = config.authentication;

router.use(
  basicAuth(
    {
      users: { 
        [username]: password 
      },
      challenge: true,
    }
  )
);
*/

router.use(
  keycloak.protect('user')
);

// Rotte API REST
router.get(
	'/', 
	(req, res) => {
		logRoute(req)
		res.json(
		{ message: 'Hello from API!' });
	}
);

module.exports = router;

function logRoute(request) {
	console.log('\n');
	console.log('### REQUEST ############################################');
	console.log('  Protocol     : ' + request.protocol);
	console.log('  Host         : ' + request.get('host'));
	console.log('  Original URL : ' + request.originalUrl);
	console.log('  Route URL    : ' + request.url);
	console.log('  HTTP Method  : ' + request.method);
}