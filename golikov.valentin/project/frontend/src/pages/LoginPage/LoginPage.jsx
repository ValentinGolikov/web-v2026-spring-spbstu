import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.login.trim() || !form.password.trim()) {
      setError('Введите логин и пароль');
      return;
    }
    setLoading(true);
    const success = await login(form);
    setLoading(false);
    if (success) {
      navigate('/');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className={styles.page}>
      {/* Decorative illustration */}
      <div className={styles.illustration}>
        <div className={styles.shapes}>
          <div className={`${styles.shape} ${styles.shapeBlue}`} />
          <div className={`${styles.shape} ${styles.shapeGreen}`} />
          <div className={`${styles.shape} ${styles.shapePink}`} />
          <div className={`${styles.shape} ${styles.shapeYellow}`} />
        </div>
        <div className={styles.gadgets}>
          <span className={styles.gadget} style={{ fontSize: 80, top: '10%', left: '5%' }}>💻</span>
          <span className={styles.gadget} style={{ fontSize: 60, top: '50%', left: '15%' }}>📱</span>
          <span className={styles.gadget} style={{ fontSize: 70, bottom: '10%', left: '8%' }}>🎧</span>
          <span className={styles.gadget} style={{ fontSize: 64, top: '15%', right: '10%' }}>📷</span>
          <span className={styles.gadget} style={{ fontSize: 72, bottom: '15%', right: '5%' }}>🖥️</span>
        </div>
      </div>

      {/* Form */}
      <div className={styles.formWrapper}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h1 className={styles.title}>Добро пожаловать!</h1>

          <div className={styles.field}>
            <label className={styles.label}>
              Логин <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="login"
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              value={form.login}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Пароль <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              name="password"
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
