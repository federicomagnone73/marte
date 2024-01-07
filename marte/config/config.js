require('dotenv').config();

module.exports = {
  https: {
    privateKeyPath: 'certificates/privateKey.pem',
    certificatePath: 'certificates/certificate.pem',
	ipaddress: process.env.IPADDRESS || '0.0.0.0',
    port: process.env.PORT || 9999,
  },
  authentication: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
};