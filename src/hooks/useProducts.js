import { useState, useEffect, useReducer } from 'react';
import { fetchProducts } from '../data/fetchProducts.js';

const CACHE_KEY = 'pharmacy_products';

// Lấy sản phẩm đã lưu
function getCachedProducts() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
  } catch {
    return [];
  }
}

// Reducer
function productsReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: ''
      };

    case 'FETCH_SUCCESS':
      return {
        products: action.payload,
        loading: false,
        error: ''
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
}

// State ban đầu
const initialState = {
  products: getCachedProducts(),
  loading: true,
  error: ''
};

// Custom Hook
export default function useProducts() {
  const [state, dispatch] = useReducer(
    productsReducer,
    initialState
  );

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      dispatch({ type: 'FETCH_START' });

      try {
        const data = await fetchProducts(controller.signal);

        if (!controller.signal.aborted) {
          // Lưu sản phẩm vào localStorage
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify(data)
          );

          dispatch({
            type: 'FETCH_SUCCESS',
            payload: data
          });
        }
      } catch (error) {
        if (
          error.name !== 'AbortError' &&
          !controller.signal.aborted
        ) {
          dispatch({
            type: 'FETCH_ERROR',
            payload: error.message
          });
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [reloadKey]);

  function retryLoading() {
    setReloadKey((previousKey) => previousKey + 1);
  }

  return {
    products: state.products,
    loadingProducts: state.loading,
    productsError: state.error,
    retryLoading
  };
}