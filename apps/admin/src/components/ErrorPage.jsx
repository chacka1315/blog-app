import styles from '../styles/ErrorPage.module.css';
import Title from '../../../../packages/ui/Title';
import { ClimbingBoxLoader } from '../../../../packages/ui/Loader';
import { Link } from 'react-router';

const ErrorPage = function () {
  return (
    <div className={styles.error_page}>
      <Title>404</Title>

      <ClimbingBoxLoader color="#fff" />
      <h1>Hmm...this page doesn't exist.</h1>

      <Link to="/">Back to home</Link>
    </div>
  );
};

export default ErrorPage;
