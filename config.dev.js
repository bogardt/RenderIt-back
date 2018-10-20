import path from 'path';

const config = {};

config.logFileDir = path.join(__dirname, './log');
config.logFileName = 'app.log';
config.dbHost = process.env.dbHost || 'localhost';
config.dbPort = process.env.dbPort || '27017';
config.dbName = process.env.dbName || 'data';
config.serverPort = process.env.serverPort || 4000;
config.secretJWT = 'SecretJwtKey';
config.nodeEnv = process.env.NODE_ENV || 'development';
export default config;
