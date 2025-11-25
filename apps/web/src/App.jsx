import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router';
import styles from './styles/App.module.css';
import { useState, useEffect } from 'react';
import api from '../../../packages/client/index';
import { LogIn, LogOut, CircleUser } from 'lucide-react';
import { NavLink, Link } from 'react-router';
import Button from '../../../packages/ui/Button';

const App = function () {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        const user = await api.getMe();
        setUser(user);
      } catch {
        console.log();
      }
    }
    getUser();
  }, []);

  return (
    <div className={styles.layout}>
      <Header user={user} isOpen={isOpen} uptIsOpen={setIsOpen} />
      <Menu user={user} isOpen={isOpen} uptIsOpen={setIsOpen} />
      <main className={styles.main} style={isOpen ? { display: 'none' } : {}}>
        <Outlet context={{ user }} />
      </main>
      {!isOpen && <Footer />}
    </div>
  );
};

function Menu({ user, isOpen, uptIsOpen }) {
  const handleLogoutLink = () => {
    uptIsOpen(false);
    api.logout();
  };

  const closeMenu = () => uptIsOpen(false);

  return (
    <div
      className={
        isOpen ? `${styles.menu} ${styles.show_menu}` : styles.hide_menu
      }
    >
      {user && (
        <div className={styles.menu_avatar}>
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" />
          ) : (
            <CircleUser />
          )}
          <p>{user.username}</p>
        </div>
      )}

      <NavLink to="/archive" onClick={closeMenu}>
        Archive
      </NavLink>
      <NavLink to="/about" onClick={closeMenu}>
        Bio
      </NavLink>
      <Button className={styles.sub_btn}>Subscribe</Button>

      <Link to="https://x.com/siaka190" target="_blank" onClick={closeMenu}>
        <i class="devicon-twitter-original"></i>
        Twitter
      </Link>
      <Link
        to="https://github.com/chacka1315"
        target="_blank"
        onClick={closeMenu}
      >
        <i class="devicon-github-original"></i>
        Github
      </Link>
      {user ? (
        <a href="/" className={styles.logout_link} onClick={handleLogoutLink}>
          <LogOut size="20px" />
          Logout
        </a>
      ) : (
        <Link to="/login" className={styles.login_link} onClick={closeMenu}>
          <LogIn />
          Sign in
        </Link>
      )}
    </div>
  );
}
export default App;
