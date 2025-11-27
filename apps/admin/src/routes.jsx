import Home from './components/Home';
import Auth from './components/Auth';
import ErrorPage from './components/ErrorPage';
import Article from './components/Article';
import NewPost from './components/NewPost';
import UpdatePost from './components/updatePost';
import App from './App';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'articles/:slug', element: <Article /> },
      { path: '/newpost', element: <NewPost /> },
      { path: '/updatepost/:slug', element: <UpdatePost /> },
    ],
  },
  { path: '/auth', element: <Auth />, errorElement: <ErrorPage /> },
];

export default routes;
