import React, { useState } from 'react';
import styles from './CheckoutForm.module.css';

const PAYMENT_OPTIONS = [
  { value: '', label: 'Не выбрано' },
  { value: 'card', label: 'Банковская карта' },
  { value: 'cash', label: 'Наличные при получении' },
  { value: 'online', label: 'Онлайн-оплата' },
];

const validatePhone = (phone) =>
  /^(\+7|8)\d{10}$/.test(phone.replace(/[\s\-()]/g, ''));

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const CheckoutForm = ({ onSubmit, submitError }) => {
  const [form, setForm] = useState({
    phone: '',
    email: '',
    delivery: 'pickup',
    address: '',
    paymentMethod: '',
    needsWrapping: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!validatePhone(form.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }
    if (!validateEmail(form.email)) {
      newErrors.email = 'Введите корректный email';
    }
    if (form.delivery === 'delivery' && !form.address.trim()) {
      newErrors.address = 'Введите адрес доставки';
    }
    if (!form.paymentMethod) {
      newErrors.paymentMethod = 'Выберите способ оплаты';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>Оформление заказа</h2>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>
            Телефон <span className={styles.required}>*</span>
          </label>
          <input
            type="tel"
            name="phone"
            className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
            value={form.phone}
            onChange={handleChange}
            placeholder="+7XXXXXXXXXX"
          />
          {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            E-mail <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            name="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            value={form.email}
            onChange={handleChange}
            placeholder="example@mail.ru"
          />
          {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
        </div>
      </div>

      <div className={styles.radioGroup}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="delivery"
            value="pickup"
            checked={form.delivery === 'pickup'}
            onChange={handleChange}
            className={styles.radio}
          />
          Самовывоз
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="delivery"
            value="delivery"
            checked={form.delivery === 'delivery'}
            onChange={handleChange}
            className={styles.radio}
          />
          Доставка
        </label>
      </div>

      {form.delivery === 'delivery' && (
        <div className={styles.field}>
          <label className={styles.label}>
            Адрес доставки <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="address"
            className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
            value={form.address}
            onChange={handleChange}
            placeholder="Город, улица, дом, квартира"
          />
          {errors.address && <span className={styles.errorMsg}>{errors.address}</span>}
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>Способ оплаты</label>
        <select
          name="paymentMethod"
          className={`${styles.select} ${errors.paymentMethod ? styles.inputError : ''}`}
          value={form.paymentMethod}
          onChange={handleChange}
        >
          {PAYMENT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.paymentMethod && (
          <span className={styles.errorMsg}>{errors.paymentMethod}</span>
        )}
      </div>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          name="needsWrapping"
          checked={form.needsWrapping}
          onChange={handleChange}
          className={styles.checkbox}
        />
        Нужна упаковка
      </label>

      {submitError && <p className={styles.submitError}>{submitError}</p>}

      <button type="submit" className={styles.submitBtn}>
        Оформить заказ
      </button>
    </form>
  );
};

export default CheckoutForm;
