import { useEffect, useState } from 'react';

export default function ApiProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  const controller = new AbortController();

  async function fetchProducts() {
    try {
      const response = await fetch(
        'https://dummyjson.com/products?limit=8',
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error('Không thể tải sản phẩm');
      }

      const data = await response.json();

      setProducts(
        data.products.map((product) => ({
          id: product.id,
          name: product.title,
          price: product.price,
          category: product.category,
          stocked: product.stock > 0
        }))
      );
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error.message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }

  fetchProducts();

  return () => {
    controller.abort();
  };
}, []);

  if (loading) {
    return <p>Đang tải sản phẩm...</p>;
  }

  if (error) {
    return <p>Lỗi: {error}</p>;
  }

  return (
  <section>
    <h2>Sản phẩm lấy từ API</h2>

    {products.map((product) => (
      <article key={product.id}>
        <h3>{product.name}</h3>
        <p>Giá: ${product.price}</p>
        <p>Danh mục: {product.category}</p>
        <p>
          {product.stocked ? 'Còn hàng' : 'Tạm hết hàng'}
        </p>
      </article>
    ))}
  </section>
);
}