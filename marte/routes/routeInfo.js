const express = require('express');
const router  = express.Router();
const config  = require('../config/config');

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

// Rotte API REST
router.get(
  '/', 
  (req, res) => {
    console.log("HERE");
    res.json(
      { message: 'Hello from API!' });
  }
);

module.exports = router;