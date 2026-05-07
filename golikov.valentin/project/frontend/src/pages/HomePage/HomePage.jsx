import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from '../../components/Carousel/Carousel';
import ProductModal from '../../components/ProductModal/ProductModal';
import styles from './HomePage.module.css';

const ADVANTAGES = [
  {
    icon: '🚀',
    title: 'Утром заказали, вечером получили',
    description: 'Доставка в день заказа по городу',
  },
  {
    icon: '🔄',
    title: 'С товаром что-то не так? Вернём деньги',
    description: 'Гарантия возврата в течение 14 дней',
  },
  {
    icon: '✅',
    title: 'Только оригинальные товары',
    description: 'Все товары сертифицированы и проверены',
  },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/goods');
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const hits = products.filter((p) => p.badge === 'hit');
  const newItems = products.filter((p) => p.badge === 'new');

  return (
    <div className={styles.page}>
      {/* Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerText}>
            <h1 className={styles.bannerTitle}>SUPER SALE</h1>
            <div className={styles.bannerDiscount}>-10%</div>
            <p className={styles.bannerSubtitle}>Умный робот-друг Red solution Reddy Air</p>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : (
          <>
            <Carousel
              title="Хиты продаж"
              description="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надёжные гаджеты"
              icon="🔥"
              products={hits}
              onProductClick={setSelectedProduct}
            />

            <Carousel
              title="Новинки"
              description="Их только привезли — они уже у нас! Всё самое новое и свежее на рынке электроники"
              icon="✨"
              products={newItems}
              onProductClick={setSelectedProduct}
            />
          </>
        )}

        {/* Advantages */}
        <section className={styles.advantages}>
          <h2 className={styles.advantagesTitle}>Преимущества</h2>
          <div className={styles.advantagesGrid}>
            {ADVANTAGES.map((adv, idx) => (
              <div key={idx} className={styles.advantageCard}>
                <span className={styles.advantageIcon}>{adv.icon}</span>
                <h3 className={styles.advantageTitle}>{adv.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Contacts */}
        <section className={styles.contacts}>
          <h2 className={styles.contactsTitle}>Работаем 24/7</h2>
          <div className={styles.contactsRow}>
            <span className={styles.contactItem}>
              📱 8 (800) 678-34-24
            </span>
            <span className={styles.contactItem}>
              ✉️ gadget@hub.ru
            </span>
            <span className={styles.contactItem}>
              📍 Санкт-Петербург, ул. Баронная, д.7, корпус 2
            </span>
          </div>
        </section>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default HomePage;
