import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { NotFoundError } from './errors/CustomErrors.js';
import routes from './routes/index.js';
import auth from './middlewares/auth.js';
import cors from 'cors';

const app = express();

const blog = express.Router();
const blogAdmin = express.Router();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    process.env.WEB_PAGE_URL,
    process.env.ADMIN_PAGE_URL,
  ],
};

//globals middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
morgan('combined', {
  skip: function (req, res) {
    return res.statusCode < 400;
  },
});

app.use('/api/admin', blogAdmin);
app.use('/api', blog);

// Blog routing
blog.use('/posts', routes.post);
blog.use('/auth', routes.auth);
blog.use('/users', routes.user);

//Blog routing for admins
blogAdmin.use('/auth', routes.auth);
blogAdmin.use('/posts', auth.checkRole('ADMIN'), routes.postAdmin);
blogAdmin.use('/users', auth.checkRole('ADMIN'), routes.userAdmin);
blogAdmin.use('/comments', auth.checkRole('ADMIN'), routes.adminComment);

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
