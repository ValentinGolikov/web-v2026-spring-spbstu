import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            Gadget <span className={styles.logoAccent}>Hub</span>
          </div>
          <p className={styles.tagline}>Магазин надёжных гаджетов</p>
          <p className={styles.copyright}>© 2026 ООО «Гаджет Хаб». Все права защищены</p>
        </div>

        <div className={styles.contacts}>
          <a href="tel:88006783424" className={styles.contactItem}>
            <img src="/images/icons/mobile.svg" alt="" className={styles.contactIcon} />
            8 (800) 678-34-24
          </a>
          <a href="mailto:gadget@hub.ru" className={styles.contactItem}>
            gadget@hub.ru
          </a>
          <span className={styles.contactItem}>
            Санкт-Петербург, ул. Баронная, д.7, корпус 2
          </span>
        </div>

        <div className={styles.socials}>
          <a href="#" className={styles.socialLink} aria-label="VK">
            <img src="/images/social/vk.png" alt="VK" className={styles.socialIcon} />
          </a>
          <a href="#" className={styles.socialLink} aria-label="Telegram">
            <img src="/images/social/telegram.png" alt="Telegram" className={styles.socialIcon} />
          </a>
          <a href="#" className={styles.socialLink} aria-label="WhatsApp">
            <img src="/images/social/whatsapp.png" alt="WhatsApp" className={styles.socialIcon} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
