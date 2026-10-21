import { useState, useEffect } from 'react';
import { fetchProducts } from '../data/fetchProducts.js';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const data = await fetchProducts(controller.signal);

        setProducts(data);
        setProductsError('');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setProductsError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    products,
    loadingProducts,
    productsError
  };
}