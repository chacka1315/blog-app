import styles from '../styles/Header.module.css';
import { NavLink, Link } from 'react-router';
import Button from '../../../../packages/ui/Button';
import { LogIn, LogOut } from 'lucide-react';
import api from '../../../../packages/client/index';
import {
  CircleUser,
  TextAlignJustify as MenuIcon,
  X as CloseIcon,
} from 'lucide-react';

const Header = function ({ user, uptIsOpen, isOpen }) {
  const openMenu = () => uptIsOpen(true);
  const closeMenu = () => uptIsOpen(false);

  return (
    <header>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Link to="/" end>
            Siaka
          </Link>
        </div>
        <div className={styles.links}>
          <nav>
            <NavLink to="/archive">Archive</NavLink>
            <NavLink to="/about">Bio</NavLink>
          </nav>
          <Link to="https://x.com/siaka190" target="_blank">
            <i class="devicon-twitter-original"></i>
          </Link>
          <Link to="https://github.com/chacka1315" target="_blank">
            <i class="devicon-github-original"></i>
          </Link>
          {user ? (
            <a href="/" className={styles.logout_link} onClick={api.logout}>
              Logout
              <LogOut />
            </a>
          ) : (
            <Link to="/login" className={styles.login_link}>
              <LogIn />
              Sign in
            </Link>
          )}
          <Button className={styles.sub_btn}>Subscribe</Button>
          {user && (
            <div className={styles.avatar}>
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" />
              ) : (
                <CircleUser />
              )}
              <p>{user.username}</p>
            </div>
          )}
        </div>
        <button
          className={styles.menu_toggle}
          onClick={isOpen ? closeMenu : openMenu}
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
