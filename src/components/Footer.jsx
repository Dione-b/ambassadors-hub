import React from 'react';

const Footer = () => (
  <footer className="border-t border-border-subtle py-5 px-6 mt-auto">
    <div className="mx-auto flex max-w-[1200px] items-center justify-between text-xs text-text-muted">
      <span className="font-semibold text-text-secondary">✦ Stellar Ambassadors Hub</span>
      <span>© {new Date().getFullYear()} — Global Ambassador Program</span>
    </div>
  </footer>
);

export default Footer;
