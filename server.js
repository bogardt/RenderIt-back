import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import config from './config.dev';
import logger from './modules/winston';
import connectToMongo from './modules/mongo';
import users from './routes/users';

const port = config.serverPort;

logger.stream = {
  write(message) {
    logger.info(message);
  }
};

connectToMongo();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev', { stream: logger.stream }));

app.use('/api/users', users);

app.get('/', (req, res) => {
  res.send('Invalid endpoint!');
});

app.listen(port, () => {
  logger.info('server started - ', port);
});
