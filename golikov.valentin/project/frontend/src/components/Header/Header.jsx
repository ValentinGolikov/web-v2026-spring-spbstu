import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const { totalCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Gadget <span className={styles.logoAccent}>Hub</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/catalog" className={styles.navLink}>
            <img src="/images/icons/catalog.svg" alt="" className={styles.navIcon} />
            Каталог
          </Link>
          <Link to="/cart" className={styles.navLink}>
            <img src="/images/icons/card.svg" alt="" className={styles.navIcon} />
            Корзина
            {totalCount > 0 && (
              <span className={styles.badge}>{totalCount}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <button className={styles.navLink} onClick={logout}>
              <img src="/images/icons/profile.svg" alt="" className={styles.navIcon} />
              {user?.login}
            </button>
          ) : (
            <Link to="/login" className={styles.navLink}>
              <img src="/images/icons/profile.svg" alt="" className={styles.navIcon} />
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
