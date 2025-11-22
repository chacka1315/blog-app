import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { NotFoundError } from './errors/CustomErrors.js';
import routes from './routes/index.js';
import auth from './middlewares/auth.js';

const app = express();

const blog = express.Router();
const blogAdmin = express.Router();

//globals middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/admin', auth.checkRole('ADMIN'), blogAdmin);
app.use('/api', blog);

// Blog routing
blog.use('/posts', routes.post);
blog.use('/auth', routes.auth);
blog.use('/users', routes.user);

//Blog routing for admins
blogAdmin.use('/posts', routes.postAdmin);
blogAdmin.use('/users', routes.userAdmin);
blogAdmin.use('/comments', routes.adminComment);

app.use((req, res) => {
  const error = new NotFoundError('This page does not exist.');
  res.status(error.statusCode).json({
    msg: error.message,
  });
});

//Errors handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    msg: 'Server is broken, try later...',
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
