import React from 'react';
import styles from './FilterPanel.module.css';

const PRODUCT_TYPES = [
  'Смартфоны',
  'Фитнес-браслеты',
  'Портативная акустика',
  'Очки виртуальной реальности',
  'Электротранспорт',
  'Умные часы',
];

const COLORS = [
  { value: 'красный', label: 'Красный' },
  { value: 'оранжевый', label: 'Оранжевый' },
  { value: 'желтый', label: 'Жёлтый' },
  { value: 'зеленый', label: 'Зелёный' },
  { value: 'голубой', label: 'Голубой' },
  { value: 'синий', label: 'Синий' },
  { value: 'фиолетовый', label: 'Фиолетовый' },
];

const FilterPanel = ({ filters, onChange, priceMin, priceMax }) => {
  const handlePriceMinChange = (e) => {
    const val = Number(e.target.value);
    onChange({ ...filters, priceMin: val });
  };

  const handlePriceMaxChange = (e) => {
    const val = Number(e.target.value);
    onChange({ ...filters, priceMax: val });
  };

  const handleTypeChange = (type) => {
    const types = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types });
  };

  const handleColorChange = (color) => {
    const colors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onChange({ ...filters, colors });
  };

  const handleReset = () => {
    onChange({
      priceMin,
      priceMax,
      types: [],
      colors: [],
    });
  };

  const handleApply = () => {
    // filters already applied reactively, this just closes on mobile if needed
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Цена, ₽</h3>
        <div className={styles.priceInputs}>
          <div className={styles.priceField}>
            <label className={styles.priceLabel}>От</label>
            <input
              type="number"
              className={styles.priceInput}
              value={filters.priceMin}
              min={priceMin}
              max={filters.priceMax}
              onChange={handlePriceMinChange}
            />
          </div>
          <div className={styles.priceField}>
            <label className={styles.priceLabel}>До</label>
            <input
              type="number"
              className={styles.priceInput}
              value={filters.priceMax}
              min={filters.priceMin}
              max={priceMax}
              onChange={handlePriceMaxChange}
            />
          </div>
        </div>
        <div className={styles.rangeWrapper}>
          <input
            type="range"
            className={styles.range}
            min={priceMin}
            max={priceMax}
            value={filters.priceMin}
            onChange={handlePriceMinChange}
          />
          <input
            type="range"
            className={styles.range}
            min={priceMin}
            max={priceMax}
            value={filters.priceMax}
            onChange={handlePriceMaxChange}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Тип товара</h3>
        <ul className={styles.checkList}>
          {PRODUCT_TYPES.map((type) => (
            <li key={type} className={styles.checkItem}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={filters.types.includes(type)}
                  onChange={() => handleTypeChange(type)}
                />
                {type}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Цвет</h3>
        <ul className={styles.checkList}>
          {COLORS.map(({ value, label }) => (
            <li key={value} className={styles.checkItem}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={filters.colors.includes(value)}
                  onChange={() => handleColorChange(value)}
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <button className={styles.applyBtn} onClick={handleApply}>
          Показать
        </button>
        <button className={styles.resetBtn} onClick={handleReset}>
          Сбросить
        </button>
      </div>
    </aside>
  );
};

export default FilterPanel;
