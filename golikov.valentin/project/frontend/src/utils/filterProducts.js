export const filterProducts = (products, filters) => {
  const { priceMin, priceMax, types = [], colors = [] } = filters;

  return products.filter((product) => {
    // Filter by price range
    if (priceMin !== undefined && product.price < priceMin) return false;
    if (priceMax !== undefined && product.price > priceMax) return false;

    // Filter by product type (empty array = no filter)
    if (types.length > 0 && !types.includes(product.category)) return false;

    // Filter by color (empty array = no filter)
    if (colors.length > 0 && !colors.includes(product.color)) return false;

    return true;
  });
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  switch (sortBy) {
    case 'popular':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'cheap':
      return sorted.sort((a, b) => a.price - b.price);
    case 'expensive':
      return sorted.sort((a, b) => b.price - a.price);
    case 'new':
    default:
      return sorted.filter((p) => p.badge === 'new').concat(
        sorted.filter((p) => p.badge !== 'new')
      );
  }
};
