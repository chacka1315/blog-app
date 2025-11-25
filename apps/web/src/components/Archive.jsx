import styles from '../styles/Archive.module.css';
import Title from '../../../../packages/ui/Title';
import { Link } from 'react-router';
import { HashLoader } from '../../../../packages/ui/Loader';
import utils from '../../../../packages/utils/index';
import api from '../../../../packages/client/index';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link as LinkSvg } from 'lucide-react';

const Archive = function () {
  const [archive, setArchive] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getArchive = async () => {
      try {
        const data = await api.getArchive();
        setArchive(data);
        setError(null);
      } catch (error) {
        setArchive(null);
        setError(error.msg || 'A network error accountered.');
      } finally {
        setIsLoading(false);
      }
    };

    getArchive();
  }, []);

  const archiveList = archive?.map((archive) => {
    return (
      <div key={archive.id} className={styles.archive_card}>
        <h2>
          <LinkSvg />
          <Link to={`/articles/${archive.slug}`}>{archive.title}</Link>
        </h2>
        <p className={styles.date}>
          {utils.formatPostDate(archive.publishedAt)}
        </p>
      </div>
    );
  });

  return (
    <div className={styles.archive}>
      <Title>Archive</Title>
      {isLoading && (
        <div className={styles.loading}>
          <HashLoader color="#bf225a" />
        </div>
      )}
      {error && <p>{error}</p>}
      {archive && (
        <>
          <h1>Archive</h1>
          {archiveList}
        </>
      )}
    </div>
  );
};
export default Archive;
