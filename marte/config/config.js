require('dotenv').config();

module.exports = {
  https: {
    privateKeyPath: 'certificates/privateKey.pem',
    certificatePath: 'certificates/certificate.pem',
    port: process.env.PORT || 9999,
  },
  authentication: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
};