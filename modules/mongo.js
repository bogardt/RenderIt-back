import Mongoose from 'mongoose';
import logger from 'winston';
import config from '../config.dev';

Mongoose.Promise = global.Promise;

const connectToMongo = async () => {
  try {
    await Mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`);
    logger.info('Connected to mongo!!!');
  } catch (err) {
    logger.error('Could not connect to MongoDB');
  }
};

export default connectToMongo;
