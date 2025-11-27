import Header from './components/Header';
import { Outlet } from 'react-router';
import styles from './styles/App.module.css';
import { useState, useEffect } from 'react';
import api from '../../../packages/client/index';
import { useNavigate } from 'react-router';

const App = function () {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        const user = await api.getMe();
        if (user.role !== 'ADMIN') return navigate('/auth', { replace: true });
        setUser(user);
      } catch {
        navigate('/auth', { replace: true });
        console.log();
      }
    }
    getUser();
  }, []);

  if (!user) return null;
  return (
    <div className={styles.layout}>
      <Header user={user} />
      <main className={styles.main}>
        <Outlet context={{ user }} />
      </main>
    </div>
  );
};

export default App;
