import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import ProductCard from '../../components/ProductCard/ProductCard';
import Pagination from '../../components/Pagination/Pagination';
import ProductModal from '../../components/ProductModal/ProductModal';
import { filterProducts, sortProducts } from '../../utils/filterProducts';
import styles from './CatalogPage.module.css';

const ITEMS_PER_PAGE = 9;

const SORT_OPTIONS = [
  { value: 'new', label: 'Новые' },
  { value: 'popular', label: 'Популярные' },
  { value: 'cheap', label: 'Подешевле' },
  { value: 'expensive', label: 'Подороже' },
];

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('new');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 100000,
    types: [],
    colors: [],
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/goods');
        setProducts(data);
        const prices = data.map((p) => p.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setPriceRange({ min, max });
        setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max }));
      } catch (err) {
        setError('Не удалось загрузить товары. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredAndSorted = useMemo(() => {
    const filtered = filterProducts(products, filters);
    return sortProducts(filtered, sortBy);
  }, [products, filters, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginated = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Загрузка товаров...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Каталог товаров</h1>

        <div className={styles.sortTabs}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.sortTab} ${sortBy === opt.value ? styles.sortTabActive : ''}`}
              onClick={() => handleSortChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          <div className={styles.grid}>
            {paginated.length === 0 ? (
              <p className={styles.empty}>Товары не найдены. Попробуйте изменить фильтры.</p>
            ) : (
              paginated.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenModal={setSelectedProduct}
                />
              ))
            )}
          </div>

          <FilterPanel
            filters={filters}
            onChange={handleFiltersChange}
            priceMin={priceRange.min}
            priceMax={priceRange.max}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default CatalogPage;
