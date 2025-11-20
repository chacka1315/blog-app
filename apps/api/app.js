import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//globals middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//Errors handling
app.use((req, resm, next) => {
  next(new Error('Page not found!'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message,
  });
});

//running the server
const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log('🌎 Blog server is running on PORT ', PORT);
});
