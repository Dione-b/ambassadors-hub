import React from 'react';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <span className={styles.brand}>✦ Stellar Ambassadors Hub Brazil</span>
      <span className={styles.copy}>© {new Date().getFullYear()} — Simulação Educacional</span>
    </div>
  </footer>
);

export default Footer;
