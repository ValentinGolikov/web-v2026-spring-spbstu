import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CartItem from '../../components/CartItem/CartItem';
import CheckoutForm from '../../components/CheckoutForm/CheckoutForm';
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import OrderSuccessModal from '../../components/OrderSuccessModal/OrderSuccessModal';
import styles from './CartPage.module.css';

const CartPage = () => {
  const {
    items,
    selectedTotal,
    removeItem,
    updateQuantity,
    toggleSelect,
    selectAll,
    clearCart,
  } = useCart();

  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('cart');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Load order history when switching to history tab
  useEffect(() => {
    if (activeTab === 'history' && isAuthenticated) {
      setOrdersLoading(true);
      axios.get('/api/orders')
        .then(({ data }) => {
          if (data.success) setOrders(data.orders);
        })
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, isAuthenticated]);

  // Derived
  const selectedItems = items.filter((i) => i.selected);
  const allSelected = items.length > 0 && items.every((i) => i.selected);

  // Delete handlers
  const handleDeleteClick = (item) => setDeleteTarget({ item });
  const handleDeleteAllClick = () => setDeleteTarget('all');

  const handleConfirmDelete = () => {
    if (deleteTarget === 'all') {
      selectedItems.forEach((i) => removeItem(i.product.id));
    } else if (deleteTarget?.item) {
      removeItem(deleteTarget.item.product.id);
    }
    setDeleteTarget(null);
  };

  // Checkout
  const handleCheckout = async (formData) => {
    setSubmitError('');
    const orderItems = selectedItems.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      quantity: i.quantity,
      price: i.product.price,
    }));

    try {
      const { data } = await axios.post('/api/orders', {
        items: orderItems,
        ...formData,
      });
      if (data.success) {
        setOrderNumber(data.orderId);
      }
    } catch (err) {
      setSubmitError('Не удалось оформить заказ. Попробуйте ещё раз.');
    }
  };

  const handleOrderSuccess = () => {
    clearCart();
    setOrderNumber(null);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${d.getFullYear()}`;
  };

  const deleteModalName =
    deleteTarget === 'all'
      ? 'выбранные товары'
      : deleteTarget?.item?.product?.name || '';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'cart' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('cart')}
          >
            Корзина
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('history')}
          >
            История заказов
          </button>
        </div>

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <>
            {items.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>🛒</div>
                <h2 className={styles.emptyTitle}>Пока пусто</h2>
                <p className={styles.emptyText}>
                  Ознакомьтесь с новинками и хитами на главной или найдите нужное в каталоге
                </p>
                <div className={styles.emptyActions}>
                  <Link to="/catalog" className={styles.catalogBtn}>
                    Перейти в каталог
                  </Link>
                  <Link to="/" className={styles.homeLink}>
                    Главная страница
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.cartBox}>
                  {/* Controls */}
                  <div className={styles.controls}>
                    <label className={styles.selectAllLabel}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={allSelected}
                        onChange={selectAll}
                      />
                      Выбрать все
                    </label>
                    {selectedItems.length > 0 && (
                      <button
                        className={styles.deleteAllBtn}
                        onClick={handleDeleteAllClick}
                      >
                        × Удалить все
                      </button>
                    )}
                  </div>

                  {/* Items */}
                  {items.map((item) => (
                    <CartItem
                      key={item.product.id}
                      item={item}
                      onQuantityChange={updateQuantity}
                      onDelete={handleDeleteClick}
                      onToggleSelect={toggleSelect}
                    />
                  ))}

                  {/* Summary */}
                  <div className={styles.summary}>
                    <span className={styles.summaryText}>
                      {selectedItems.reduce((s, i) => s + i.quantity, 0)} товара на{' '}
                      <strong>{selectedTotal.toLocaleString('ru-RU')} ₽</strong>
                    </span>
                  </div>
                </div>

                {/* Checkout Form */}
                {selectedItems.length > 0 && (
                  <CheckoutForm
                    onSubmit={handleCheckout}
                    submitError={submitError}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className={styles.historyBox}>
            {!isAuthenticated ? (
              <p className={styles.historyEmpty}>
                <Link to="/login" className={styles.catalogBtn}>Войдите</Link>, чтобы увидеть историю заказов
              </p>
            ) : ordersLoading ? (
              <p className={styles.historyEmpty}>Загрузка...</p>
            ) : orders.length === 0 ? (
              <p className={styles.historyEmpty}>История заказов пуста</p>
            ) : (
              <table className={styles.historyTable}>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderId} className={styles.historyRow}>
                      <td className={styles.historyCell}>
                        № {order.orderId} от {formatDate(order.createdAt)}
                      </td>
                      <td className={styles.historyCell}>
                        {order.items.reduce((s, i) => s + i.quantity, 0)} товара
                      </td>
                      <td className={`${styles.historyCell} ${styles.historyCellRight}`}>
                        {order.total.toLocaleString('ru-RU')} ₽
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        productName={deleteModalName}
        isOpen={!!deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <OrderSuccessModal
        orderNumber={orderNumber}
        isOpen={!!orderNumber}
        onClose={handleOrderSuccess}
      />
    </div>
  );
};

export default CartPage;
