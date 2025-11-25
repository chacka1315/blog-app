import styles from '../styles/Footer.module.css';

const Footer = function () {
  return (
    <footer>
      <div className={styles.footer}>
        <p>Siaka blog | &copy; 2025 All rights reserved.</p>
        <div>
          <img src="/footer.jpg" alt="" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
