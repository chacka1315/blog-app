import { HashLoader } from 'react-spinners';
import { LoaderCircle as LoaderIcon } from 'lucide-react';
import styles from './styles/Loader.module.css';
import { ClimbingBoxLoader } from 'react-spinners';
const LoaderCircle = function () {
  return (
    <div className={styles.loader_circle}>
      <LoaderIcon />
    </div>
  );
};

export { LoaderCircle, HashLoader, ClimbingBoxLoader };
