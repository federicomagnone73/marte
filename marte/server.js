const express = require('express');
const https   = require('https');
const fs      = require('fs');
const path    = require('path');
const config  = require('./config/config');

const app = express();
const { 
	privateKeyPath, 
	certificatePath,
	ipaddress,	
	port 
} = config.https;

// Imposta il percorso ai certificati HTTPS
const privateKey  = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const options     = { key: privateKey, cert: certificate };

// Utilizza le rotte definite in apiRoutes.js
const routeInfo = require('./routes/routeInfo');
app.use('/api/info', routeInfo);

// Crea il server HTTPS
const httpsServer = https.createServer(options, app);

// Avvia il server sulla porta specificata
httpsServer.listen(
  port, 
  ipaddress,
  () => {
	console.log('### SERVER #############################################');
    console.log('  Server is running');
    console.log('  IP Address : ' + httpsServer.address().address);
    console.log('  Port       : ' + httpsServer.address().port);	
	console.log('  URL Info   : https://' + httpsServer.address().address + ':' + httpsServer.address().port + '/api/info');
  }
);
