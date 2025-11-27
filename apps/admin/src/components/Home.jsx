import styles from '../styles/Home.module.css';
import { Link } from 'react-router';
import Title from '../../../../packages/ui/Title';
import api from '../../../../packages/client/index';
import { HashLoader } from '../../../../packages/ui/Loader';
import utils from '../../../../packages/utils/index';
import { useState, useEffect } from 'react';
import {
  CircleCheck as PublishedIcon,
  CircleX as NotPublihedIcon,
} from 'lucide-react';

const Home = function () {
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await api.getPosts();

        setPosts(data);

        setError(null);
      } catch (error) {
        console.log(error.msg || 'Something went wrong.');

        setPosts(null);
        setError(error.msg || 'Something went wrong.');
      } finally {
        setIsloading(false);
      }
    };

    getPosts();
  }, []);

  const postsList = posts?.map((post) => {
    return <PostItem post={post} key={post.id} />;
  });

  return (
    <div className={styles.homepage_content}>
      <Title>Home</Title>
      {isLoading && (
        <div className={styles.loading}>
          <HashLoader color="#000" />
        </div>
      )}
      {error && <p>{error}</p>}
      {posts && (postsList || <p>No posts yet.</p>)}
    </div>
  );
};

const PostItem = function ({ post }) {
  return (
    <PostCard>
      <div className={styles.post_title}>
        <Link to={`articles/${post.slug}`}>
          <h1>{post.title}</h1>
        </Link>
        {post.published ? (
          <PublishedIcon color="white" fill="green" />
        ) : (
          <NotPublihedIcon color="white" fill="#bf225a" />
        )}
      </div>
      <div className={styles.snippet}>
        <p>
          {post.snippet}{' '}
          <Link to={`articles/${post.slug}`} className={styles.more_link}>
            More &raquo;
          </Link>
        </p>
      </div>
      <p className={styles.date}>
        {post.published
          ? ` Publihed at ${utils.formatPostDate(post.publishedAt)}`
          : `Last modified ${utils.formatPostDate(post.updatedAt)}`}
      </p>
    </PostCard>
  );
};
const PostCard = function ({ children }) {
  return <div className={styles.post_card}>{children}</div>;
};
export default Home;
