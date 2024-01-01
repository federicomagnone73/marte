const express = require('express');
const https   = require('https');
const fs      = require('fs');
const path    = require('path');
const config  = require('./config/config');

const app = express();
const { privateKeyPath, certificatePath, port } = config.https;

// Imposta il percorso ai certificati HTTPS
const privateKey  = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const options = { key: privateKey, cert: certificate };

// Utilizza le rotte definite in apiRoutes.js
const routeInfo = require('./routes/routeInfo');
app.use('/api/info', routeInfo);

// Crea il server HTTPS
const httpsServer = https.createServer(options, app);

// Avvia il server sulla porta specificata
httpsServer.listen(
  port, () => {
    console.log(`Server running on https://localhost:${port}`);
  }
);
