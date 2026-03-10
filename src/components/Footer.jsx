import React from 'react';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <span className={styles.brand}>✦ Stellar Ambassadors Hub</span>
      <span className={styles.copy}>
        © {new Date().getFullYear()} — Global Ambassador Program
      </span>
    </div>
  </footer>
);

export default Footer;
